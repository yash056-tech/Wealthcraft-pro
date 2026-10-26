import { NextRequest, NextResponse } from "next/server";
import {
  sendRegistrationNotificationEmail,
  RegistrationPayload,
  NOTIFICATION_RECIPIENT_EMAIL,
} from "@/lib/email/mailer";
import { createClient } from "@/lib/supabase/client";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RegistrationPayload;

    if (!body.fullName || !body.fullName.trim()) {
      return NextResponse.json(
        { error: "Full Name is required." },
        { status: 400 }
      );
    }

    if (!body.email || !body.email.includes("@")) {
      return NextResponse.json(
        { error: "A valid Email Address is required." },
        { status: 400 }
      );
    }

    // Capture source origin
    const origin = req.headers.get("origin") || req.headers.get("referer") || "https://wealthcraft-pro.vercel.app";
    body.sourceUrl = origin;

    // Send email to ya09shu@gmail.com
    const mailResult = await sendRegistrationNotificationEmail(body);

    // Optionally record to Supabase if configured
    try {
      const supabase = createClient();
      if (supabase) {
        await supabase.from("user_registrations").insert([
          {
            full_name: body.fullName,
            email: body.email,
            phone: body.phone,
            user_type: body.userType,
            primary_service: body.primaryService,
            portfolio_range: body.portfolioRange,
            message: body.message,
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      // Non-blocking
    }

    return NextResponse.json({
      success: true,
      message: `Registration received! Complete details have been routed to the WealthCraft desk at ${NOTIFICATION_RECIPIENT_EMAIL}.`,
      deliveryMode: mailResult.mode,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Registration API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process registration" },
      { status: 500 }
    );
  }
}
