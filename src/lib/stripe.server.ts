// Server-only Stripe client. Never import this from a route/component file directly —
// load it dynamically inside a server function handler, same convention as supabaseAdmin.
import Stripe from "stripe";

let _stripe: Stripe | undefined;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "Payments aren't configured yet. Set STRIPE_SECRET_KEY in .env.local to enable checkout.",
    );
  }
  if (!_stripe) _stripe = new Stripe(key);
  return _stripe;
}
