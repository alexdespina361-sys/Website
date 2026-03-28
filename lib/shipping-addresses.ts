import type { ShippingAddress } from "./types";

export type ShippingAddressDraft = {
  label: string;
  recipient_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
  is_default: boolean;
};

export function createEmptyShippingAddress(
  recipientName = ""
): ShippingAddressDraft {
  return {
    label: "Principală",
    recipient_name: recipientName,
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    region: "",
    postal_code: "",
    country: "România",
    is_default: true,
  };
}

export function formatShippingAddress(address: {
  recipient_name?: string | null;
  phone?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  region?: string | null;
  postal_code?: string | null;
  country?: string | null;
}) {
  return [
    address.recipient_name,
    [address.address_line1, address.address_line2].filter(Boolean).join(", "),
    [address.city, address.region, address.postal_code].filter(Boolean).join(", "),
    address.country,
    address.phone,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function formatShippingAddressLines(
  address: Pick<
    ShippingAddressDraft,
    | "recipient_name"
    | "phone"
    | "address_line1"
    | "address_line2"
    | "city"
    | "region"
    | "postal_code"
    | "country"
  >
) {
  return [
    address.recipient_name,
    [address.address_line1, address.address_line2].filter(Boolean).join(", "),
    [address.city, address.region, address.postal_code].filter(Boolean).join(", "),
    address.country,
    address.phone,
  ].filter(Boolean);
}

export function normalizeShippingAddressDraft(
  address: ShippingAddressDraft
): ShippingAddressDraft {
  return {
    ...address,
    label: address.label.trim() || "Adresă",
    recipient_name: address.recipient_name.trim(),
    phone: address.phone.trim(),
    address_line1: address.address_line1.trim(),
    address_line2: address.address_line2.trim(),
    city: address.city.trim(),
    region: address.region.trim(),
    postal_code: address.postal_code.trim(),
    country: address.country.trim() || "România",
  };
}

export function isShippingAddressComplete(address: ShippingAddressDraft) {
  const normalized = normalizeShippingAddressDraft(address);

  return Boolean(
    normalized.recipient_name &&
      normalized.address_line1 &&
      normalized.city &&
      normalized.country
  );
}
