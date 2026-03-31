with adjusted as (
  select
    pv.id,
    round((
      case
        when p.category = 'Rochii' then greatest(pv.price_cents, 15000)
        when p.category = 'Salopete' then greatest(pv.price_cents, 12000)
        when p.category_group = 'GENȚI & POȘETE' then greatest(pv.price_cents, 10000)
        when p.category_group in ('ACCESORII', 'BIJUTERII & CEASURI') then greatest(pv.price_cents, 8000)
        else pv.price_cents
      end * 1.2
    )::numeric)::integer as next_price_cents,
    case
      when pv.compare_at_price_cents is null then null
      else round((
        case
          when p.category = 'Rochii' then greatest(pv.compare_at_price_cents, 15000)
          when p.category = 'Salopete' then greatest(pv.compare_at_price_cents, 12000)
          when p.category_group = 'GENȚI & POȘETE' then greatest(pv.compare_at_price_cents, 10000)
          when p.category_group in ('ACCESORII', 'BIJUTERII & CEASURI') then greatest(pv.compare_at_price_cents, 8000)
          else pv.compare_at_price_cents
        end * 1.2
      )::numeric)::integer
    end as next_compare_at_price_cents
  from product_variants pv
  join products p on p.id = pv.product_id
)
update product_variants pv
set
  price_cents = adjusted.next_price_cents,
  compare_at_price_cents = case
    when adjusted.next_compare_at_price_cents is not null
      and adjusted.next_compare_at_price_cents > adjusted.next_price_cents
      then adjusted.next_compare_at_price_cents
    else null
  end,
  updated_at = now()
from adjusted
where pv.id = adjusted.id;
