import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireAdminUser } from "@/lib/admin-guard";

interface VariantPayload {
  size: string;
  color: string;
  price_cents: number;
  compare_at_price_cents?: number | null;
  stock: number;
  sku?: string | null;
}

export async function GET() {
  const adminAccess = await requireAdminUser();

  if (!adminAccess.authorized) {
    return NextResponse.json(
      { error: adminAccess.status === 401 ? "Unauthorized" : "Forbidden" },
      { status: adminAccess.status }
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, variants:product_variants(*), images:product_images(*)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const adminAccess = await requireAdminUser();

  if (!adminAccess.authorized) {
    return NextResponse.json(
      { error: adminAccess.status === 401 ? "Unauthorized" : "Forbidden" },
      { status: adminAccess.status }
    );
  }

  const body = await request.json();
  const {
    name,
    slug,
    description,
    category,
    material,
    season,
    is_archived,
    image_url,
    image_alt_text,
    variants,
  } = body;

  const supabase = createSupabaseAdminClient();
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      name,
      slug,
      description,
      category,
      material,
      season,
      is_archived: Boolean(is_archived),
    })
    .select()
    .single();

  if (productError || !product) {
    return NextResponse.json(
      { error: productError?.message || "Failed to create product" },
      { status: 500 }
    );
  }

  const normalizedVariants = Array.isArray(variants)
    ? (variants as VariantPayload[]).filter(
        (variant) =>
          (variant.size || variant.color) &&
          Number.isFinite(variant.price_cents) &&
          variant.price_cents > 0
      )
    : [];

  if (normalizedVariants.length > 0) {
    const { error: variantsError } = await supabase
      .from("product_variants")
      .insert(
        normalizedVariants.map((variant) => ({
          product_id: product.id,
          size: variant.size || null,
          color: variant.color || null,
          price_cents: variant.price_cents,
          compare_at_price_cents: variant.compare_at_price_cents || null,
          stock: variant.stock || 0,
          sku: variant.sku || null,
        }))
      );

    if (variantsError) {
      await supabase.from("products").delete().eq("id", product.id);
      return NextResponse.json({ error: variantsError.message }, { status: 500 });
    }
  }

  if (image_url) {
    const { error: imageError } = await supabase.from("product_images").insert({
      product_id: product.id,
      url: image_url,
      alt_text: image_alt_text || name,
      sort_order: 0,
    });

    if (imageError) {
      await supabase.from("products").delete().eq("id", product.id);
      return NextResponse.json({ error: imageError.message }, { status: 500 });
    }
  }

  const { data: fullProduct, error: fullProductError } = await supabase
    .from("products")
    .select("*, variants:product_variants(*), images:product_images(*)")
    .eq("id", product.id)
    .single();

  if (fullProductError) {
    return NextResponse.json(
      { error: fullProductError.message },
      { status: 500 }
    );
  }

  return NextResponse.json(fullProduct, { status: 201 });
}
