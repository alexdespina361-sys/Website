# IMPLEMENTATION_STATUS.md

## Current status
- Current milestone: Red Atelier catalog polish, checkout simplification, and deployment cleanup
- Status: in progress

## Completed
- Full repo audit and architecture review
- Supabase-backed catalog, auth, account area, admin tools, checkout, and email infrastructure
- Structured product taxonomy with grouped categories
- Multi-image product galleries across admin and storefront
- Bulk import flow for `produse noi/products.json`
- PowerShell-safe npm scripts for local Next.js usage
- Brand rename from `Red Studio` to `Red Atelier` across visible storefront routes
- Shop sidebar no longer exposes the `Material` filter
- Checkout now supports cash on delivery only
- Hosted payment and platform-specific runtime/configuration files were removed
- Checkout now creates orders directly and clears the local cart on success
- Contact page updated with phone, WhatsApp, and `contact@redatelier.store`
- Homepage newsletter form now posts to a real `/api/newsletter` endpoint
- Contact API now validates Resend responses instead of assuming delivery
- Imported products renamed in Supabase to simple showroom-friendly names
- Imported products now have cleaned-up curated descriptions derived from their source titles
- Import script now reapplies the product name overrides on future imports
- Import script now reapplies curated product descriptions on future imports
- Homepage no longer links to the six archived seed products
- Legacy seed products, variants, images, and linked test order records were purged from Supabase
- Product list fetching now uses `noStore()` to avoid stale `/shop` catalog data
- Variant prices were increased by 60% across the current catalog
- Category price floors were applied for dresses, jumpsuits, bags, and accessory-style catalog groups before a further 20% catalog-wide increase
- Product cards no longer default to a black-and-white filter

## Decisions made
- Keep the current visual layout while updating copy, product naming, and interactions
- Preserve old imported slugs for stability, but rename the visible product titles
- Remove the six original seed products and their linked test data because they were only filler records
- Use `contact@redatelier.store` as the target inbox and sender identity for Resend
- Treat a Resend API `error` as a failed submission instead of silently reporting success
- Treat `BIJUTERII & CEASURI` as accessory-style pricing for the current catalog because there are no active products in the standalone `ACCESORII` group yet
- Use `SUPABASE_SERVICE_ROLE_KEY` for privileged admin and order-creation work in production

## Blockers
- No code blocker
- Real email delivery still depends on the `redatelier.store` domain being verified inside Resend

## Required migrations
- `supabase/migrations/002_harden_auth_and_rls.sql`
- `supabase/migrations/003_shipping_addresses_and_payment_methods.sql`
- `supabase/migrations/004_structured_product_taxonomy.sql`
- `supabase/migrations/005_remove_legacy_seed_products.sql`
- `supabase/migrations/006_rename_imported_products.sql`
- `supabase/migrations/007_refresh_imported_product_descriptions.sql`
- `supabase/migrations/008_purge_legacy_seed_records.sql`
- `supabase/migrations/009_increase_variant_prices_by_sixty_percent.sql`
- `supabase/migrations/010_apply_category_minimums_then_raise_twenty_percent.sql`

## How to run
- `npm install`
- `npm run dev`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run import:products -- --dry-run`

## Validation results
- install: pass
- typecheck: pass
- lint: pass
- build: pass
- start: pass (`next start`, verified with HTTP 200 on `/`, `/shop`, `/login`)
- tests: none yet

## Routes
- `/` - Home page
- `/shop` - Product catalog
- `/shop/[slug]` - Product detail
- `/cart` - Shopping cart
- `/checkout/success` - Order confirmation
- `/login` - Login
- `/signup` - Signup
- `/forgot-password` - Request password reset
- `/account/reset-password` - Set new password
- `/account` - Account settings
- `/account/orders` - Order history
- `/terms` - Terms and conditions
- `/privacy` - Privacy policy
- `/shipping` - Shipping and returns
- `/contact` - Contact page
- `/about` - About page
- `/admin` - Admin dashboard
- `/admin/products` - Product CRUD
- `/admin/orders` - Order management
- `/api/newsletter` - Newsletter submissions
- `/api/contact` - Contact form submissions
- `/api/checkout` - Order placement
