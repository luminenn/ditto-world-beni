import { createFileRoute } from "@tanstack/react-router";
import { LangProvider, useLang } from "@/lib/i18n";
import { NavBar } from "@/components/NavBar";
import { Hero } from "@/components/Hero";
import { Playground } from "@/components/Playground";
import { Shop } from "@/components/Shop";
import { StudyCorner } from "@/components/StudyCorner";

export const Route = createFileRoute("/")({
  component: Index,
});

function Footer() {
  const { t } = useLang();
  return (
    <footer className="mx-auto mt-24 mb-10 w-[min(1100px,94%)] text-center text-xs text-muted-foreground">
      {t("footer")}
    </footer>
  );
}

function Index() {
  return (
    <LangProvider>
      <div className="min-h-screen pb-10">
        <NavBar />
        <main>
          <Hero />
          <Playground />
          <Shop />
          <StudyCorner />
        </main>
        <Footer />
      </div>
    </LangProvider>
  );
}
