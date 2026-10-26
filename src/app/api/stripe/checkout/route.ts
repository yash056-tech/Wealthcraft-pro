import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/stripe-server";

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin") || "http://localhost:3000";

    if (!stripe) {
      // If Stripe secret key is not set, simulate successful checkout redirect with query param
      return NextResponse.json({
        url: `${origin}/dashboard?checkout_success=true&mode=simulated`,
        simulated: true,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "WealthCraft Pro Tier Subscription",
              description: "Full access to advanced financial simulators, unlimited scenario saving, and executive PDF reports.",
            },
            unit_amount: 99900, // Rs 999.00 in paise
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/dashboard?checkout_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initiate Stripe checkout" },
      { status: 500 }
    );
  }
}
