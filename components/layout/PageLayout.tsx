import { Outlet } from "react-router-dom";
import { useLabels } from "../../content/labels";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ScrollToTop } from "./ScrollToTop";

export function PageLayout() {
  const { layoutLabels } = useLabels();

  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-full bg-aic-navy px-4 py-2 text-white focus:translate-y-0"
      >
        {layoutLabels.skipToContent}
      </a>
      <ScrollToTop />
      <Header />
      <main id="main-content" className="pt-16 lg:pt-[120px]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
