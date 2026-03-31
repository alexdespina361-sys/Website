# Red Atelier - E-Commerce Website

Red Atelier is a fashion e-commerce site built with Next.js, TypeScript, Supabase, and Resend.

## Tech Stack

- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS v3
- Database and Auth: Supabase
- Payments: Cash on delivery only
- Email: Resend
- Deployment: Netlify

## Prerequisites

- Node.js 20+
- npm
- Supabase account
- Resend account with a verified `redatelier.store` domain

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
ADMIN_EMAILS=admin@example.com

# Resend
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=Red Atelier <contact@redatelier.store>
CONTACT_EMAIL_TO=contact@redatelier.store

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL migrations in `supabase/migrations/` in order:
     - `001_initial_schema.sql`
     - `002_harden_auth_and_rls.sql`
     - `003_shipping_addresses_and_payment_methods.sql`
     - `004_structured_product_taxonomy.sql`
     - `005_remove_legacy_seed_products.sql`
     - `006_rename_imported_products.sql`
     - `007_refresh_imported_product_descriptions.sql`
     - `008_purge_legacy_seed_records.sql`
     - `009_increase_variant_prices_by_sixty_percent.sql`
     - `010_apply_category_minimums_then_raise_twenty_percent.sql`
   - Add your project URL, anon key, and service role key to `.env.local`
   - Grant admin access through either `ADMIN_EMAILS` or `profiles.role = 'admin'`

3. Verify your `redatelier.store` sending domain inside Resend and set:
   - `RESEND_FROM_EMAIL=Red Atelier <contact@redatelier.store>`
   - `CONTACT_EMAIL_TO=contact@redatelier.store`

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - build for production
- `npm start` - start the production server
- `npm run lint` - run ESLint
- `npm run typecheck` - run TypeScript checks
- `npm run import:products -- --dry-run` - preview the product import
- `npm run import:products -- --commit --publish --default-stock 5` - import and publish products

## Product Import

The importer reads [`produse noi/products.json`](/Users/Alex/Desktop/Website/produse%20noi/products.json) and:

- maps products into the grouped taxonomy
- preserves multi-image galleries
- applies friendly Red Atelier product names from [`lib/product-name-overrides.json`](/Users/Alex/Desktop/Website/lib/product-name-overrides.json)
- updates existing imported products by slug

## Email Flows

- Homepage newsletter form posts to `/api/newsletter`
- Contact form posts to `/api/contact`
- Order confirmations use `lib/email.ts`

Important:

- If Resend is still using `onboarding@resend.dev`, delivery to `contact@redatelier.store` will fail
- You must verify the `redatelier.store` domain in Resend before production testing

## Notes

- The six original seed products and their linked test orders were removed from Supabase
- Checkout is cash on delivery only; Stripe card checkout is disabled in the app
- Pricing currently reflects the imported catalog uplift, category minimums, and a final 20% increase
