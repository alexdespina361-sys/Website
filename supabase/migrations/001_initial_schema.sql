-- ============================================================
-- RED STUDIO — Complete Database Setup
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================================

-- 1. Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 2. TABLES
-- ============================================================

-- Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT,
  material TEXT,
  season TEXT,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Product variants (size/color/price/stock)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT,
  color TEXT,
  price_cents INTEGER NOT NULL,
  compare_at_price_cents INTEGER,
  stock INTEGER NOT NULL DEFAULT 0,
  sku TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Product images
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Carts
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Cart items
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  address TEXT,
  total_cents INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  fulfillment_status TEXT DEFAULT 'unfulfilled',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES product_variants(id),
  product_name TEXT NOT NULL,
  variant_info TEXT,
  price_cents INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 3. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_variant_id ON cart_items(variant_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- ============================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public can view products" ON products;
DROP POLICY IF EXISTS "Anyone can insert products" ON products;
DROP POLICY IF EXISTS "Anyone can update products" ON products;
DROP POLICY IF EXISTS "Anyone can delete products" ON products;
DROP POLICY IF EXISTS "Public can view variants" ON product_variants;
DROP POLICY IF EXISTS "Anyone can insert variants" ON product_variants;
DROP POLICY IF EXISTS "Anyone can update variants" ON product_variants;
DROP POLICY IF EXISTS "Anyone can delete variants" ON product_variants;
DROP POLICY IF EXISTS "Public can view images" ON product_images;
DROP POLICY IF EXISTS "Anyone can insert images" ON product_images;
DROP POLICY IF EXISTS "Anyone can update images" ON product_images;
DROP POLICY IF EXISTS "Anyone can delete images" ON product_images;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own carts" ON carts;
DROP POLICY IF EXISTS "Users can insert own carts" ON carts;
DROP POLICY IF EXISTS "Users can update own carts" ON carts;
DROP POLICY IF EXISTS "Users can delete own carts" ON carts;
DROP POLICY IF EXISTS "Users can manage own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
DROP POLICY IF EXISTS "Anyone can update orders" ON orders;
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Anyone can insert order items" ON order_items;

-- Products: public read, full access for authenticated (admin API uses anon key server-side)
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Anyone can insert products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete products" ON products FOR DELETE USING (true);

-- Product variants: same
CREATE POLICY "Public can view variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Anyone can insert variants" ON product_variants FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update variants" ON product_variants FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete variants" ON product_variants FOR DELETE USING (true);

-- Product images: same
CREATE POLICY "Public can view images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Anyone can insert images" ON product_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update images" ON product_images FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete images" ON product_images FOR DELETE USING (true);

-- Profiles: users manage own
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Carts: users manage own
CREATE POLICY "Users can view own carts" ON carts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own carts" ON carts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own carts" ON carts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own carts" ON carts FOR DELETE USING (auth.uid() = user_id);

-- Cart items: users manage items in own carts
CREATE POLICY "Users can manage own cart items" ON cart_items FOR ALL USING (
  cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid())
);

-- Orders: users view own, webhook inserts
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update orders" ON orders FOR UPDATE USING (true);

-- Order items: users view own, webhook inserts
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
);
CREATE POLICY "Anyone can insert order items" ON order_items FOR INSERT WITH CHECK (true);

-- ============================================================
-- 5. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 6. SEED DATA — Products
-- ============================================================

-- Clear existing seed data (safe to re-run)
DELETE FROM product_images WHERE product_id IN (
  'a1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000003',
  'a1000000-0000-0000-0000-000000000004',
  'a1000000-0000-0000-0000-000000000005',
  'a1000000-0000-0000-0000-000000000006'
);
DELETE FROM product_variants WHERE product_id IN (
  'a1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000003',
  'a1000000-0000-0000-0000-000000000004',
  'a1000000-0000-0000-0000-000000000005',
  'a1000000-0000-0000-0000-000000000006'
);
DELETE FROM products WHERE id IN (
  'a1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000003',
  'a1000000-0000-0000-0000-000000000004',
  'a1000000-0000-0000-0000-000000000005',
  'a1000000-0000-0000-0000-000000000006'
);

