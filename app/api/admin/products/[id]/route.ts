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

async function assertAdmin() {
  const adminAccess = await requireAdminUser();

  if (!adminAccess.authorized) {
    return NextResponse.json(
      { error: adminAccess.status === 401 ? "Unauthorized" : "Forbidden" },
      { status: adminAccess.status }
    );
  }

  return null;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const deniedResponse = await assertAdmin();

  if (deniedResponse) {
    return deniedResponse;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, variants:product_variants(*), images:product_images(*)")
    .eq("id", params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const deniedResponse = await assertAdmin();

  if (deniedResponse) {
    return deniedResponse;
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
  const { error: productError } = await supabase
    .from("products")
    .update({
      name,
      slug,
      description,
      category,
      material,
      season,
      is_archived: Boolean(is_archived),
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.id);

  if (productError) {
    return NextResponse.json({ error: productError.message }, { status: 500 });
  }

  await supabase.from("product_variants").delete().eq("product_id", params.id);

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
          product_id: params.id,
          size: variant.size || null,
          color: variant.color || null,
          price_cents: variant.price_cents,
          compare_at_price_cents: variant.compare_at_price_cents || null,
          stock: variant.stock || 0,
          sku: variant.sku || null,
        }))
      );

    if (variantsError) {
      return NextResponse.json({ error: variantsError.message }, { status: 500 });
    }
  }

  await supabase.from("product_images").delete().eq("product_id", params.id);

  if (image_url) {
    const { error: imageError } = await supabase.from("product_images").insert({
      product_id: params.id,
      url: image_url,
      alt_text: image_alt_text || name,
      sort_order: 0,
    });

    if (imageError) {
      return NextResponse.json({ error: imageError.message }, { status: 500 });
    }
  }

  const { data, error } = await supabase
    .from("products")
    .select("*, variants:product_variants(*), images:product_images(*)")
    .eq("id", params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const deniedResponse = await assertAdmin();

  if (deniedResponse) {
    return deniedResponse;
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
