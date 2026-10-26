import Stripe from "stripe";

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-09-30.acacia" as unknown as Stripe.LatestApiVersion,
    })
  : null;

export const STRIPE_PRO_PRICE_INR = 999; // Rs 999 / month
