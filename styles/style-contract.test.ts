import { describe, expect, it } from "vitest";
import postcss from "postcss";
import tailwindcss from "tailwindcss";

import indexSource from "../../index.html?raw";
import eslintConfig from "../../eslint.config.js?raw";
import tailwindConfig from "../../tailwind.config";
import mainSource from "../main.tsx?raw";
import personCardSource from "../components/cards/PersonCard.tsx?raw";
import researchCardSource from "../components/cards/ResearchCards.tsx?raw";
import studentCardSource from "../components/cards/StudentCards.tsx?raw";
import councilPanelSource from "../components/cards/CouncilPanel.tsx?raw";
import contactCardSource from "../components/cards/ContactCards.tsx?raw";
import cardSource from "../components/ui/Card.tsx?raw";
import dynamicHeroSource from "../components/sections/DynamicHero.tsx?raw";
import homeNewsSource from "../components/sections/HomeNews.tsx?raw";
import homeAboutSource from "../components/sections/HomeAbout.tsx?raw";
import pageHeroSource from "../components/sections/PageHero.tsx?raw";
import sectionHeadingSource from "../components/ui/SectionHeading.tsx?raw";
import typographySource from "../components/ui/typography.ts?raw";
import mediaFrameSource from "../components/media/MediaFrame.tsx?raw";
import logoFrameSource from "../components/media/LogoFrame.tsx?raw";
import headerSource from "../components/layout/Header.tsx?raw";
import designSource from "../../DESIGN.md?raw";
import globalsCss from "./globals.css?raw";
import tokensCss from "./tokens.css?raw";
import tailwindConfigSource from "../../tailwind.config.ts?raw";

function cssBlock(source: string, selector: string) {
  const selectorStart = source.indexOf(selector);
  const openingBrace = source.indexOf("{", selectorStart);

  if (selectorStart === -1 || openingBrace === -1) return "";

  let depth = 0;
  for (let index = openingBrace; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(openingBrace + 1, index);
  }

  return "";
}

