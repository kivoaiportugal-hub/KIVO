import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        "STRIPE_SECRET_KEY is not configured. Add it in Vercel → Settings → Environment Variables."
      );
    }
    _stripe = new Stripe(key, {
      apiVersion: "2026-05-27.dahlia",
      typescript: true,
    });
  }
  return _stripe;
}

// Keep backward compatibility
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as any)[prop];
  },
});

export function getStripePublishableKey() {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
}
