/**
 * Format price from cents to RON display string.
 * e.g., 425000 -> "4.250 RON"
 */
export function formatPrice(cents: number): string {
  const ron = cents / 100;
  return ron.toLocaleString("ro-RO", {
    style: "currency",
    currency: "RON",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Format price with decimals for checkout display.
 * e.g., 425000 -> "4.250,00 RON"
 */
export function formatPriceDetailed(cents: number): string {
  const ron = cents / 100;
  return ron.toLocaleString("ro-RO", {
    style: "currency",
    currency: "RON",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