describe("runtime style contract", () => {
  it("documents the approved AIC typography and header contract", () => {
    expect(designSource).toContain("Be Vietnam Pro");
    expect(designSource).toContain("Desktop hero: 56px / 64px / 700");
    expect(designSource).toContain("Desktop header: 72px brand tier + 48px navigation tier");
    expect(designSource).not.toMatch(/(?:Mobile|Desktop) body:[^\n]*\/ 400/);
    expect(designSource).toContain(
      "Equivalent heading levels use consistent capitalization and typography.",
    );
    expect(designSource).toContain("Staff portrait scale is exactly 1.2 on hover.");
  });

  it("defines every approved mobile typography and header variable", () => {
    const mobileRoot = cssBlock(tokensCss, ":root");

    for (const declaration of [
      "--type-body-size: 14px",
      "--type-body-line: 24px",
      "--type-card-size: 17px",
      "--type-card-line: 25px",
      "--type-section-size: 22px",
      "--type-section-line: 31px",
      "--type-major-size: 30px",
      "--type-major-line: 42px",
      "--type-hero-size: 36px",
      "--type-hero-line: 44px",
      "--landing-header-offset: 64px",
    ]) {
      expect(mobileRoot).toContain(declaration);
    }
  });

  it("overrides every approved desktop typography and header variable", () => {
    const desktopMedia = cssBlock(tokensCss, "@media (min-width: 1024px)");
    const desktopRoot = cssBlock(desktopMedia, ":root");

    for (const declaration of [
      "--type-body-line: 26px",
      "--type-card-size: 18px",
      "--type-card-line: 27px",
      "--type-section-size: 23px",
      "--type-section-line: 34px",
      "--type-major-size: 35px",
      "--type-major-line: 52px",
      "--type-hero-size: 56px",
      "--type-hero-line: 64px",
      "--landing-header-offset: 120px",
    ]) {
      expect(desktopRoot).toContain(declaration);
    }
  });

  it("applies the shared type variables to the body and shared heading hierarchy", () => {
    expect(globalsCss).toMatch(
      /body\s*\{[^}]*font-size:\s*var\(--type-body-size\)[^}]*line-height:\s*var\(--type-body-line\)/s,
    );
    expect(sectionHeadingSource).toMatch(
      /<h2\s+className="[^"]*text-\[length:var\(--type-section-size\)\][^"]*leading-\[var\(--type-section-line\)\][^"]*"/,
    );
    expect(pageHeroSource).toMatch(
      /<h1\s+className="[^"]*text-\[length:var\(--type-major-size\)\][^"]*leading-\[var\(--type-major-line\)\][^"]*"/,
    );
    expect(dynamicHeroSource).toMatch(
      /<h1\s+className="[^"]*text-\[length:var\(--type-hero-size\)\][^"]*leading-\[var\(--type-hero-line\)\][^"]*"/,
    );
  });

  it("compiles descendant card headings and body-copy tokens for representative consumers", async () => {
    const componentSources = [
      cardSource,
      homeNewsSource,
      researchCardSource,
      personCardSource,
      studentCardSource,
      councilPanelSource,
      homeAboutSource,
      contactCardSource,
      sectionHeadingSource,
      pageHeroSource,
      dynamicHeroSource,
      typographySource,
      mediaFrameSource,
      logoFrameSource,
      headerSource,
    ].join("\n");
    const result = await postcss([
      tailwindcss({
        ...tailwindConfig,
        content: [{ raw: componentSources, extension: "tsx" }],
      }),
    ]).process("@tailwind utilities;", { from: undefined });

    let cardHeadingCss = "";
    result.root.walkRules((rule) => {
      if (rule.selector.endsWith(" h3")) cardHeadingCss += rule.toString();
    });

    expect(cardHeadingCss).toContain("font-size: var(--type-card-size)");
    expect(cardHeadingCss).toContain("line-height: var(--type-card-line)");
    expect(cardHeadingCss).toContain("font-weight: 700");
    expect(cardHeadingCss).not.toContain(">h3");
    expect(homeAboutSource).toContain("bodyCopyTypography");
    expect(studentCardSource).toContain("cardHeadingTypography");
    expect(councilPanelSource).toContain("cardHeadingTypography");
    expect(contactCardSource).toContain("bodyCopyTypography");
    expect(contactCardSource).toContain("cardHeadingTypography");

    for (const [property, token] of [
      ["font-size", "--type-body-size"],
      ["line-height", "--type-body-line"],
      ["font-size", "--type-section-size"],
      ["line-height", "--type-section-line"],
      ["font-size", "--type-major-size"],
      ["line-height", "--type-major-line"],
      ["font-size", "--type-hero-size"],
      ["line-height", "--type-hero-line"],
    ]) {
      expect(result.css).toContain(`${property}: var(${token})`);
    }
  });

  it("compiles one explicitly owned ten-pixel radius for the Header logo frame", async () => {
    expect(mediaFrameSource).toContain('radiusClassName = "rounded-media"');
    expect(logoFrameSource).toContain('radiusClassName = "rounded-card"');
    expect(headerSource).toContain('radiusClassName="rounded-[10px]"');

    const result = await postcss([
      tailwindcss({
        ...tailwindConfig,
        content: [
          {
            raw: [mediaFrameSource, logoFrameSource, headerSource].join("\n"),
            extension: "tsx",
          },
        ],
      }),
    ]).process("@tailwind utilities;", { from: undefined });

    expect(result.css).toContain("border-radius: 10px");
  });

  it("compiles a cascade-safe reduced-motion override for staff portrait zoom", async () => {
    const result = await postcss([
      tailwindcss({
        ...tailwindConfig,
        content: [{ raw: personCardSource, extension: "tsx" }],
      }),
    ]).process("@tailwind utilities;", { from: undefined });

    let reducedMotionCss = "";
    result.root.walkAtRules("media", (rule) => {
      if (rule.params.includes("prefers-reduced-motion: reduce")) {
        reducedMotionCss += rule.toString();
      }
    });

    expect(reducedMotionCss).toContain("transform: none !important");
    expect(reducedMotionCss).toContain("transition-property: none");
  });

  it("does not retain Merriweather or Google Fonts dependencies", () => {
    const fontSources = [globalsCss, tailwindConfigSource, indexSource].join("\n");

    expect(fontSources).not.toMatch(/Merriweather/i);
    expect(fontSources).not.toMatch(/fonts\.googleapis\.com|fonts\.gstatic\.com/i);
  });

  it("uses linear technical treatments instead of radial or pseudo-element orbs", () => {
    const visualSources = [globalsCss, tailwindConfigSource, dynamicHeroSource].join("\n");

    expect(visualSources).not.toMatch(/radial-gradient/i);
    expect(globalsCss).not.toMatch(/\.hero-visual::(?:before|after)/);
    expect(globalsCss).not.toContain("hero-drift");
    expect(globalsCss).toMatch(/\.prototype-media-slot\s*\{[^}]*linear-gradient/s);
    expect(globalsCss).toMatch(/\.hero-scrim\s*\{[^}]*linear-gradient/s);
  });

  it("keeps semantic media slots static and disables named motion surfaces", () => {
    expect(globalsCss).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.route-transition,[\s\S]*\.hero-grid,[\s\S]*\.partner-track\s*\{[^}]*animation:\s*none\s*!important/s,
    );
    expect(globalsCss).toMatch(/\.prototype-media-slot\s*\{[^}]*background-size:/s);
    expect(globalsCss).not.toMatch(/\.prototype-media-slot\s*\{[^}]*animation:/s);
  });

  it("preserves the approved responsive, focus, font, and radius tokens", () => {
    expect(globalsCss).toMatch(/body\s*\{[^}]*min-width:\s*320px[^}]*overflow-x:\s*hidden/s);
    expect(globalsCss).toMatch(/:focus-visible\s*\{[^}]*outline:/s);
    expect(globalsCss).toContain('font-family: "Be Vietnam Pro", "Inter", system-ui, sans-serif');
    expect(tokensCss).toContain("--aic-warm: #fffaf0");
    expect(tailwindConfigSource).toContain(
      'borderRadius: { card: "22px", media: "24px", video: "28px", hero: "32px" }',
    );
  });

  it("loads every Be Vietnam Pro weight locally without subset-only imports", () => {
    expect(indexSource).not.toContain("fonts.googleapis.com");
    expect(indexSource).not.toContain("fonts.gstatic.com");
    expect(indexSource).not.toMatch(/rel=["']preconnect["']/i);

    for (const weight of [400, 500, 600, 700, 800]) {
      expect(mainSource).toContain(`import "@fontsource/be-vietnam-pro/${weight}.css"`);
    }
    expect(mainSource).not.toContain("/vietnamese-");
  });

  it("keeps generated screenshot evidence outside lint without excluding source or docs", () => {
    expect(eslintConfig).toContain('"screenshots*/**"');
    expect(eslintConfig).not.toMatch(/ignores:\s*\[[^\]]*["'](?:src|docs)(?:\/\*\*)?["']/s);
  });
});
