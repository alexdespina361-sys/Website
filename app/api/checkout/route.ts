import { NextResponse } from "next/server";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase-server";
import {
  createOrderWithItems,
  resolveCheckoutItems,
} from "@/lib/order-processing";
import {
  formatShippingAddress,
  isShippingAddressComplete,
  normalizeShippingAddressDraft,
  type ShippingAddressDraft,
} from "@/lib/shipping-addresses";
import { sendOrderConfirmation } from "@/lib/email";
import type { SupabaseClient } from "@supabase/supabase-js";

interface CheckoutItemInput {
  variantId: string;
  quantity: number;
}

async function resolveShippingAddress(params: {
  supabase: SupabaseClient;
  userId: string | null;
  shippingAddressId?: string | null;
  shippingAddress?: ShippingAddressDraft | null;
  selectedShippingAddress?: ShippingAddressDraft | null;
  saveAddress?: boolean;
}) {
  const {
    supabase,
    userId,
    shippingAddressId,
    shippingAddress,
    selectedShippingAddress,
    saveAddress,
  } = params;

  if (shippingAddressId && userId) {
    const { data: savedAddress, error } = await supabase
      .from("shipping_addresses")
      .select("*")
      .eq("id", shippingAddressId)
      .eq("user_id", userId)
      .single();

    if (!error && savedAddress) {
      return {
        address: {
          label: savedAddress.label,
          recipient_name: savedAddress.recipient_name,
          phone: savedAddress.phone || "",
          address_line1: savedAddress.address_line1,
          address_line2: savedAddress.address_line2 || "",
          city: savedAddress.city,
          region: savedAddress.region || "",
          postal_code: savedAddress.postal_code || "",
          country: savedAddress.country,
          is_default: savedAddress.is_default,
        } satisfies ShippingAddressDraft,
        shippingAddressId: savedAddress.id,
      };
    }

    if (selectedShippingAddress) {
      const normalizedSnapshot = normalizeShippingAddressDraft(
        selectedShippingAddress
      );

      if (isShippingAddressComplete(normalizedSnapshot)) {
        return {
          address: normalizedSnapshot,
          shippingAddressId: null,
        };
      }
    }

    throw new Error("Adresa selectata nu mai este disponibila.");
  }

  if (!shippingAddress) {
    throw new Error("Alege sau completeaza o adresa de livrare.");
  }

  const normalizedAddress = normalizeShippingAddressDraft(shippingAddress);

  if (!isShippingAddressComplete(normalizedAddress)) {
    throw new Error("Completeaza numele destinatarului, adresa, orasul si tara.");
  }

  if (userId && saveAddress) {
    if (normalizedAddress.is_default) {
      await supabase
        .from("shipping_addresses")
        .update({ is_default: false, updated_at: new Date().toISOString() })
        .eq("user_id", userId);
    }

    const { data: insertedAddress, error } = await supabase
      .from("shipping_addresses")
      .insert({
        user_id: userId,
        label: normalizedAddress.label,
        recipient_name: normalizedAddress.recipient_name,
        phone: normalizedAddress.phone || null,
        address_line1: normalizedAddress.address_line1,
        address_line2: normalizedAddress.address_line2 || null,
        city: normalizedAddress.city,
        region: normalizedAddress.region || null,
        postal_code: normalizedAddress.postal_code || null,
        country: normalizedAddress.country,
        is_default: normalizedAddress.is_default,
      })
      .select()
      .single();

    if (error || !insertedAddress) {
      throw new Error(error?.message || "Nu am putut salva adresa in cont.");
    }

    return {
      address: normalizedAddress,
      shippingAddressId: insertedAddress.id,
    };
  }

  return {
    address: normalizedAddress,
    shippingAddressId: null,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items = Array.isArray(body.items) ? (body.items as CheckoutItemInput[]) : [];
    const paymentMethod = String(body.paymentMethod || "cash_on_delivery");

    if (items.length === 0) {
      return NextResponse.json({ error: "Cosul este gol." }, { status: 400 });
    }

    if (paymentMethod !== "cash_on_delivery") {
      return NextResponse.json(
        { error: "Plata cu cardul este dezactivata. Se accepta doar ramburs." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();
    const adminSupabase = createSupabaseAdminClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const resolvedItems = await resolveCheckoutItems(adminSupabase, items);
    const totalCents = resolvedItems.reduce(
      (sum, item) => sum + item.priceCents * item.quantity,
      0
    );

    const { address, shippingAddressId } = await resolveShippingAddress({
      supabase,
      userId: user?.id || null,
      shippingAddressId: body.shippingAddressId,
      shippingAddress: body.shippingAddress || null,
      selectedShippingAddress: body.selectedShippingAddress || null,
      saveAddress: Boolean(body.saveAddress),
    });

    const contactEmail = String(body.contactEmail || user?.email || "").trim();

    if (!contactEmail) {
      return NextResponse.json(
        { error: "Emailul de contact este obligatoriu." },
        { status: 400 }
      );
    }

    const deliveryAddress = formatShippingAddress(address);

    if (user?.id && shippingAddressId && address.is_default) {
      await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        address: deliveryAddress,
        updated_at: new Date().toISOString(),
      });
    }

    const order = await createOrderWithItems(
      adminSupabase,
      {
        userId: user?.id || null,
        shippingAddressId,
        paymentMethod: "cash_on_delivery",
        status: "pending",
        email: contactEmail,
        fullName: address.recipient_name,
        phone: address.phone || null,
        address: deliveryAddress,
        totalCents,
      },
      resolvedItems
    );

    await sendOrderConfirmation({
      orderId: order.id,
      email: order.email,
      fullName: order.full_name,
      totalCents: order.total_cents,
      items: resolvedItems.map((item) => ({
        name: item.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        priceCents: item.priceCents,
      })),
    });

    return NextResponse.json({
      redirectUrl: `/checkout/success?method=cash_on_delivery&order_id=${order.id}`,
    });
  } catch (error) {
    console.error("Checkout error:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Nu am putut confirma comanda.";
    const isSupabasePrivilegedConfigError = errorMessage.includes(
      "SUPABASE_SERVICE_ROLE_KEY"
    );

    return NextResponse.json(
      {
        error: isSupabasePrivilegedConfigError
          ? "Checkout-ul nu este configurat complet pe server. Lipseste cheia de serviciu Supabase necesara pentru rezervarea stocului si crearea comenzilor."
          : errorMessage,
      },
      { status: isSupabasePrivilegedConfigError ? 503 : 500 }
    );
  }
}
