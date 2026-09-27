import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const lineItemSchema = z.object({
  id: z.string().trim().min(1).max(200),
  qty: z.number().int().positive().max(20),
});

const createCheckoutInput = z.object({
  items: z.array(lineItemSchema).min(1).max(50),
  origin: z.string().url(),
});

type DbCardRow = { id: string; name: string; price: number; image_url: string | null; availability: string };

// Prices and availability are re-verified against the database here rather than trusted
// from the client, so a tampered request can never buy a card below its real price.
export const createCheckoutSession = createServerFn({ method: "POST" })
  .validator((data: unknown) => createCheckoutInput.parse(data))
  .handler(async ({ data }) => {
    const { getStripe } = await import("./stripe.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const ids = data.items.map((i) => i.id);
    const { data: rows, error } = await supabaseAdmin
      .from("cards")
      .select("id, name, price, image_url, availability")
      .in("id", ids);
    if (error || !rows) {
      throw new Error("Could not verify your cart. Please refresh and try again.");
    }

    const byId = new Map((rows as DbCardRow[]).map((r) => [r.id, r]));
    const line_items = data.items.map((item) => {
      const row = byId.get(item.id);
      if (!row) throw new Error("One of the cards in your cart no longer exists.");
      if (row.availability === "sold_out") throw new Error(`"${row.name}" just sold out — sorry!`);
      return {
        quantity: item.qty,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(Number(row.price) * 100),
          product_data: {
            name: row.name,
            images: row.image_url ? [row.image_url] : undefined,
          },
        },
      };
    });

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      billing_address_collection: "required",
      shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "AU"] },
      // Flip STRIPE_ENABLE_TAX=true once Stripe Tax is registered/configured on the account.
      automatic_tax: { enabled: process.env.STRIPE_ENABLE_TAX === "true" },
      success_url: `${data.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${data.origin}/checkout`,
    });

    if (!session.url) throw new Error("Stripe did not return a checkout URL.");
    return { url: session.url };
  });

const getSessionInput = z.object({ sessionId: z.string().trim().min(1).max(300) });

export const getCheckoutSession = createServerFn({ method: "GET" })
  .validator((data: unknown) => getSessionInput.parse(data))
  .handler(async ({ data }) => {
    const { getStripe } = await import("./stripe.server");
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(data.sessionId);
    return {
      status: session.payment_status,
      email: session.customer_details?.email ?? null,
      amountTotal: session.amount_total,
      currency: session.currency,
    };
  });
