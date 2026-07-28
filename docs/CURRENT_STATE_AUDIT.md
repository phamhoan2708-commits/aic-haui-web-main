# Current State Audit

## Baseline

- Repository: `E:\aic-haui-web`
- Baseline branch: `main`
- Baseline commit: `b8530b0` (`docs: add content and media handoff guides`)
- Implementation branch: `rebuild/aic-v1`
- Baseline screenshots: `screenshots_before/`

## Visual references

- Primary desktop reference: `screenshots_aic/home_aic_desktop.png`
- Primary mobile reference: `screenshots_aic/home_aic_mobile.png`
- Page-structure references: organization, research, cooperation, students and contact images in `screenshots_aic/`
- `DESIGN.md` overrides screenshots for pill navigation, typography, radius, motion and the prohibition on fake data/assets.

## Official and legacy assets

- Official AIC logo: `legacy/logoaic.jpg`
- Legacy application: `legacy/app.py`, `legacy/main.js`, `legacy/style.css`
- Legacy pages: `legacy/news.html`, `legacy/student-lab.html`
- Legacy deployment/config: `legacy/vercel.json`, `legacy/requirements.txt`, `legacy/HUONG_DAN_DEPLOY_VERCEL.md`
- No verified hero photo/video, introduction video, portrait, research image, partner logo or map URL is available.

## Historical verified-only baseline

This section records the verified-only baseline at commit `b8530b0`. It is not a description of the current runtime composition.

- AIC official short and full names
- Parent unit: School of Information and Communications Technology, Hanoi University of Industry
- Introduction, vision and mission from `DESIGN.md`
- Office room 1201, laboratory room 1504 and campus address
- Email: `aic-sict@haui.edu.vn`
- Lab names: `AIC Foundry Lab`, `AIC Innovation Lab`

## Baseline defects

- Official logo was not rendered and the brand label was `AIC Center`.
- Typography used Aptos/Trebuchet instead of Be Vietnam Pro.
- Hidden production sections kept headings and vertical spacing.
- Empty map/media frames created large blank blocks and decorative icons.
- Header did not overlay the home hero or change state on scroll.
- Mobile menu closed with Escape but did not move or restore focus.
- Content export used an entirely empty runtime object.
- Research text was clamped; media cards rendered empty placeholders.
- Cooperation had no 5+ partner marquee/reduced-motion behavior.

## Route audit

The required routes exist: `/`, `/ve-chung-toi`, `/to-chuc`, `/nghien-cuu`, `/hop-tac`, `/sinh-vien`, `/lien-he`. Nginx uses SPA fallback for direct refreshes.

## Planned correction surface

- Content and schemas under `src/content/`
- Shell/navigation under `src/components/layout/` and `src/components/navigation/`
- Design-system/media/card primitives under `src/components/`
- Route pages under `src/pages/`
- Tokens and global behavior under `src/styles/`
- Integration documentation under `docs/`

The historical baseline introduced no unverified runtime records and deleted no legacy files.

## Current approved runtime

The current runtime intentionally composes verified AIC records with approved, source-labelled Stitch prototype records. Verified content remains authoritative for institutional identity, contact details and official lab names. People, biographies, council members, research claims, cooperation records, partners and student-lab detail sourced from Stitch render with `source: "stitch"` and must remain identifiable as prototype content until verified replacements are supplied.

Runtime selectors accept verified collection replacements and reject source-less generic additions. The documented official lab-name overlay is the narrow exception: it can rename a matching Stitch lab without changing the provenance of its remaining prototype detail.
