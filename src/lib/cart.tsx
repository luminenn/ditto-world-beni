import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = { id: string; title: string; price: number; imageUrl?: string; qty: number };
type CartInput = Omit<CartItem, "qty">;

const CART_KEY = "dittoland_cart_v1";

type Ctx = {
  items: CartItem[];
  expressItem: CartItem | null;
  addToCart: (item: CartInput, qty?: number) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  bumpQty: (id: string, delta: number) => void;
  clearCart: () => void;
  buyNow: (item: CartInput) => void;
  clearExpress: () => void;
  subtotal: number;
  count: number;
};

const CartCtx = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [expressItem, setExpressItem] = useState<CartItem | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* noop */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addToCart: Ctx["addToCart"] = (item, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + qty } : p));
      }
      return [...prev, { ...item, qty }];
    });
  };

  const removeFromCart = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id));

  const setQty = (id: string, qty: number) =>
    setItems((prev) =>
      qty <= 0 ? prev.filter((p) => p.id !== id) : prev.map((p) => (p.id === id ? { ...p, qty } : p)),
    );

  const bumpQty: Ctx["bumpQty"] = (id, delta) =>
    setItems((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: p.qty + delta } : p))
        .filter((p) => p.qty > 0),
    );

  const clearCart = () => setItems([]);
  const buyNow: Ctx["buyNow"] = (item) => setExpressItem({ ...item, qty: 1 });
  const clearExpress = () => setExpressItem(null);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartCtx.Provider
      value={{ items, expressItem, addToCart, removeFromCart, setQty, bumpQty, clearCart, buyNow, clearExpress, subtotal, count }}
    >
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
