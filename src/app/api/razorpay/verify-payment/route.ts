import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay/razorpay-server";
import { sendPaymentSuccessNotificationEmail } from "@/lib/email/mailer";
import { createClient } from "@/lib/supabase/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planName = "Pro Tier Monthly",
      amount = 999,
      customerName = "WealthCraft Member",
      customerEmail = "client@wealthcraft.pro",
      customerPhone,
      isSimulated = false,
    } = body;

    // Validate signature unless in explicit simulated testing
    if (!isSimulated) {
      const isValid = verifyRazorpaySignature({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      });

      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid payment signature verification" },
          { status: 400 }
        );
      }
    }

    // Dispatch payment alert email to ya09shu@gmail.com
    await sendPaymentSuccessNotificationEmail({
      customerName,
      customerEmail,
      customerPhone,
      amount,
      planName,
      gateway: "Razorpay",
      paymentId: razorpay_payment_id || `pay_${Date.now()}`,
      orderId: razorpay_order_id,
    });

    // Optionally record payment in Supabase if connected
    try {
      const supabase = createClient();
      if (supabase) {
        await supabase.from("payments").insert([
          {
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
            amount,
            customer_name: customerName,
            customer_email: customerEmail,
            plan_name: planName,
            gateway: "Razorpay",
            status: "SUCCESS",
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      // Non-blocking
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully. Pro subscription is now active!",
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Razorpay Verify Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}
