import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { DittoSVG } from "./DittoSVG";
import { LanguageToggle } from "./LanguageToggle";

export function NavBar() {
  const { t } = useLang();
  const links: { href: string; label: string }[] = [
    { href: "#playground", label: t("nav_playground") },
    { href: "#gallery", label: t("nav_gallery") },
    { href: "#study", label: t("nav_study") },
  ];
  return (
    <header className="sticky top-4 z-40 mx-auto mt-4 flex w-[min(1100px,94%)] items-center justify-between rounded-full border-[3px] border-[var(--color-ink)] bg-[var(--cream)]/95 px-4 py-2 shadow-[5px_5px_0_0_var(--color-ink)] backdrop-blur">
      <a href="#top" className="flex items-center gap-2">
        <motion.span
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ rotate: [-4, 4, -4], transition: { duration: 0.5 } }}
          className="inline-block"
        >
          <DittoSVG size={44} />
        </motion.span>
        <span className="text-lg font-bold">{t("brand")}</span>
      </a>
      <nav className="hidden gap-2 md:flex">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="pill-btn pill-btn-hover text-sm"
          >
            {l.label}
          </a>
        ))}
      </nav>
      <LanguageToggle />
    </header>
  );
}
