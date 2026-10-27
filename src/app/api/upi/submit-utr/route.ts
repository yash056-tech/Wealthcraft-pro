import { NextRequest, NextResponse } from "next/server";
import { sendPaymentSuccessNotificationEmail } from "@/lib/email/mailer";
import { createClient } from "@/lib/supabase/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      utrNumber,
      amount = 999,
      planName = "Pro Tier Monthly",
      customerName,
      customerEmail,
      customerPhone,
      upiIdUsed = "ya09shu@okaxis",
    } = body;

    if (!utrNumber || utrNumber.trim().length < 6) {
      return NextResponse.json(
        { error: "Please enter a valid 12-digit UPI Transaction / UTR Reference Number." },
        { status: 400 }
      );
    }

    if (!customerEmail || !customerEmail.includes("@")) {
      return NextResponse.json(
        { error: "A valid Email Address is required." },
        { status: 400 }
      );
    }

    // Email payment alert to ya09shu@gmail.com
    await sendPaymentSuccessNotificationEmail({
      customerName: customerName || "UPI Customer",
      customerEmail,
      customerPhone,
      amount: Number(amount),
      planName,
      gateway: "Direct UPI (UTR)",
      paymentId: `UTR-${utrNumber.trim().toUpperCase()}`,
      orderId: `UPI-TO-${upiIdUsed}`,
      notes: `User submitted UPI UTR reference: ${utrNumber}. Check bank statement for confirmation.`,
    });

    // Optionally record in Supabase
    try {
      const supabase = createClient();
      if (supabase) {
        await supabase.from("payments").insert([
          {
            order_id: `UPI-TO-${upiIdUsed}`,
            payment_id: `UTR-${utrNumber.trim()}`,
            amount: Number(amount),
            customer_name: customerName,
            customer_email: customerEmail,
            customer_phone: customerPhone,
            plan_name: planName,
            gateway: "Direct UPI",
            status: "PENDING_VERIFICATION",
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      // Non-blocking
    }

    return NextResponse.json({
      success: true,
      message: `UPI payment submission received! UTR reference (${utrNumber}) has been forwarded to the desk for confirmation. Pro access is unlocked.`,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("UPI Submit Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process UPI transaction submission" },
      { status: 500 }
    );
  }
}
