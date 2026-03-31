export interface VariantPayload {
  size?: string | null;
  color?: string | null;
  price_cents: number;
  compare_at_price_cents?: number | null;
  stock?: number;
  sku?: string | null;
}

export interface ImagePayload {
  url: string;
  alt_text?: string | null;
  sort_order?: number | null;
}

function toTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toNullableString(value: unknown) {
  const normalizedValue = toTrimmedString(value);
  return normalizedValue || null;
}

function toNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function normalizeVariants(variants: unknown) {
  if (!Array.isArray(variants)) {
    return [];
  }

  return (variants as VariantPayload[])
    .map((variant) => ({
      size: toNullableString(variant.size),
      color: toNullableString(variant.color),
      price_cents: toNumber(variant.price_cents),
      compare_at_price_cents:
        typeof variant.compare_at_price_cents === "number" &&
        Number.isFinite(variant.compare_at_price_cents)
          ? variant.compare_at_price_cents
          : null,
      stock: Math.max(0, toNumber(variant.stock)),
      sku: toNullableString(variant.sku)
    }))
    .filter(
      (variant) =>
        (variant.size || variant.color) &&
        Number.isFinite(variant.price_cents) &&
        variant.price_cents > 0
    );
}

export function normalizeImages({
  images,
  image_url,
  image_alt_text,
  defaultAltText
}: {
  images: unknown;
  image_url?: unknown;
  image_alt_text?: unknown;
  defaultAltText?: string;
}) {
  const fallbackAltText = toTrimmedString(defaultAltText) || null;

  const normalizedImages = Array.isArray(images)
    ? (images as ImagePayload[])
        .map((image, index) => ({
          url: toTrimmedString(image.url),
          alt_text: toNullableString(image.alt_text) || fallbackAltText,
          sort_order:
            typeof image.sort_order === "number" &&
            Number.isFinite(image.sort_order)
              ? image.sort_order
              : index
        }))
        .filter((image) => Boolean(image.url))
    : [];

  if (normalizedImages.length > 0) {
    return Array.from(
      new Map(normalizedImages.map((image) => [image.url, image])).values()
    );
  }

  const legacyImageUrl = toTrimmedString(image_url);

  if (!legacyImageUrl) {
    return [];
  }

  return [
    {
      url: legacyImageUrl,
      alt_text: toNullableString(image_alt_text) || fallbackAltText,
      sort_order: 0
    }
  ];
}
