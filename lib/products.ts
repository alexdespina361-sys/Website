import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseAdminClient } from "./supabase-server";
import type { ProductWithDetails } from "./types";

export async function getProducts(): Promise<ProductWithDetails[]> {
  noStore();
  const supabase = createSupabaseAdminClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*, variants:product_variants(*), images:product_images(*)")
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return (products as ProductWithDetails[]) || [];
}

export async function getProductBySlug(
  slug: string
): Promise<ProductWithDetails | null> {
  noStore();
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, variants:product_variants(*), images:product_images(*)")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  return data as ProductWithDetails;
}

export async function getFeaturedProducts(): Promise<ProductWithDetails[]> {
  noStore();
  const supabase = createSupabaseAdminClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*, variants:product_variants(*), images:product_images(*)")
    .eq("is_archived", false)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }

  return (products as ProductWithDetails[]) || [];
}
