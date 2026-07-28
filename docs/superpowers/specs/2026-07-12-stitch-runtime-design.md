# AIC Stitch Runtime Design

## Goal

Rebuild the React/Vite website so every route follows the approved Stitch prototype while keeping the official AIC brand rules from `DESIGN.md`. Stitch demo records are allowed at runtime and must remain easy to replace with verified content and official media later.

## Source Priority

1. `DESIGN.md` controls brand, typography, color, navigation, radius, motion, responsive behavior, and accessibility.
2. `screenshots_aic/` controls page hierarchy, section order, grid shape, card variants, and demo copy.
3. Existing verified content remains authoritative for the AIC identity, parent unit, address, email, Foundry Lab, and Innovation Lab.
4. Legacy assets are used only for the official AIC logo.

The official label is `AIC`, not `AIC Center`. Navigation remains a rounded active pill even though the Stitch screenshots show an underline.

## Content Architecture

Create a dedicated Stitch dataset separate from verified records:

- `src/content/verified.ts`: verified AIC identity and contact records.
- `src/content/stitch.ts`: demo people, biographies, research directions, KPIs, labs, cooperation copy, partner slots, student benefits, and join steps transcribed from the screenshots.
- `src/content/site.ts`: composes verified records with the Stitch dataset for the current prototype runtime.
- `src/content/assets.ts`: semantic media manifest used by every page and card.

Every Stitch record carries `source: "stitch"`. Runtime components receive typed data through props and do not embed AIC business copy directly in JSX.

## Media Contract

Use semantic media IDs for:

- home hero;
- introduction video and poster;
- director and leader portraits;
- research direction images;
- lab images;
- cooperation hero;
- students hero;
- partner logos;
- contact map.

Media records may have no `src`. Missing images and videos render a neutral frame with the final aspect ratio and no visible placeholder wording. Partner slots retain `Logo 1` through `Logo 8` because those labels are explicit Stitch demo data. Replacing a real file changes only the media manifest.

## Route Design

### Home

Use the Stitch order: navy hero, About composition, vision and mission cards, separate introduction video, organization preview, contact preview, and navy footer. Desktop uses the layered media composition; mobile uses a single-column sequence with compact section headings. Demo directors render from the shared people dataset.

### About

Keep verified intro, parent unit, vision, and mission. Use the Home About composition as the visual reference because Stitch has no dedicated About screenshot.

### Organization

Use route-specific layouts: three director cards, scientific council list, teacher leader cards, and six compact student leader entries. Demo names, roles, biographies, emails, tags, and counts come from `stitch.ts`.

### Research

Render three direction cards, a four-metric band, and the seven-item research lab grid. The Computer Vision card is featured; Applied AI uses the wide accent card. All numbers and group names are explicitly marked as Stitch demo content.

### Cooperation

Use a split hero with a replaceable media slot, three cooperation cards, international cooperation banner, eight partner slots, and the closing CTA. The page keeps Stitch copy while removing decorative globe/building/flask icons that conflict with `DESIGN.md`.

### Students

Use a split hero with replaceable media, two lab cards with the Stitch descriptions and benefits, five-step join timeline, and the closing CTA. The lab names remain the verified AIC names.

### Contact

Render the verified office, laboratory, and email cards beside a rounded map frame. The map uses the manifest; without a verified embed or approved image, the neutral map composition retains the Stitch proportions and does not hotlink. Mobile stacks cards above the map.

## Responsive Behavior

- Desktop breakpoints preserve the section proportions and grids shown in Stitch.
- At 768px and below, split heroes and multi-column sections become one column.
- At 375px and 320px, headings wrap without clipping, controls remain at least 44px, and timelines become vertical.
- Media slots keep stable aspect ratios to avoid layout shifts.
- Reduced-motion mode disables hero drift, route transitions, and partner marquee movement.

## Accessibility

- Keep the official logo alt text and a single page-level H1.
- Preserve visible focus states and keyboard navigation for the header and mobile menu.
- Demo email links use `mailto:` only where the Stitch record explicitly includes an address.
- Duplicate marquee content is not focusable.
- Decorative media frames have empty alt text; meaningful replacement media requires a real alt value in the manifest.

## Testing And Review

- Add content contract tests proving Stitch records are centralized and source-labelled.
- Add route tests for section order and expected card counts.
- Add layout tests for Organization variants, seven Research labs, eight Partner slots, two Student labs, five timeline steps, and three Contact cards.
- Run lint, unit tests, and production build.
- Capture desktop and mobile screenshots for all routes and compare them with `screenshots_aic/`.
- Keep the local site available at `http://127.0.0.1:5173` for final review.

## Out Of Scope

- Backend, CMS, authentication, contact form submission, and map API integration.
- Cropping portraits or media out of Stitch screenshots.
- Treating Stitch people, statistics, partners, or research claims as verified AIC facts.
- Committing or pushing before the user reviews the implementation diff.
