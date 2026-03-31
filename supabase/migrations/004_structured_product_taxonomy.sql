-- Structured product taxonomy support
-- Run after 003_shipping_addresses_and_payment_methods.sql

ALTER TABLE products
ADD COLUMN IF NOT EXISTS category_group TEXT;

CREATE INDEX IF NOT EXISTS idx_products_category_group
  ON products(category_group);

UPDATE products
SET category_group = 'ÎMBRĂCĂMINTE'
WHERE category_group IS NULL
  AND (
    lower(coalesce(category, '')) LIKE '%roch%'
    OR lower(coalesce(category, '')) LIKE '%tricot%'
    OR lower(coalesce(category, '')) LIKE '%pantalon%'
    OR lower(coalesce(category, '')) LIKE '%cămaș%'
    OR lower(coalesce(category, '')) LIKE '%camas%'
    OR lower(coalesce(category, '')) LIKE '%palton%'
    OR lower(coalesce(category, '')) LIKE '%jachet%'
  );

UPDATE products
SET category_group = 'ÎNCĂLȚĂMINTE'
WHERE category_group IS NULL
  AND (
    lower(coalesce(category, '')) LIKE '%sandal%'
    OR lower(coalesce(category, '')) LIKE '%pantof%'
    OR lower(coalesce(category, '')) LIKE '%botin%'
    OR lower(coalesce(category, '')) LIKE '%mules%'
  );

UPDATE products
SET category_group = 'LENJERIE & HOMEWEAR'
WHERE category_group IS NULL
  AND (
    lower(coalesce(category, '')) LIKE '%slip%'
    OR lower(coalesce(category, '')) LIKE '%lenjer%'
    OR lower(coalesce(category, '')) LIKE '%sutien%'
    OR lower(coalesce(category, '')) LIKE '%pijama%'
    OR lower(coalesce(category, '')) LIKE '%halat%'
  );

UPDATE products
SET category_group = 'GENȚI & POȘETE'
WHERE category_group IS NULL
  AND (
    lower(coalesce(category, '')) LIKE '%poșet%'
    OR lower(coalesce(category, '')) LIKE '%poset%'
    OR lower(coalesce(category, '')) LIKE '%geant%'
    OR lower(coalesce(category, '')) LIKE '%plic%'
    OR lower(coalesce(category, '')) LIKE '%bag%'
  );

UPDATE products
SET category_group = 'BIJUTERII & CEASURI'
WHERE category_group IS NULL
  AND (
    lower(coalesce(category, '')) LIKE '%bijuter%'
    OR lower(coalesce(category, '')) LIKE '%ceas%'
    OR lower(coalesce(category, '')) LIKE '%colier%'
    OR lower(coalesce(category, '')) LIKE '%cercei%'
    OR lower(coalesce(category, '')) LIKE '%brăț%'
    OR lower(coalesce(category, '')) LIKE '%brat%'
    OR lower(coalesce(category, '')) LIKE '%inel%'
  );

UPDATE products
SET category_group = 'ACCESORII'
WHERE category_group IS NULL
  AND (
    lower(coalesce(category, '')) LIKE '%accesor%'
    OR lower(coalesce(category, '')) LIKE '%eșarf%'
    OR lower(coalesce(category, '')) LIKE '%esarf%'
    OR lower(coalesce(category, '')) LIKE '%șal%'
    OR lower(coalesce(category, '')) LIKE '%sal%'
  );
