import { useState, useEffect, type MouseEvent } from "react";
import { useLocation } from "react-router-dom";
import { landingHref, type LandingSectionId } from "../../app/landingSections";
import { useLabels } from "../../content/labels";
import type { SiteContent } from "../../content/types";
import { scrollToSection } from "../../lib/scrollToSection";
import { isPrimaryUnmodifiedClick } from "../../lib/primaryClick";
import { Button } from "../ui/Button";
import { PageContainer } from "../ui/PageContainer";
import { bodyCopyTypography } from "../ui/typography";
import { cn } from "../../lib/cn";
import { HeroMedia } from "../media/HeroMedia";

export function DynamicHero({ content }: { content: SiteContent["hero"] }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const { heroLabels } = useLabels();
  const { pathname } = useLocation();
  const phrases = heroLabels.phrases;

  const handleLandingAction =
    (sectionId: LandingSectionId) => (event: MouseEvent<HTMLAnchorElement>) => {
      if (!isPrimaryUnmodifiedClick(event)) return;

      if (pathname !== "/") return;

      event.preventDefault();
      scrollToSection(sectionId);
    };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || phrases.length < 2) return;

    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [phrases.length, prefersReducedMotion]);

  return (
    <section
      data-testid="home-hero"
      className="relative flex min-h-[660px] items-center overflow-hidden bg-aic-navy-deep pb-32 pt-40 text-white md:min-h-[760px] md:pb-40 md:pt-48"
    >
      <HeroMedia
        mediaRef={content.mediaRef}
        asset={content.media}
        background
        reducedMotion={prefersReducedMotion}
      />

      {/* Flat navy-deep scrim keeps video/image brightness even while holding the section's solid block color. */}
      <div className="absolute inset-0 z-1 bg-aic-navy-deep/78" aria-hidden="true"></div>

      {/* Faint technical grid, like a systems dashboard, reinforces the AI/tech register. */}
      <div className="hero-grid absolute inset-0 z-1" aria-hidden="true"></div>

      <PageContainer className="relative z-10 text-center">
        <div className="mx-auto max-w-5xl">
          {content.eyebrow && (
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-aic-gold backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-aic-gold" aria-hidden="true" />
              {content.eyebrow}
            </p>
          )}
          <h1 className="font-display text-[length:var(--type-hero-size)] font-bold leading-[var(--type-hero-line)] tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,.65)]">
            {content.title}
          </h1>
          <div className="mt-8 flex h-10 items-center justify-center">
            <span
              key={phraseIndex}
              className="animate-cycle font-mono text-base font-medium uppercase tracking-[0.2em] text-aic-gold md:text-lg"
            >
              {phrases[phraseIndex]}
            </span>
          </div>
          {content.description && (
            <p
              className={cn(
                "mx-auto mt-6 max-w-3xl font-semibold text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,.65)]",
                bodyCopyTypography,
              )}
            >
              {content.description}
            </p>
          )}
          <div className="mt-11 flex flex-wrap justify-center gap-4">
            {content.primaryCta && (
              <Button
                href={landingHref("nghien-cuu")}
                variant="primary"
                onClick={handleLandingAction("nghien-cuu")}
                className="bg-aic-blue text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-aic-blue/90 hover:shadow-nested-hover"
              >
                {content.primaryCta}
              </Button>
            )}
            {content.secondaryCta && (
              <Button
                href={landingHref("sinh-vien")}
                variant="primary"
                onClick={handleLandingAction("sinh-vien")}
                className="bg-white/10 text-white shadow-lg ring-1 ring-inset ring-white/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15"
              >
                {content.secondaryCta}
              </Button>
            )}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
