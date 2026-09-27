import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useCart } from "@/lib/cart";
import { getCheckoutSession } from "@/lib/checkout.functions";

export const Route = createFileRoute("/checkout/success")({
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { session_id } = Route.useSearch();
  const { clearCart, clearExpress } = useCart();
  const [state, setState] = useState<"loading" | "paid" | "unpaid" | "error">("loading");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!session_id) {
      setState("error");
      return;
    }
    (async () => {
      try {
        const session = await getCheckoutSession({ data: { sessionId: session_id } });
        setEmail(session.email);
        if (session.status === "paid") {
          setState("paid");
          clearCart();
          clearExpress();
        } else {
          setState("unpaid");
        }
      } catch {
        setState("error");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session_id]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "var(--background)" }}>
      <div className="card-doodle w-full max-w-md p-8 text-center" style={{ background: "var(--cream)" }}>
        {state === "loading" && (
          <>
            <Loader2 className="mx-auto mb-3 animate-spin text-[var(--ditto-purple)]" size={40} />
            <p className="text-sm font-bold" style={{ color: "#1A122B" }}>Confirming your order…</p>
          </>
        )}
        {state === "paid" && (
          <>
            <CheckCircle2 className="mx-auto mb-3 text-[var(--mint)]" size={44} />
            <h1 className="text-2xl font-bold" style={{ color: "var(--ditto-deep)" }}>Thank you!</h1>
            <p className="mt-2 text-sm" style={{ color: "#6B5A85" }}>
              Your order is confirmed{email ? ` — a receipt was sent to ${email}` : ""}. Beni will get your cards
              ready to ship!
            </p>
          </>
        )}
        {state === "unpaid" && (
          <>
            <XCircle className="mx-auto mb-3 text-[var(--ditto-pink)]" size={44} />
            <h1 className="text-2xl font-bold" style={{ color: "var(--ditto-deep)" }}>Payment not completed</h1>
            <p className="mt-2 text-sm" style={{ color: "#6B5A85" }}>
              It looks like this order wasn't finished. No charge was made.
            </p>
          </>
        )}
        {state === "error" && (
          <>
            <XCircle className="mx-auto mb-3 text-[var(--ditto-pink)]" size={44} />
            <h1 className="text-2xl font-bold" style={{ color: "var(--ditto-deep)" }}>Couldn't confirm order</h1>
            <p className="mt-2 text-sm" style={{ color: "#6B5A85" }}>
              We couldn't verify this order. If you were charged, please contact Beni with your receipt.
            </p>
          </>
        )}
        <Link
          to="/"
          className="pill-btn pill-btn-hover mx-auto mt-6 text-sm"
          style={{ background: "var(--ditto-purple)", color: "#fff" }}
        >
          Back to DittoWorld
        </Link>
      </div>
    </div>
  );
}
