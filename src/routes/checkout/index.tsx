import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Loader2, Lock, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart";
import { createCheckoutSession } from "@/lib/checkout.functions";

export const Route = createFileRoute("/checkout/")({
  component: CheckoutPage,
});

function LineRow({
  item,
  onBump,
  onRemove,
  readOnly,
}: {
  item: CartItem;
  onBump?: (delta: number) => void;
  onRemove?: () => void;
  readOnly?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 border-b-[2px] border-dashed border-[var(--color-ink)]/25 py-3 last:border-0">
      <div
        className="h-14 w-14 shrink-0 overflow-hidden rounded-md border-[2px] border-[var(--color-ink)] bg-[var(--cream)]"
        style={!item.imageUrl ? { background: "linear-gradient(160deg, #FBD3E4 0%, #B78CE0 100%)" } : undefined}
      >
        {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold" style={{ color: "#1A122B" }}>{item.title}</p>
        <p className="text-xs" style={{ color: "#6B5A85" }}>${item.price.toFixed(2)} each</p>
      </div>
      {!readOnly && onBump ? (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onBump(-1)}
            className="flex h-7 w-7 items-center justify-center rounded-md border-[2px] border-[var(--color-ink)] bg-white"
            aria-label="Decrease quantity"
          >
            <Minus size={12} />
          </button>
          <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
          <button
            onClick={() => onBump(1)}
            className="flex h-7 w-7 items-center justify-center rounded-md border-[2px] border-[var(--color-ink)] bg-white"
            aria-label="Increase quantity"
          >
            <Plus size={12} />
          </button>
        </div>
      ) : (
        <span className="text-sm font-bold">×{item.qty}</span>
      )}
      <span className="w-16 shrink-0 text-right text-sm font-bold" style={{ color: "#1A122B" }}>
        ${(item.price * item.qty).toFixed(2)}
      </span>
      {!readOnly && onRemove && (
        <button onClick={onRemove} aria-label="Remove" className="text-[#6B5A85] hover:text-[var(--ditto-pink)]">
          <Trash2 size={15} />
        </button>
      )}
    </div>
  );
}

function CheckoutPage() {
  const { items, expressItem, bumpQty, removeFromCart, clearExpress, subtotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const usingExpress = !!expressItem;
  const displayItems: CartItem[] = usingExpress ? [expressItem!] : items;
  const total = usingExpress ? expressItem!.price * expressItem!.qty : subtotal;
  const isEmpty = displayItems.length === 0;

  const goToStripe = async () => {
    setErr(null);
    setLoading(true);
    try {
      const result = await createCheckoutSession({
        data: {
          items: displayItems.map((i) => ({ id: i.id, qty: i.qty })),
          origin: window.location.origin,
        },
      });
      window.location.href = result.url;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setErr(msg.includes("STRIPE_SECRET_KEY") ? "Payments aren't set up yet — check back soon!" : msg);
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen pb-16" style={{ background: "var(--background)" }}>
      <div className="mx-auto w-[min(720px,94%)] pt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold hover:text-[var(--ditto-pink)]"
          style={{ color: "var(--muted-foreground)" }}
        >
          <ArrowLeft size={14} /> Back to DittoWorld
        </Link>

        <h1 className="mt-4 text-3xl font-bold sm:text-4xl text-white">
          Checkout
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
          Review your order below. You'll enter your shipping address and payment details next, on Stripe's
          secure checkout page.
        </p>

        {usingExpress && items.length > 0 && (
          <button
            onClick={clearExpress}
            className="mt-3 text-xs font-bold underline decoration-dotted underline-offset-2 text-[var(--ditto-pink)]"
          >
            ← Use my full cart instead ({items.length} item{items.length === 1 ? "" : "s"})
          </button>
        )}

        <div className="card-doodle mt-6 p-5" style={{ background: "var(--cream)" }}>
          {isEmpty ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <ShoppingBag size={36} className="text-[#6B5A85]" />
              <p className="text-sm font-bold" style={{ color: "#1A122B" }}>Your cart is empty.</p>
              <Link
                to="/"
                className="pill-btn pill-btn-hover text-sm"
                style={{ background: "var(--ditto-purple)", color: "#fff" }}
              >
                Browse the Shop
              </Link>
            </div>
          ) : (
            <>
              <div>
                {displayItems.map((item) => (
                  <LineRow
                    key={item.id}
                    item={item}
                    readOnly={usingExpress}
                    onBump={usingExpress ? undefined : (delta) => bumpQty(item.id, delta)}
                    onRemove={usingExpress ? undefined : () => removeFromCart(item.id)}
                  />
                ))}
              </div>

              <div className="mt-4 space-y-1 border-t-[2.5px] border-[var(--color-ink)] pt-3">
                <div className="flex items-center justify-between text-sm" style={{ color: "#6B5A85" }}>
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs" style={{ color: "#6B5A85" }}>
                  <span>Tax &amp; shipping</span>
                  <span>Calculated at the next step</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-lg font-bold" style={{ color: "#1A122B" }}>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {err && (
                <p className="mt-3 rounded-md border-[2px] border-[var(--color-ink)] bg-[#FFF0F0] px-3 py-2 text-xs font-bold text-[#7A2E1B]">
                  {err}
                </p>
              )}

              <button
                onClick={goToStripe}
                disabled={loading}
                className="pill-btn pill-btn-hover mt-5 w-full justify-center text-sm disabled:opacity-70"
                style={{ background: "var(--ditto-pink)", color: "#0A0414" }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Redirecting to secure payment…
                  </>
                ) : (
                  <>
                    <Lock size={15} /> Continue to Secure Payment
                  </>
                )}
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px]" style={{ color: "#6B5A85" }}>
                <Lock size={11} /> Payments are processed by Stripe. We never see or store your card details.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
