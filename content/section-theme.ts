import type { LandingSectionId } from "../app/landingSections";

/**
 * Central "color coding" identity for each landing-page section.
 * Used by SectionHeading (eyebrow + accent tick) and NavPill (active nav state)
 * so every touchpoint of a given section stays visually consistent.
 */
export type SectionAccent = {
  /** Text color class applied to the eyebrow label. */
  eyebrowClassName: string;
  /** Background color class applied to the small accent tick beside the eyebrow. */
  accentClassName: string;
  /** Classes applied to the desktop/mobile nav pill when this section is active. */
  navActiveClassName: string;
};

/**
 * Eyebrow tag color follows the section's background: navy sections use the
 * gold tag, white sections use the blue tag. Nav pill colors stay per-section
 * so the navigation keeps a distinct identity for each anchor.
 */
const goldOnNavy = { eyebrowClassName: "text-aic-gold", accentClassName: "bg-aic-gold" } as const;
const blueOnWhite = { eyebrowClassName: "text-aic-blue", accentClassName: "bg-aic-blue" } as const;

export const sectionAccents: Record<LandingSectionId, SectionAccent> = {
  "ve-chung-toi": {
    ...goldOnNavy,
    navActiveClassName:
      "border-aic-navy/30 bg-aic-navy text-white shadow-soft ring-1 ring-aic-navy/30",
  },
  "to-chuc": {
    ...blueOnWhite,
    navActiveClassName:
      "border-aic-muted/30 bg-aic-muted text-white shadow-soft ring-1 ring-aic-muted/30",
  },
  "nghien-cuu": {
    ...goldOnNavy,
    navActiveClassName:
      "border-aic-gold-dark/30 bg-aic-gold-dark text-white shadow-soft ring-1 ring-aic-gold/30",
  },
  "hop-tac": {
    ...blueOnWhite,
    navActiveClassName:
      "border-aic-tech/30 bg-aic-tech text-white shadow-soft ring-1 ring-aic-tech/30",
  },
  "sinh-vien": {
    ...goldOnNavy,
    navActiveClassName:
      "border-aic-teal-dark/30 bg-aic-teal-dark text-white shadow-soft ring-1 ring-aic-teal/30",
  },
  "lien-he": {
    ...blueOnWhite,
    navActiveClassName:
      "border-aic-ink/30 bg-aic-ink text-white shadow-soft ring-1 ring-aic-ink/30",
  },
};
