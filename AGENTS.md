# AGENTS.md

## Mission
Turn this existing Stitch-generated clothing store frontend into a production-ready functional e-commerce website while preserving the current visual design as closely as possible.

## Product intent
This is a clothing shop. The design already exists. Your job is to make it functional:
- authentication
- product catalog backed by a real database
- product variants (size/color)
- cart
- checkout
- order creation
- basic admin tools
- deployable production setup

## Core principles
1. Preserve the current UI and styling unless a change is required for functionality, accessibility, responsiveness, or maintainability.
2. Prefer small, high-confidence edits over large rewrites.
3. Do not replace the existing design system unless absolutely necessary.
4. Keep the stack simple and low-friction.
5. Avoid adding unnecessary dependencies.
6. Leave clear comments only where secrets, dashboards, or external setup are required.
7. Never silently remove existing functionality without documenting it.

## Required stack
- Next.js
- TypeScript
- Supabase for auth, database, and storage
- Stripe Checkout for payments
- Netlify for deployment
- Resend for transactional email

## Do not do
- No custom payment form in v1
- No separate backend server unless absolutely required
- No microservices
- No CMS in v1
- No major visual redesign
- No overengineering for scale before core commerce flows work

## Priority order
1. Repo audit and architecture understanding
2. Make the current frontend run cleanly
3. Replace mock/static data with real data
4. Add auth
5. Add product/variant data model
6. Add cart
7. Add Stripe Checkout
8. Add webhook-driven order creation
9. Add admin CRUD
10. Add email and operational pages
11. Final deployment hardening

## Working style
- Start by reading the codebase and documenting the current architecture.
- Before major edits, identify the smallest viable implementation.
- After each milestone, update IMPLEMENTATION_STATUS.md.
- After each milestone, run relevant validation commands and fix failures immediately.
- Keep diffs scoped to the current milestone.
- If blocked, document the blocker and continue with unblocked tasks.

## Expected routes
- /
- /shop
- /shop/[slug]
- /cart
- /login
- /signup
- /account
- /account/orders
- /checkout/success
- /admin
- /admin/products
- /admin/orders

## Data requirements
Use a normalized commerce model with at least:
- profiles
- products
- product_variants
- product_images
- carts
- cart_items
- orders
- order_items

Prices and stock must live on variants, not only on products.

## Auth requirements
Implement:
- sign up
- login
- logout
- password reset
- protected account area
- protected admin area

## Checkout requirements
Use Stripe Checkout, not a custom card form.
Use webhook confirmation to create orders.
Successful payment must:
- create order records
- create order_items
- reduce stock
- persist customer/order data

## Admin requirements
Implement a minimal admin:
- list products
- create/edit product
- create/edit variants
- upload product images
- list orders
- view order details
- update fulfillment status if practical

## Definition of done
The task is complete only when:
- the existing look is preserved closely
- auth works end-to-end
- product data is database-backed
- size/color variants are purchasable
- cart works reliably
- checkout works with Stripe Checkout
- webhook creates orders correctly
- inventory updates after successful payment
- account order history works
- admin tools work at a basic operational level
- app deploys successfully
- README includes setup and env vars

## Validation
Whenever relevant, run:
- install
- typecheck
- lint
- build
- any tests present

Do not claim completion unless the app builds successfully or you explicitly document the remaining blocker.