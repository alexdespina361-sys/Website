update product_variants
set
  price_cents = round((price_cents * 1.6)::numeric)::integer,
  compare_at_price_cents = case
    when compare_at_price_cents is not null
      then round((compare_at_price_cents * 1.6)::numeric)::integer
    else null
  end,
  updated_at = now();
