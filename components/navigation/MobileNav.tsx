import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Menu, X } from "lucide-react";

import { landingSections, type LandingSectionId } from "../../app/landingSections";
import { useAccessibilityLabels, useLabels } from "../../content/labels";
import { useLanguage } from "../../contexts/language";
import { NavPill } from "../ui/NavPill";

export function MobileNav({ activeSection }: { activeSection?: LandingSectionId }) {
  const { navigationLabels } = useLabels();
  const a11y = useAccessibilityLabels();
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback((beforeClose?: () => void) => {
    flushSync(() => {
      beforeClose?.();
      setOpen(false);
    });
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const getFocusableElements = () =>
      Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("a, button") ?? []).filter(
        (element) => !element.matches(":disabled"),
      );
    const focusBoundary = (reverse = false) => {
      const focusable = getFocusableElements();
      (reverse ? focusable.at(-1) : focusable[0])?.focus();
    };

    focusBoundary();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = getFocusableElements();
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;

      if (!dialogRef.current?.contains(document.activeElement)) {
        event.preventDefault();
        focusBoundary(event.shiftKey);
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const handleFocusIn = (event: FocusEvent) => {
      if (event.target instanceof Node && !dialogRef.current?.contains(event.target)) {
        focusBoundary();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocusIn);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, [closeMenu, open]);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? a11y.closeMenu : a11y.openMenu}
        aria-expanded={open}
        onClick={() => (open ? closeMenu() : setOpen(true))}
        className="grid size-11 place-items-center rounded-full text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      {open && (
        <div
          data-testid="mobile-nav-backdrop"
          className="fixed inset-0 z-50 bg-aic-navy/20"
          onClick={() => closeMenu()}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={a11y.mobileNavigation}
            className="fixed inset-x-4 top-20 rounded-media border border-aic-line bg-white p-3 shadow-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-end">
              <button
                type="button"
                aria-label={a11y.closeMenu}
                onClick={() => closeMenu()}
                className="grid size-11 place-items-center rounded-full text-aic-navy hover:bg-aic-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aic-blue"
              >
                <X aria-hidden="true" />
              </button>
            </div>
            <nav className="grid gap-1" aria-label={a11y.mobileNavigation}>
              {landingSections.map((section) => (
                <NavPill
                  key={section.id}
                  sectionId={section.id}
                  active={activeSection === section.id}
                  onClick={closeMenu}
                >
                  {navigationLabels[section.key]}
                </NavPill>
              ))}
              <div className="mt-4 flex items-center justify-center gap-4 border-t border-aic-line/50 pt-4 text-sm font-semibold text-aic-navy/80">
                <button
                  type="button"
                  onClick={() => closeMenu(() => setLanguage("vn"))}
                  aria-pressed={language === "vn"}
                  aria-label={a11y.vietnameseLanguage}
                  className={language === "vn" ? "font-bold text-aic-navy" : ""}
                >
                  VN
                </button>
                <span className="opacity-40" aria-hidden="true">
                  |
                </span>
                <button
                  type="button"
                  onClick={() => closeMenu(() => setLanguage("en"))}
                  aria-pressed={language === "en"}
                  aria-label={a11y.englishLanguage}
                  className={language === "en" ? "font-bold text-aic-navy" : ""}
                >
                  EN
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
