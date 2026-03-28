-- Add structured shipping addresses and payment method metadata.

CREATE TABLE IF NOT EXISTS shipping_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'Adresă',
  recipient_name TEXT NOT NULL,
  phone TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  region TEXT,
  postal_code TEXT,
  country TEXT NOT NULL DEFAULT 'România',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_shipping_addresses_user_id
  ON shipping_addresses(user_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_shipping_addresses_default_per_user
  ON shipping_addresses(user_id)
  WHERE is_default = true;

ALTER TABLE shipping_addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own shipping addresses" ON shipping_addresses;
DROP POLICY IF EXISTS "Users can insert own shipping addresses" ON shipping_addresses;
DROP POLICY IF EXISTS "Users can update own shipping addresses" ON shipping_addresses;
DROP POLICY IF EXISTS "Users can delete own shipping addresses" ON shipping_addresses;

CREATE POLICY "Users can view own shipping addresses"
  ON shipping_addresses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own shipping addresses"
  ON shipping_addresses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shipping addresses"
  ON shipping_addresses
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own shipping addresses"
  ON shipping_addresses
  FOR DELETE
  USING (auth.uid() = user_id);

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS shipping_address_id UUID REFERENCES shipping_addresses(id) ON DELETE SET NULL;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'card';

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS phone TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'orders_payment_method_check'
  ) THEN
    ALTER TABLE orders
      ADD CONSTRAINT orders_payment_method_check
      CHECK (payment_method IN ('card', 'cash_on_delivery'));
  END IF;
END $$;
