with legacy_product_ids as (
  select unnest(array[
    'a1000000-0000-0000-0000-000000000001'::uuid,
    'a1000000-0000-0000-0000-000000000002'::uuid,
    'a1000000-0000-0000-0000-000000000003'::uuid,
    'a1000000-0000-0000-0000-000000000004'::uuid,
    'a1000000-0000-0000-0000-000000000005'::uuid,
    'a1000000-0000-0000-0000-000000000006'::uuid
  ]) as id
),
legacy_variant_ids as (
  select id
  from product_variants
  where product_id in (select id from legacy_product_ids)
),
deleted_order_items as (
  delete from order_items
  where variant_id in (select id from legacy_variant_ids)
  returning order_id
)
delete from orders
where id in (select distinct order_id from deleted_order_items)
  and not exists (
    select 1
    from order_items
    where order_items.order_id = orders.id
  );

delete from cart_items
where variant_id in (
  select id
  from product_variants
  where product_id in (
    'a1000000-0000-0000-0000-000000000001'::uuid,
    'a1000000-0000-0000-0000-000000000002'::uuid,
    'a1000000-0000-0000-0000-000000000003'::uuid,
    'a1000000-0000-0000-0000-000000000004'::uuid,
    'a1000000-0000-0000-0000-000000000005'::uuid,
    'a1000000-0000-0000-0000-000000000006'::uuid
  )
);

delete from product_images
where product_id in (
  'a1000000-0000-0000-0000-000000000001'::uuid,
  'a1000000-0000-0000-0000-000000000002'::uuid,
  'a1000000-0000-0000-0000-000000000003'::uuid,
  'a1000000-0000-0000-0000-000000000004'::uuid,
  'a1000000-0000-0000-0000-000000000005'::uuid,
  'a1000000-0000-0000-0000-000000000006'::uuid
);

delete from product_variants
where product_id in (
  'a1000000-0000-0000-0000-000000000001'::uuid,
  'a1000000-0000-0000-0000-000000000002'::uuid,
  'a1000000-0000-0000-0000-000000000003'::uuid,
  'a1000000-0000-0000-0000-000000000004'::uuid,
  'a1000000-0000-0000-0000-000000000005'::uuid,
  'a1000000-0000-0000-0000-000000000006'::uuid
);

delete from products
where id in (
  'a1000000-0000-0000-0000-000000000001'::uuid,
  'a1000000-0000-0000-0000-000000000002'::uuid,
  'a1000000-0000-0000-0000-000000000003'::uuid,
  'a1000000-0000-0000-0000-000000000004'::uuid,
  'a1000000-0000-0000-0000-000000000005'::uuid,
  'a1000000-0000-0000-0000-000000000006'::uuid
);
