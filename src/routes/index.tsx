import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { LangProvider, useLang } from "@/lib/i18n";
import { TabProvider, useTab } from "@/lib/tabs";
import { AdminProvider } from "@/lib/admin";
import { DittoCustomizationProvider } from "@/lib/dittoCustomization";
import { NavBar } from "@/components/NavBar";
import { Hero } from "@/components/Hero";
import { Playground } from "@/components/Playground";
import { Shop, AdminBanner, AdminLoginLink } from "@/components/Shop";
import { StudyCorner } from "@/components/StudyCorner";
import { StarField } from "@/components/StarField";
import { Polaroid } from "@/components/Polaroid";
import { Events } from "@/components/Events";
import { About } from "@/components/About";

function HomePolaroids() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 hidden 2xl:block">
      <Polaroid
        src="/images/polaroid-1.jpg"
        alt="Beni and a customer at a convention"
        caption="Con days :)"
        rotate={-8}
        tapeIndex={0}
        className="absolute left-[2%] top-4 w-[150px]"
      />
      <Polaroid
        src="/images/polaroid-2.jpg"
        alt="A hand-drawn Pokemon card"
        caption="fresh art"
        rotate={7}
        tapeIndex={1}
        className="absolute right-[2%] top-24 w-[150px]"
      />
      <Polaroid
        src="/images/polaroid-3.jpg"
        alt="Ditto being squished"
        caption="squish squish"
        rotate={6}
        tapeIndex={2}
        className="absolute left-[3%] bottom-4 w-[140px]"
      />
      <Polaroid
        src="/images/polaroid-4.jpg"
        alt="Beni's booth setup"
        caption="the booth"
        rotate={-6}
        tapeIndex={3}
        className="absolute right-[3%] bottom-16 w-[140px]"
      />
    </div>
  );
}

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
    <div>
      {tab === "home" && (
        <div className="relative">
          <HomePolaroids />
          <Hero />
          <Playground />
        </div>
      )}
      {tab === "shop" && <Shop />}
      {tab === "study" && <StudyCorner />}
      {tab === "events" && <Events />}
      {tab === "about" && <About />}
    </div>
  );
}

function Index() {
  return (
    <LangProvider>
      <AdminProvider>
        <TabProvider>
          <DittoCustomizationProvider>
            <div className="relative min-h-screen pb-10">
              <StarField count={24} />
              <div className="relative z-10">
                <AdminBanner />
                <NavBar />
                <main>
                  <TabbedContent />
                </main>
                <Footer />
              </div>
            </div>
          </DittoCustomizationProvider>
        </TabProvider>
      </AdminProvider>
    </LangProvider>
  );
}
