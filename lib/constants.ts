import { formatPrice } from "./format";
import { formatProductCategory } from "./product-taxonomy";
import type { ProductWithDetails } from "./types";

// Local image paths for static assets (hero, editorial, etc.)
export const images = {
  hero: "/images/products/hero-main.webp",
  editorial: "/images/products/editorial-detail.webp",
  featuredPants: "/images/products/featured-pants.webp",
  featuredShoes: "/images/products/featured-shoes.webp",
  newsletter: "/images/products/newsletter-bag.webp",
  sidebarSneaker: "/images/products/sidebar-sneaker.webp",
  sidebarCoat: "/images/products/sidebar-coat.webp",
  collectionThumb: "/images/products/collection-thumb.webp"
};

// Helper to get lowest price for a product
export function getLowestPrice(product: ProductWithDetails): number {
  if (!product.variants || product.variants.length === 0) return 0;
  return Math.min(...product.variants.map((v) => v.price_cents));
}

// Helper to get compare-at price (for sale display)
export function getCompareAtPrice(product: ProductWithDetails): number | null {
  const variant = product.variants?.find((v) => v.compare_at_price_cents);
  return variant?.compare_at_price_cents ?? null;
}

export function getSortedProductImages(product: ProductWithDetails) {
  return [...(product.images || [])].sort((leftImage, rightImage) => {
    if (leftImage.sort_order !== rightImage.sort_order) {
      return leftImage.sort_order - rightImage.sort_order;
    }

    return leftImage.created_at.localeCompare(rightImage.created_at);
  });
}

// Helper to get product image
export function getProductImage(product: ProductWithDetails): string {
  const images = getSortedProductImages(product);

  if (images.length > 0) {
    return images[0].url;
  }

  return "";
}

// Format product for shop display
export function formatProductForDisplay(product: ProductWithDetails) {
  return {
    name: product.name,
    slug: product.slug,
    material: product.material || "",
    category: product.category || "",
    categoryGroup: product.category_group || "",
    categoryLabel: formatProductCategory(product),
    season: product.season || "",
    price: formatPrice(getLowestPrice(product)),
    originalPrice: getCompareAtPrice(product)
      ? formatPrice(getCompareAtPrice(product)!)
      : undefined,
    image: getProductImage(product),
    badge: product.is_archived ? "Arhivă" : undefined
  };
}
