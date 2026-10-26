import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/stripe-server";

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ received: true, note: "Stripe not configured" });
  }

  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing webhook signature or secret" }, { status: 400 });
  }

  try {
    const rawBody = await req.text();
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed":
        // Handle checkout completion: activate Pro in Supabase
        break;
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        // Handle subscription lifecycle
        break;
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
