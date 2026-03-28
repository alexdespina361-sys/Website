# RED STUDIO — E-Commerce Website

A high-end fashion e-commerce website built with Next.js, TypeScript, Supabase, and Stripe Checkout.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3
- **Database & Auth:** Supabase
- **Payments:** Stripe Checkout
- **Email:** Resend (for transactional emails)
- **Deployment:** Netlify

## Prerequisites

- Node.js 18+ (recommended: 20+)
- npm
- Supabase account
- Stripe account

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
ADMIN_EMAILS=admin@example.com

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Resend
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=RED STUDIO <onboarding@resend.dev>
CONTACT_EMAIL_TO=hello@redstudio.ro

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a new Supabase project
   - Run the SQL migrations in `supabase/migrations/` in order:
     - `001_initial_schema.sql`
     - `002_harden_auth_and_rls.sql`
     - `003_shipping_addresses_and_payment_methods.sql`
   - Copy your project URL, anon key, and service role key to `.env.local`
   - Grant admin access through either `ADMIN_EMAILS` or `profiles.role = 'admin'`

3. **Set up Stripe:**
   - Create a Stripe account
   - Get your API keys from the Stripe Dashboard
   - Set up a webhook endpoint pointing to `/api/webhooks/stripe`
   - Copy the webhook signing secret to `.env.local`

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm start` — Start production server
- `npm run lint` — Run ESLint
- `npm run typecheck` — Run TypeScript type checking

## Project Structure

```
app/
  page.tsx              # Home page
  shop/
    page.tsx            # Shop/collections page
    [slug]/page.tsx     # Product detail page
  cart/page.tsx         # Cart page
  checkout/
    success/page.tsx    # Post-payment success page
  login/page.tsx        # Login page
  signup/page.tsx       # Signup page
  account/
    page.tsx            # Account settings
    orders/page.tsx     # Order history
  privacy/page.tsx      # Privacy policy
  shipping/page.tsx     # Shipping and returns
  terms/page.tsx        # Terms and conditions
  contact/page.tsx      # Contact page
  about/page.tsx        # About page
  admin/
    page.tsx            # Admin dashboard
    products/page.tsx   # Product management
    orders/page.tsx     # Order management
  api/
    checkout/route.ts   # Stripe checkout API
    webhooks/stripe/route.ts  # Stripe webhook handler
components/
  Header.tsx            # Shared header
  Footer.tsx            # Shared footer
  Providers.tsx         # Context providers
  CheckoutButton.tsx    # Checkout panel (card + COD + address selection)
  AddressBook.tsx       # Saved shipping address management
lib/
  supabase.ts           # Supabase client
  auth.ts               # Auth utilities
  shipping-addresses.ts # Address helpers
  products.ts           # Product data access
  format.ts             # Price formatting
  types.ts              # TypeScript types
  CartContext.tsx        # Cart state management
supabase/
  migrations/
    001_initial_schema.sql  # Database schema
```

## Routes

| Route | Description |
|---|---|
| `/` | Home page |
| `/shop` | Product catalog |
| `/shop/[slug]` | Product detail |
| `/cart` | Shopping cart |
| `/checkout/success` | Post-payment confirmation |
| `/login` | User login |
| `/signup` | User registration |
| `/account` | Account settings (protected) |
| `/account/orders` | Order history (protected) |
| `/terms` | Terms and conditions |
| `/privacy` | Privacy policy |
| `/shipping` | Shipping and returns |
| `/contact` | Contact form |
| `/about` | About page |
| `/admin` | Admin dashboard |
| `/admin/products` | Product management |
| `/admin/orders` | Order management |

## Database Schema

The database includes the following tables:
- `profiles` — User profiles (extends Supabase auth)
- `products` — Product catalog
- `product_variants` — Size/color variants with pricing and stock
- `product_images` — Product images
- `shipping_addresses` — Structured saved delivery addresses
- `carts` — Shopping carts
- `cart_items` — Items in carts
- `orders` — Completed orders
- `order_items` — Items in orders

## Design System

The design follows a minimal editorial aesthetic:
- **Colors:** Monochrome base with terracotta accent (#974730)
- **Typography:** Noto Serif (headlines) + Inter (body/labels)
- **Layout:** Asymmetric, generous spacing, 0px border radius
- **Motion:** Scroll reveal, marquee, parallax effects

## Deployment

The app is configured for Netlify deployment. See `netlify.toml` for configuration.

## Notes

- Admin APIs and Stripe webhooks should use `SUPABASE_SERVICE_ROLE_KEY` in production.
- Builds are intended to run on Node.js 20+.
- Checkout supports both Stripe card payments and cash on delivery.
- Logged-in customers can save multiple delivery addresses and reuse the default one automatically during checkout.
- `npm run build` currently passes with editorial `<img>` warnings; those layouts were kept to preserve the original Stitch composition.
# Website
