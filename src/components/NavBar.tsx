import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Instagram, ShoppingCart } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useTab, type Tab } from "@/lib/tabs";
import { useCart } from "@/lib/cart";
import { BENI_INSTAGRAM_URL } from "@/lib/constants";
import { DittoSVG } from "./DittoSVG";
import { LanguageToggle } from "./LanguageToggle";

function CartButton() {
  const { count } = useCart();
  return (
    <Link to="/checkout" aria-label="Cart" className="relative">
      <motion.span
        whileHover={{ y: -2, rotate: 4 }}
        whileTap={{ scale: 0.94 }}
        className="flex h-9 w-9 items-center justify-center border-[2px] border-[var(--color-ink)]"
        style={{
          background: "var(--ditto-purple)",
          color: "#2E1547",
          boxShadow: "3px 3px 0 0 var(--color-ink)",
          borderRadius: 6,
        }}
      >
        <ShoppingCart size={16} />
      </motion.span>
      {count > 0 && (
        <span
          className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-[2px] border-[var(--color-ink)] px-1 text-[10px] font-extrabold"
          style={{ background: "var(--ditto-pink)", color: "#0A0414" }}
        >
          {count}
        </span>
      )}
    </Link>
  );
}

export function NavBar() {
  const { t } = useLang();
  const { tab, setTab } = useTab();
  const tabs: { key: Tab; label: "nav_playground" | "nav_shop" | "nav_study" | "nav_events" | "nav_about" }[] = [
    { key: "home", label: "nav_playground" },
    { key: "shop", label: "nav_shop" },
    { key: "events", label: "nav_events" },
    { key: "study", label: "nav_study" },
    { key: "about", label: "nav_about" },
  ];
  return (
    <header
      className="sticky top-4 z-40 mx-auto mt-4 flex w-[min(1480px,97%)] flex-wrap items-center justify-between gap-2 rounded-md border-[3px] border-[var(--color-ink)] px-4 py-2 backdrop-blur"
      style={{
        background: "rgba(255, 255, 255, 0.82)",
        boxShadow: "5px 5px 0 0 var(--color-ink), 0 0 24px rgba(243,165,255,0.25)",
      }}
    >
      <button
        onClick={() => setTab("home")}
        className="flex items-center gap-2 border-[2px] border-[var(--color-ink)] px-3 py-1"
        style={{
          background: "var(--ditto-purple)",
          color: "#2E1547",
          boxShadow: "3px 3px 0 0 var(--color-ink)",
          borderRadius: 6,
        }}
      >
        <motion.span
          animate={{ y: [0, -4, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block"
        >
          <DittoSVG size={36} />
        </motion.span>
        <span className="text-base font-bold">{t("brand")}</span>
      </button>
      <nav className="flex flex-1 flex-wrap justify-center gap-1.5">
        {tabs.map((tb, i) => {
          const active = tab === tb.key;
          return (
            <motion.button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              whileHover={{ y: -2, rotate: i % 2 ? 1.5 : -1.5 }}
              whileTap={{ scale: 0.96 }}
              className="whitespace-nowrap px-3.5 py-2 text-sm font-bold transition-colors"
              style={{
                background: active ? "var(--ditto-purple)" : "#FBF3FE",
                color: "#2E1547",
                border: `2px solid #1A122B`,
                borderRadius: 6,
                boxShadow: active
                  ? "4px 4px 0 0 #1A122B"
                  : "3px 3px 0 0 #1A122B",
              }}
            >
              {t(tb.label)}
            </motion.button>
          );
        })}
      </nav>
      <div className="flex items-center gap-2">
        <motion.a
          href={BENI_INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Beni's Instagram"
          whileHover={{ y: -2, rotate: -4 }}
          whileTap={{ scale: 0.94 }}
          className="flex h-9 w-9 items-center justify-center border-[2px] border-[var(--color-ink)]"
          style={{
            background: "linear-gradient(135deg, #C24FC2 0%, #6B3FA0 100%)",
            color: "#FFFFFF",
            boxShadow: "3px 3px 0 0 var(--color-ink)",
            borderRadius: 6,
          }}
        >
          <Instagram size={16} />
        </motion.a>
        <CartButton />
        <LanguageToggle />
      </div>
    </header>
  );
}
