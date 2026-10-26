import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/stripe-server";

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin") || "http://localhost:3000";

    if (!stripe) {
      return NextResponse.json({
        url: `${origin}/dashboard?portal_simulated=true`,
        simulated: true,
      });
    }

    // In production, customer ID would come from Supabase user record
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: "cus_mock_or_from_db",
      return_url: `${origin}/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({
      url: `${req.headers.get("origin") || "http://localhost:3000"}/dashboard`,
      simulated: true,
      message: error.message,
    });
  }
}
