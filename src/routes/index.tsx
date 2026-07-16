import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { LangProvider, useLang } from "@/lib/i18n";
import { TabProvider, useTab } from "@/lib/tabs";
import { AdminProvider } from "@/lib/admin";
import { NavBar } from "@/components/NavBar";
import { Hero } from "@/components/Hero";
import { Playground } from "@/components/Playground";
import { Shop, AdminBanner, AdminLoginLink } from "@/components/Shop";
import { StudyCorner } from "@/components/StudyCorner";

export const Route = createFileRoute("/")({
  component: Index,
});

function Footer() {
  const { t } = useLang();
  return (
    <footer className="mx-auto mt-24 mb-10 w-[min(1100px,94%)] text-center text-xs text-muted-foreground">
      <div>{t("footer")}</div>
      <div className="mt-3">
        <AdminLoginLink />
      </div>
    </footer>
  );
}

function TabbedContent() {
  const { tab } = useTab();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        {tab === "home" && (
          <>
            <Hero />
            <Playground />
          </>
        )}
        {tab === "shop" && <Shop />}
        {tab === "study" && <StudyCorner />}
      </motion.div>
    </AnimatePresence>
  );
}

function Index() {
  return (
    <LangProvider>
      <AdminProvider>
        <TabProvider>
          <div className="min-h-screen pb-10">
            <AdminBanner />
            <NavBar />
            <main>
              <TabbedContent />
            </main>
            <Footer />
          </div>
        </TabProvider>
      </AdminProvider>
    </LangProvider>
  );
}
