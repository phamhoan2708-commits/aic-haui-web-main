import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToSection } from "../../lib/scrollToSection";

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (pathname === "/" && hash) {
      const sectionId = hash.slice(1);
      const frame = requestAnimationFrame(() => scrollToSection(sectionId, "auto"));
      return () => cancelAnimationFrame(frame);
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}
