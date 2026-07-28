# QA Report

Date: 2026-07-13

## Current automated gates

- Vitest: 21 files, 130 tests passed, 0 failed.
- ESLint: 0 errors, 0 warnings.
- TypeScript project build and Vite production build: passed.
- Focused composition tests cover verified provenance guards, all collection merge paths, lab-name overlays, input immutability and nested media isolation.
- Style contracts cover static missing-media slots, no radial/orb runtime treatment and explicit reduced-motion fallbacks.
- Be Vietnam Pro Vietnamese weights 400-800 are self-hosted from `@fontsource/be-vietnam-pro`; the runtime no longer depends on Google Fonts, so the primary typeface remains available during local and offline QA.

## Runtime content provenance

The current runtime intentionally composes two sources:

- Verified AIC data: institutional identity, parent unit, address, contact email, contact cards and the official names `AIC Foundry Lab` and `AIC Innovation Lab`.
- Stitch demo data: people, roles, biographies, council members, research directions, metrics, research groups, cooperation records, partner labels, lab descriptions/benefits and join steps. These records render intentionally and carry `source: "stitch"`.

Stitch people, metrics, research claims and partners are prototype content, not verified AIC facts. They are not disabled in production. A generic collection record replaces or extends the demo dataset only when it carries `source: "verified"`; source-less candidates are rejected at runtime. The existing source-less official lab-name records are a narrow overlay exception: they may rename the matching Stitch lab while retaining its Stitch provenance and details, but cannot publish a new lab.

## Media policy

- The official AIC logo is served from `/media/official/aic-logo.jpg` through semantic ID `brand.aic.logo`.
- Missing official images, portraits, videos, partner logos and map media use stable static grid/linear slots with no placeholder wording.
- No stock image, generated portrait or fabricated partner logo is supplied as a missing asset substitute.
- `home.hero` can be an image or reduced-motion-aware background video through `DynamicHero`.
- Split-page hero slots remain images through `HeroMedia`; the introduction video uses controlled playback through `VideoFrame`.

## Browser QA

- Completed all seven routes at desktop 1440px and mobile 375px.
- Each route has one `h1` and the expected `h2` content order.
- Every route satisfies `scrollWidth === innerWidth` at both reviewed widths.
- No route reported network errors after Be Vietnam Pro was moved to local font assets.
- The Home contact preview includes the semantic map frame.
- Home and About keep a 48px bounding-box gap between introduction copy and the vision/mission cards, with no overlap.

The Lighthouse JSON and screenshots in `screenshots_v3/`, `screenshots_final/` and earlier screenshot folders remain historical evidence from previous implementation phases.

Historical Lighthouse 13.4.0 desktop scores were 89 Performance, 95 Accessibility, 100 Best Practices and 92 SEO.

## Remaining review boundaries

- Treat every `source: "stitch"` field as demo content until an owner provides a complete verified replacement.
- Verify media rights, crops, alt text and map URLs before adding manifest sources.
- Repeat browser screenshot QA after future material layout or content-composition changes; automated tests do not replace visual review.
