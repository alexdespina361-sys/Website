import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendOrderConfirmation } from "@/lib/email";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import {
  createOrderWithItems,
  type ResolvedCheckoutItem,
} from "@/lib/order-processing";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function parseCartItems(metadataValue: string | undefined) {
  const parsed = JSON.parse(metadataValue || "[]") as Array<{
    variant_id: string;
    product_id: string;
    name: string;
    slug: string;
    size: string | null;
    color: string | null;
    quantity: number;
    price_cents: number;
  }>;

  return parsed.map(
    (item) =>
      ({
        variantId: item.variant_id,
        productId: item.product_id,
        name: item.name,
        slug: item.slug,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        priceCents: item.price_cents,
        stock: item.quantity,
      }) satisfies ResolvedCheckoutItem
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const adminSupabase = createSupabaseAdminClient();

  const { data: existingOrder } = await adminSupabase
    .from("orders")
    .select("id")
    .eq("stripe_session_id", session.id)
    .single();

  if (existingOrder) {
    return NextResponse.json({ received: true });
  }

  try {
    const cartItems = parseCartItems(session.metadata?.cart_items);

    const order = await createOrderWithItems(
      adminSupabase,
      {
        userId: session.metadata?.user_id || session.client_reference_id || null,
        shippingAddressId: session.metadata?.shipping_address_id || null,
        paymentMethod: "card",
        status: "paid",
        email:
          session.metadata?.contact_email ||
          session.customer_details?.email ||
          session.customer_email ||
          "",
        fullName:
          session.metadata?.delivery_name || session.customer_details?.name || null,
        phone:
          session.metadata?.delivery_phone ||
          session.customer_details?.phone ||
          null,
        address:
          session.metadata?.delivery_address ||
          [
            session.customer_details?.address?.line1,
            session.customer_details?.address?.line2,
            session.customer_details?.address?.city,
            session.customer_details?.address?.postal_code,
            session.customer_details?.address?.country,
          ]
            .filter(Boolean)
            .join(", ") ||
          null,
        totalCents: session.amount_total || 0,
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string,
      },
      cartItems
    );

    await sendOrderConfirmation({
      orderId: order.id,
      email: order.email,
      fullName: order.full_name,
      totalCents: order.total_cents,
      items: cartItems.map((item) => ({
        name: item.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        priceCents: item.priceCents,
      })),
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing checkout webhook:", error);
    return NextResponse.json(
      { error: "Failed to process checkout session" },
      { status: 500 }
    );
  }
}
