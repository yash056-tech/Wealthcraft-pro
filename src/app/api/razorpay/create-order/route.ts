import { NextRequest, NextResponse } from "next/server";
import { razorpay, razorpayKeyId } from "@/lib/razorpay/razorpay-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const amount = Number(body.amount) || 999; // Amount in INR
    const planName = body.planName || "Pro Tier Monthly";
    const amountInPaise = Math.round(amount * 100);

    if (!razorpay || !razorpayKeyId) {
      // Graceful simulated mode when keys are not configured yet
      const mockOrderId = `order_sim_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      return NextResponse.json({
        orderId: mockOrderId,
        amount: amountInPaise,
        currency: "INR",
        keyId: "rzp_test_simulated",
        simulated: true,
        planName,
      });
    }

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        planName,
        customerName: body.customerName || "WealthCraft Client",
        customerEmail: body.customerEmail || "",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: razorpayKeyId,
      simulated: false,
      planName,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Razorpay Create Order Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
