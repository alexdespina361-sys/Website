# IMPLEMENTATION_PLAN.md

## Goal
Convert the existing Stitch-generated clothing store frontend into a functional production-ready e-commerce site with minimal visual change.

## Technical decisions
- Frontend framework: Next.js + TypeScript
- Backend/BaaS: Supabase
- Payments: Stripe Checkout
- Email: Resend
- Deployment: Netlify

## Milestone 1 — Audit and stabilization
### Objectives
- Identify current framework and structure
- Identify reusable components
- Identify hardcoded data and demo placeholders
- Identify broken flows and missing routes
- Ensure the app runs locally

### Deliverables
- docs/architecture-audit.md
- list of current routes/components
- list of gaps between design and production requirements

### Exit criteria
- app runs locally
- architecture documented
- migration risk areas identified

---

## Milestone 2 — Frontend normalization
### Objectives
- Move/organize pages into clean Next.js route structure
- Extract shared layout/components only where useful
- Preserve design fidelity

### Deliverables
- stable route structure
- reusable UI primitives for current design
- no mock pages pretending to be functional

### Exit criteria
- all major storefront routes render correctly
- visuals remain close to existing design

---

## Milestone 3 — Data model and Supabase integration
### Objectives
- Add Supabase project wiring
- Add schema and migrations
- Replace static product JSON with database-backed loading

### Minimum schema
- profiles
- products
- product_variants
- product_images
- carts
- cart_items
- orders
- order_items

### Exit criteria
- products load from database
- variants are modeled correctly
- storage path for images is working or stubbed cleanly

---

## Milestone 4 — Authentication
### Objectives
- sign up
- login
- logout
- reset password
- account protection
- admin protection

### Exit criteria
- auth flows work end-to-end
- unauthorized users cannot access protected pages

---

## Milestone 5 — Product detail and cart
### Objectives
- product detail page from DB
- size/color selection
- stock-aware add to cart
- cart persistence

### Exit criteria
- user can add/remove/update cart items
- cart reflects selected variant
- cart survives refresh/session as designed

---

## Milestone 6 — Checkout and orders
### Objectives
- create Stripe Checkout session
- handle success/cancel paths
- build Stripe webhook endpoint
- create orders and order_items on success
- decrement stock safely

### Exit criteria
- successful payment creates a valid order
- duplicate webhook handling is safe
- order data is visible in account/admin

---

## Milestone 7 — Admin
### Objectives
- product CRUD
- variant CRUD
- image upload
- orders list/detail

### Exit criteria
- admin can operate catalog and see orders without touching the DB manually

---

## Milestone 8 — Email and ops pages
### Objectives
- order confirmation email
- shipping/returns/privacy pages
- contact form if practical

### Exit criteria
- basic operational pages exist
- customer receives confirmation email after purchase if credentials are configured

---

## Milestone 9 — Deployment hardening
### Objectives
- configure environment variables
- Netlify deployment
- production-safe webhook config
- README update

### Exit criteria
- production build passes
- deployment steps are documented
- all required env vars are listed

---

## Non-goals for v1
- reviews
- wishlist
- loyalty
- advanced search
- marketplace support
- multi-currency
- multi-warehouse

## Architecture preferences
- prefer server-side routes/actions where reasonable
- keep business logic close to the app
- avoid unnecessary abstraction layers
- keep admin simple

## Final acceptance checklist
- [ ] UI preserved closely
- [ ] auth complete
- [ ] DB-backed products
- [ ] variant purchasing works
- [ ] cart works
- [ ] Stripe Checkout works
- [ ] webhook order creation works
- [ ] stock updates work
- [ ] account order history works
- [ ] admin works
- [ ] deployable on Netlify
- [ ] README updated