-- Insert products
INSERT INTO products (id, name, slug, description, category, material, season) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Paltonul Overcoat', 'paltonul-overcoat', 'Un palton structurat din lână merinos, perfect pentru sezonul rece. Croiala minimalistă și detaliile rafinate îl transformă într-o piesă atemporală.', 'Paltoane & Jachete', 'Lână Merinos, Gri Cărbune', 'Toamnă / Iarnă'),
  ('a1000000-0000-0000-0000-000000000002', 'Pulover Cașmir №2', 'pulover-casmir-no2', 'Un pulover luxos din fibre naturale de cașmir, oferind o senzație deosebită la atingere și o căldură excepțională.', 'Tricotaje', 'Fibre Naturale, Bej Nisip', 'Toamnă / Iarnă'),
  ('a1000000-0000-0000-0000-000000000003', 'Pantalonul Studio', 'pantalonul-studio', 'Pantaloni croiți din gabardină de bumbac, cu o formă impecabilă și un confort deosebit.', 'Pantaloni', 'Gabardină de Bumbac', 'Permanent'),
  ('a1000000-0000-0000-0000-000000000004', 'Cămașa Fluida', 'camasa-fluida', 'O cămașă elegantă din mătase naturală, cu o cădere fluidă și un design minimalist.', 'Cămăși', 'Mătase Naturală, Alb Fildeș', 'Primăvară / Vară'),
  ('a1000000-0000-0000-0000-000000000005', 'Cardigan Heritage', 'cardigan-heritage', 'Un cardigan tricotat manual din amestec de lână și alpaca, o piesă statement pentru garderoba ta.', 'Tricotaje', 'Amestec Lână și Alpaca', 'Toamnă / Iarnă'),
  ('a1000000-0000-0000-0000-000000000006', 'Eșarfa Horizon', 'esarfa-horizon', 'O eșarfă cu imprimeu manual pe mătase, un accesoriu care completează orice ținută.', 'Accesorii', 'Imprimeu Manual pe Mătase', 'Permanent');

-- Insert variants (prices in bani — 100 bani = 1 RON)
INSERT INTO product_variants (product_id, size, color, price_cents, compare_at_price_cents, stock) VALUES
  -- Paltonul Overcoat: 4.250 RON = 425000 bani
  ('a1000000-0000-0000-0000-000000000001', 'S', 'Gri Cărbune', 425000, NULL, 5),
  ('a1000000-0000-0000-0000-000000000001', 'M', 'Gri Cărbune', 425000, NULL, 8),
  ('a1000000-0000-0000-0000-000000000001', 'L', 'Gri Cărbune', 425000, NULL, 3),
  -- Pulover Cașmir №2: 2.890 RON
  ('a1000000-0000-0000-0000-000000000002', 'S', 'Bej Nisip', 289000, NULL, 6),
  ('a1000000-0000-0000-0000-000000000002', 'M', 'Bej Nisip', 289000, NULL, 10),
  ('a1000000-0000-0000-0000-000000000002', 'L', 'Bej Nisip', 289000, NULL, 4),
  -- Pantalonul Studio: 1.250 RON (sale from 1.850 RON)
  ('a1000000-0000-0000-0000-000000000003', '38', 'Negru', 125000, 185000, 12),
  ('a1000000-0000-0000-0000-000000000003', '40', 'Negru', 125000, 185000, 8),
  ('a1000000-0000-0000-0000-000000000003', '42', 'Negru', 125000, 185000, 5),
  -- Cămașa Fluida: 1.550 RON
  ('a1000000-0000-0000-0000-000000000004', 'S', 'Alb Fildeș', 155000, NULL, 7),
  ('a1000000-0000-0000-0000-000000000004', 'M', 'Alb Fildeș', 155000, NULL, 9),
  ('a1000000-0000-0000-0000-000000000004', 'L', 'Alb Fildeș', 155000, NULL, 4),
  -- Cardigan Heritage: 3.120 RON
  ('a1000000-0000-0000-0000-000000000005', 'S', 'Maro', 312000, NULL, 3),
  ('a1000000-0000-0000-0000-000000000005', 'M', 'Maro', 312000, NULL, 6),
  ('a1000000-0000-0000-0000-000000000005', 'L', 'Maro', 312000, NULL, 2),
  -- Eșarfa Horizon: 890 RON (one size)
  ('a1000000-0000-0000-0000-000000000006', 'Uni', 'Multicolor', 89000, NULL, 15);

-- Insert images (local paths — images are in public/images/products/)
INSERT INTO product_images (product_id, url, alt_text, sort_order) VALUES
  ('a1000000-0000-0000-0000-000000000001', '/images/products/paltonul-overcoat.webp', 'Palton din lână structurat', 0),
  ('a1000000-0000-0000-0000-000000000002', '/images/products/pulover-casmir-no2.webp', 'Pulover de cașmir', 0),
  ('a1000000-0000-0000-0000-000000000003', '/images/products/pantalonul-studio.webp', 'Pantaloni croiți', 0),
  ('a1000000-0000-0000-0000-000000000004', '/images/products/camasa-fluida.webp', 'Cămașă de mătase', 0),
  ('a1000000-0000-0000-0000-000000000005', '/images/products/cardigan-heritage.webp', 'Cardigan tricotat manual', 0),
  ('a1000000-0000-0000-0000-000000000006', '/images/products/esarfa-horizon.webp', 'Eșarfă de mătase artizanală', 0);

-- ============================================================
-- DONE. Your database is ready.
-- ============================================================
