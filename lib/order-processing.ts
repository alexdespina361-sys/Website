import type { SupabaseClient } from "@supabase/supabase-js";

export interface ResolvedCheckoutItem {
  variantId: string;
  productId: string;
  name: string;
  slug: string;
  size: string | null;
  color: string | null;
  quantity: number;
  priceCents: number;
  stock: number;
}

export interface OrderCreationInput {
  userId: string | null;
  shippingAddressId?: string | null;
  paymentMethod: "cash_on_delivery";
  status: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  address: string | null;
  totalCents: number;
}

interface ReservedStockItem {
  variantId: string;
  quantityReserved: number;
}

export async function resolveCheckoutItems(
  supabase: SupabaseClient,
  items: Array<{ variantId: string; quantity: number }>
) {
  const variantIds = Array.from(
    new Set(items.map((item) => item.variantId).filter(Boolean))
  );

  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .select("id, product_id, size, color, price_cents, stock")
    .in("id", variantIds);

  if (variantsError || !variants) {
    throw new Error("Nu am putut încărca variantele selectate.");
  }

  const productIds = Array.from(new Set(variants.map((variant) => variant.product_id)));
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, slug")
    .in("id", productIds);

  if (productsError || !products) {
    throw new Error("Nu am putut încărca produsele selectate.");
  }

  const variantsById = new Map(variants.map((variant) => [variant.id, variant]));
  const productsById = new Map(products.map((product) => [product.id, product]));

  const resolvedItems = items.map((item) => {
    const variant = variantsById.get(item.variantId);
    const product = variant ? productsById.get(variant.product_id) : null;

    if (!variant || !product) {
      return null;
    }

    return {
      variantId: variant.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      size: variant.size,
      color: variant.color,
      quantity: Math.max(1, item.quantity),
      priceCents: variant.price_cents,
      stock: variant.stock,
    } satisfies ResolvedCheckoutItem;
  });

  if (resolvedItems.some((item) => !item)) {
    throw new Error("Una dintre variantele selectate nu mai este disponibilă.");
  }

  const normalizedItems = resolvedItems.filter(
    (item): item is ResolvedCheckoutItem => Boolean(item)
  );

  const soldOutItem = normalizedItems.find(
    (item) => item.stock <= 0 || item.quantity > item.stock
  );

  if (soldOutItem) {
    throw new Error(
      `Stoc insuficient pentru ${soldOutItem.name}. Ajustează cantitatea și încearcă din nou.`
    );
  }

  return normalizedItems;
}

async function reserveVariantStock(
  supabase: SupabaseClient,
  item: ResolvedCheckoutItem
) {
  const { data: variant, error: variantError } = await supabase
    .from("product_variants")
    .select("id, stock")
    .eq("id", item.variantId)
    .single();

  if (variantError || !variant) {
    throw new Error(`Variant ${item.variantId} not found during order processing.`);
  }

  if (variant.stock < item.quantity) {
    throw new Error(`Insufficient stock for variant ${item.variantId}.`);
  }

  const nextStock = variant.stock - item.quantity;
  const { error: updateError, data: updatedVariants } = await supabase
    .from("product_variants")
    .update({
      stock: nextStock,
      updated_at: new Date().toISOString(),
    })
    .eq("id", item.variantId)
    .eq("stock", variant.stock)
    .select("id");

  if (updateError) {
    throw new Error(
      `Failed to reserve stock for variant ${item.variantId}: ${updateError.message}`
    );
  }

  if (!updatedVariants || updatedVariants.length === 0) {
    throw new Error(
      `Failed to reserve stock for variant ${item.variantId}: the stock changed during checkout or the current backend credentials cannot update variants.`
    );
  }

  return {
    variantId: item.variantId,
    quantityReserved: item.quantity,
  } satisfies ReservedStockItem;
}

async function restoreVariantStock(
  supabase: SupabaseClient,
  entry: ReservedStockItem
) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { data: variant, error: variantError } = await supabase
      .from("product_variants")
      .select("id, stock")
      .eq("id", entry.variantId)
      .single();

    if (variantError || !variant) {
      throw new Error(
        `Failed to load variant ${entry.variantId} while restoring stock.`
      );
    }

    const nextStock = variant.stock + entry.quantityReserved;
    const { error: updateError, data: updatedVariants } = await supabase
      .from("product_variants")
      .update({
        stock: nextStock,
        updated_at: new Date().toISOString(),
      })
      .eq("id", entry.variantId)
      .eq("stock", variant.stock)
      .select("id");

    if (updateError) {
      throw new Error(
        `Failed to restore stock for variant ${entry.variantId}: ${updateError.message}`
      );
    }

    if (updatedVariants && updatedVariants.length > 0) {
      return;
    }
  }

  throw new Error(
    `Failed to restore stock for variant ${entry.variantId} after multiple attempts.`
  );
}

export async function restoreReservedStock(
  supabase: SupabaseClient,
  reservedStock: ReservedStockItem[]
) {
  for (const entry of reservedStock) {
    await restoreVariantStock(supabase, entry);
  }
}

export async function createOrderWithItems(
  supabase: SupabaseClient,
  order: OrderCreationInput,
  items: ResolvedCheckoutItem[]
) {
  const reservedStock: ReservedStockItem[] = [];

  try {
    for (const item of items) {
      reservedStock.push(await reserveVariantStock(supabase, item));
    }

    const { data: createdOrder, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: order.userId,
        shipping_address_id: order.shippingAddressId || null,
        payment_method: order.paymentMethod,
        email: order.email,
        full_name: order.fullName,
        phone: order.phone,
        address: order.address,
        total_cents: order.totalCents,
        status: order.status,
        fulfillment_status: "unfulfilled",
      })
      .select()
      .single();

    if (orderError || !createdOrder) {
      throw new Error(orderError?.message || "Failed to create order.");
    }

    const { error: orderItemsError } = await supabase
      .from("order_items")
      .insert(
        items.map((item) => ({
          order_id: createdOrder.id,
          variant_id: item.variantId,
          product_name: item.name,
          variant_info: [item.size, item.color].filter(Boolean).join(", "),
          price_cents: item.priceCents,
          quantity: item.quantity,
        }))
      );

    if (orderItemsError) {
      await supabase.from("orders").delete().eq("id", createdOrder.id);
      throw new Error(orderItemsError.message);
    }

    return createdOrder;
  } catch (error) {
    try {
      await restoreReservedStock(supabase, reservedStock);
    } catch (restoreError) {
      console.error("Failed to restore reserved stock:", restoreError);
    }

    throw error;
  }
}
