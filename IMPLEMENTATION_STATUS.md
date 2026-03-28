# IMPLEMENTATION_STATUS.md

## Current status
- Current milestone: Stabilization and production hardening pass
- Status: in progress

## Completed
- Full repo audit (architecture, components, routes, mock data)
- docs/architecture-audit.md written
- Next.js 14 + TypeScript + Tailwind CSS v3 storefront/admin app created
- Supabase-backed catalog, auth, account, admin, checkout, webhook, and email flows implemented
- Local SVG icon system added to replace the fragile external icon font dependency
- Toast notifications added for auth, contact, account, checkout, and admin actions
- Supabase auth rewired to SSR-safe browser/server clients
- Auth callback flow fixed for login/signup/password recovery redirects
- Cart now stores real variant IDs and enforces stock-aware quantities
- Product detail now supports size/color selection against actual variants
- Checkout now resolves authoritative variant data on the server before creating Stripe sessions
- Webhook now records real variant/order metadata, attaches `user_id` when available, and reserves stock before order creation
- Added cash-on-delivery checkout flow alongside Stripe card checkout
- Added structured saved shipping addresses with default address selection and reuse at checkout
- Footer share action now copies the site URL to clipboard, and the unused globe action was removed
- Homepage archive price badge no longer presents as a fake interactive CTA
- Admin API routes now require server-side authorization
- Admin product editing now persists variants, archive state, and primary image metadata
- Added operational/legal routes: `/terms`, `/privacy`, `/shipping`
- Removed invalid Netlify redirect that could interfere with Next.js routing
- Typecheck no longer depends on stale incremental artifacts
- Production build and `npm start` verified locally
- Storefront image warnings removed by migrating the remaining product/editorial images to `next/image`

## Decisions made
- Keep the existing visual language and layout structure as the default
- Preserve raw editorial `<img>` usage for now to avoid layout regression; tracked as a follow-up optimization item
- Use `SUPABASE_SERVICE_ROLE_KEY` for privileged server-side admin/webhook work in production
- Support admin access through either `ADMIN_EMAILS` or `profiles.role = 'admin'`
- Local and production privileged flows both require `SUPABASE_SERVICE_ROLE_KEY`; without it, stock reservation, COD order creation, webhooks, and admin writes will fail under hardened RLS
- Local development should use Node.js 20 to match Netlify and avoid Supabase deprecation warnings shown under Node 18

## Blockers
- No code blocker
- Functional deployment still requires live Supabase / Stripe / Resend credentials
- Production security hardening requires running:
- `supabase/migrations/002_harden_auth_and_rls.sql`
- `supabase/migrations/003_shipping_addresses_and_payment_methods.sql`

## How to run
- `npm install`
- `npm run dev`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Validation results
- install: pass
- typecheck: pass
- lint: pass
- build: pass (27 routes)
- start: pass (`next start`, verified with HTTP 200 on `/`, `/shop`, `/login`)
- tests: none yet

## Routes
- `/` — Home page ✅
- `/shop` — Product catalog ✅
- `/shop/[slug]` — Product detail ✅
- `/cart` — Shopping cart ✅
- `/checkout/success` — Post-payment ✅
- `/login` — Login ✅
- `/signup` — Signup ✅
- `/forgot-password` — Request password reset ✅
- `/account/reset-password` — Set new password ✅
- `/account` — Account settings ✅
- `/account/orders` — Order history ✅
- `/terms` — Terms and conditions ✅
- `/privacy` — Privacy policy ✅
- `/shipping` — Shipping and returns ✅
- `/contact` — Contact page ✅
- `/about` — About page ✅
- `/admin` — Admin dashboard ✅
- `/admin/products` — Product CRUD ✅
- `/admin/orders` — Order management ✅
- API routes: checkout, webhooks, admin CRUD, contact ✅
