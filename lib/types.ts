export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  address: string | null;
  role?: "customer" | "admin";
  created_at: string;
  updated_at: string;
}

export interface ShippingAddress {
  id: string;
  user_id: string;
  label: string;
  recipient_name: string;
  phone: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  region: string | null;
  postal_code: string | null;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_group: string | null;
  category: string | null;
  material: string | null;
  season: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string | null;
  color: string | null;
  price_cents: number;
  compare_at_price_cents: number | null;
  stock: number;
  sku: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
}

export interface Cart {
  id: string;
  user_id: string | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  variant_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  shipping_address_id?: string | null;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  payment_method?: "card" | "cash_on_delivery";
  email: string;
  full_name: string | null;
  phone?: string | null;
  address: string | null;
  total_cents: number;
  status: string;
  fulfillment_status: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string;
  product_name: string;
  variant_info: string | null;
  price_cents: number;
  quantity: number;
  created_at: string;
}

// Composite types for display
export interface ProductWithDetails extends Product {
  variants: ProductVariant[];
  images: ProductImage[];
}

export interface CartItemWithVariant extends CartItem {
  variant: ProductVariant & {
    product: Product;
    images: ProductImage[];
  };
}
