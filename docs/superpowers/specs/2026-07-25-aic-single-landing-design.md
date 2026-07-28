# AIC Single Landing Page Design

## Status

Approved in conversation on 2026-07-25.

This specification replaces the multi-route layout direction in
`2026-07-12-stitch-runtime-design.md`. The older document remains useful for
content provenance, semantic media, responsive behavior, accessibility, and
testing principles, but it is no longer authoritative for route structure or
typography.

## Goal

Convert the current React/Vite website into one bilingual landing page. Every
top-navigation item scrolls to a section on `/`. Existing route URLs redirect
to the corresponding landing-page anchors.

The implementation must reuse the current section and card components wherever
practical. It must not introduce new institutional facts, people, statistics,
partners, or research claims beyond the content explicitly retained by this
specification.

## Authoritative Sources

1. This approved specification controls the single-page structure and the
   explicitly accepted temporary content.
2. The current SICT website controls the typography and institutional header
   reference:
   - <https://sict.haui.edu.vn/vn/>
   - <https://sict.haui.edu.vn/vn/content/css?v=eCKIE5wv_G9s_8KUR84KIZOSO2PN7qZf8vNT3BL-JsU1>
3. The official AIC profile controls verified identity, staff, roles, email,
   office, laboratory, and organizational information:
   - <https://sict.haui.edu.vn/vn/html/trung-tam-nghien-cuu-va-ung-dung-tri-tue-nhan-tao>
4. `C:\Users\nguye\Downloads\MARKET WEBSITE aic.docx` remains the project brief
   for the required content groups, lightweight motion, real imagery, media
   optimization, and Docker deployment.
5. Existing Vietnamese and English content remains authoritative where this
   specification says to preserve the current implementation.

## Approved Implementation Approach

Reuse the existing page and section components and compose them into
`HomePage`. Do not replace the website with one monolithic component and do not
introduce a configuration-driven page framework for this scope.

Route-specific components are adapted to render as embeddable sections.
Nested page heroes and duplicate page-level headings must be removed when those
components appear inside the landing page.

## Landing Page Structure

The section order is:

1. Hero
2. News
3. About
4. Organization
5. Research
6. Cooperation
7. Students
8. Contact

Stable section IDs are:

- `tin-tuc`
- `ve-chung-toi`
- `to-chuc`
- `nghien-cuu`
- `hop-tac`
- `sinh-vien`
- `lien-he`

Hero is the top of the document and does not need a separate navigation item.

## Navigation And Route Compatibility

The fixed top navigation contains all seven content-section items:

- Tin tức
- Về chúng tôi
- Tổ chức
- Nghiên cứu
- Hợp tác
- Dành cho sinh viên
- Liên hệ

Clicking an item scrolls smoothly to the section with a header-aware offset.
The item representing the visible section becomes active. Use an
`IntersectionObserver`-based mechanism rather than scroll-event layout polling.
Update the URL hash without generating excessive browser-history entries.

Desktop displays all seven items. Mobile keeps the existing hamburger and
sliding menu behavior. Choosing an item closes the menu before scrolling, and
keyboard focus remains predictable.

Legacy URLs redirect with history replacement:

| Legacy URL      | Landing destination |
| --------------- | ------------------- |
| `/ve-chung-toi` | `/#ve-chung-toi`    |
| `/to-chuc`      | `/#to-chuc`         |
| `/nghien-cuu`   | `/#nghien-cuu`      |
| `/hop-tac`      | `/#hop-tac`         |
| `/sinh-vien`    | `/#sinh-vien`       |
| `/lien-he`      | `/#lien-he`         |

Footer navigation keeps its current visual design and uses the same section
anchors.

## Typography And Visual System

Create a root `DESIGN.md` as the implementation contract.

Use self-hosted `Be Vietnam Pro` across body copy, headings, navigation, cards,
and buttons. Remove Merriweather and remove Google Fonts imports/preconnects.
The project already contains local Be Vietnam Pro assets. Do not add a runtime
font-network dependency.

The SICT-derived type tokens are:

- Desktop body copy: `14px` with `26px` line height.
- Desktop card headings: `18px` with `27px` line height.
- Desktop section headings: `23px` with `34px` line height, weight `700`.
- Desktop major page heading: `35px` with `52px` line height, weight `700`.
- Desktop hero heading: `56px` with `64px` line height, weight `700`.
- Mobile body copy: `14px` with `24px` line height.
- Mobile card headings: `17px` with `25px` line height.
- Mobile section headings: `22px` with `31px` line height, weight `700`.
- Mobile major page heading: `30px` with `42px` line height, weight `700`.
- Mobile hero heading: `36px` with `44px` line height, weight `700`.

Responsive tokens must reduce headings without clipping at 320px and 375px.
Components must consume shared typography tokens instead of choosing
independent arbitrary sizes.

Keep the AIC navy, blue, and gold palette, current rounded surfaces, current
video hero, and modern whitespace. Heading capitalization must be consistent
within each hierarchy level. Do not mix all-caps, title case, and sentence case
for equivalent headings.

### Vietnamese Heading Capitalization

Use sentence case for Vietnamese headings at every rendered hierarchy level.
Capitalize the first word plus proper names and abbreviations such as `AI` and
`AIC`. Keep the official center name and English headings unchanged. English
lab names such as `Computer Vision Lab` also keep their existing spelling.

Apply the policy directly to the centralized Vietnamese content strings rather
than using CSS `text-transform` or a runtime formatter. This preserves
Vietnamese diacritics and prevents accidental changes to proper names.

The affected heading copy includes:

- `Tin tức & sự kiện`
- `Ban giám đốc`, `Hội đồng khoa học`, and the two research-group leader
  headings
- `Định hướng nghiên cứu` and `Các nhóm nghiên cứu (Labs)`
- `Mở rộng giới hạn cùng AI`, `Lĩnh vực hợp tác`, `Đối tác chiến lược`, and
  `Cùng kiến tạo tương lai`
- `Không gian nghiên cứu` and `Lộ trình tham gia`
- Vietnamese research-direction, cooperation, and participation-step card
  headings that currently use title case

Eyebrow labels may remain visually uppercase when their component styling uses
uppercase as a distinct hierarchy convention. Do not change news-record titles,
body copy, people, URLs, institutional facts, or English content as part of
this typography correction.

### Header

Desktop uses two fixed tiers:

1. A `72px` navy brand tier with the AIC logo and short name aligned left and
   the VN/EN control aligned right. Do not render the center's full name in
   this header tier.
2. A `48px` white navigation tier with seven section items and a blue AIC active
   state.

Mobile condenses this into one fixed `64px` bar with the existing hamburger
behavior. Removing the desktop center name must not change the mobile brand,
language control, menu trigger, header heights, or the navigation tier.

## Language

Keep the current Vietnamese and English datasets. The VN/EN control remains
functional. Navigation labels, section headings, CTA labels, and retained
content change language together.

## Section Designs

### Hero

Keep the current background video, title, rotating research phrases,
description, and two CTA buttons. The primary CTA scrolls to Research. The
secondary CTA scrolls to Students.

Reduced-motion mode stops automatic motion according to the existing
accessibility behavior.

### News

Keep the current three news cards, including their current temporary titles,
dates, categories, and links. The owner will replace these records and URLs
later. Do not add additional news claims.

### About

Keep the current introduction, vision, and mission text.

Remove the large neutral media panel that currently occupies the right side of
the About composition. Replace the composition with:

- Introduction in the left column.
- Vision and Mission stacked vertically in the right column.

Keep the separate Introduction Video section below this composition unchanged.
Removing the side panel must not remove or modify `VideoFrame`.

### Organization

Keep every currently rendered organization group:

- Board of Directors
- Lecturer lab leaders
- Scientific Council
- Student research leaders

Keep the current staff information and images, including the verified Hoài An,
Mạnh Cường, and other staff records already present.

On pointer hover, staff images scale to exactly `1.2`. The image wrapper clips
the zoom so it does not overlap surrounding copy or cards. Do not make
meaningful information available only on hover.

### Research

Keep the current Research content in full:

- Three research directions
- Four research metrics
- Seven research groups
- Current leaders, member counts, and descriptions

This is an explicit exception to the earlier decision to remove unverified
prototype statistics and names. The owner approved retaining the complete
current Research section as displayed.

### Cooperation

Keep the current cooperation types, international-cooperation content, CTA,
and partner presentation. Keep all eight temporary partner records named
`Logo 1` through `Logo 8`.

Cooperation CTA opens `mailto:aic-sict@haui.edu.vn`.

### Students

Keep both current labs, their positioning copy, benefits, media or media
frames, and the five-step participation process.

Student CTA opens `mailto:aic-sict@haui.edu.vn`.

### Contact

Keep the current Contact section unchanged:

- Office card
- Laboratory card
- Email card
- Current embedded map

Do not add a contact form.

### Footer

Keep the current Footer visual design and content. Replace route links with
landing-page anchors.

## Media Policy

Official images remain authoritative where present. Missing media uses the
existing neutral media-frame treatment at its final aspect ratio. Do not
generate new portraits, partner logos, facilities, or research-result imagery.

Temporary imagery must not represent itself as an official person, partner,
result, or facility. Do not create additional factual copy to explain a missing
image. Video and image files must remain optimized for web delivery (`webm` and
`webp` where applicable).

## Motion

Keep the current lightweight reveal-on-scroll behavior. Do not add complex 3D
effects, news sliders, or additional partner marquees beyond current behavior.

Keep:

- Hero video and rotating phrases.
- Lightweight section reveals.
- Staff image hover zoom at `1.2`.

Honor `prefers-reduced-motion`. Reduced-motion mode disables nonessential
animation without hiding content.

## Component And Data Boundaries

- `HomePage` owns section order.
- Section components own their local presentation.
- Navigation components consume a shared landing-section registry so desktop,
  mobile, Footer, redirects, and active-section logic cannot drift.
- Vietnamese and English content remain in centralized content modules.
- Business copy must not be embedded newly inside JSX.
- The media manifest remains the single source for replaceable media.

## Error And Empty States

- A missing nonessential image renders a stable frame or approved mock and does
  not collapse surrounding layout.
- A failed image or video load does not produce broken-image UI or layout shift.
- Hash navigation to an unknown section falls back to the top of the landing
  page without throwing.
- Redirects use valid section IDs only.
- The Contact map retains its current behavior.

## Accessibility

- The landing page contains exactly one `h1`.
- Section headings follow a valid hierarchy.
- Fixed headers do not cover focused anchors or section headings.
- Header, hamburger, language control, links, and CTA buttons remain keyboard
  accessible.
- Mobile menu focus is moved and restored predictably.
- Active navigation state is not communicated by color alone.
- Pointer hover zoom is decorative and does not hide text.
- Reduced-motion preferences are respected.

## Quality Gates

The current branch is not release-ready at the time of this specification:

- Production build passes.
- ESLint has 7 errors.
- Vitest has 29 failing and 101 passing tests.

Implementation is complete only when all of the following pass on the final
source state:

1. `npm test`
2. `npm run lint`
3. `npm run build`
4. `npm run format`

Required behavioral coverage:

- Seven desktop and mobile navigation items scroll to the right sections.
- Active navigation follows the visible section.
- Every legacy URL redirects to its approved hash.
- VN/EN switches all landing content consistently.
- Mobile menu closes and manages focus correctly.
- About side media is absent while the lower introduction video remains.
- Staff image hover applies a clipped `1.2` scale.
- Reduced-motion mode disables nonessential animation.
- The page has no horizontal overflow at 320px, 375px, tablet, and desktop
  widths.
- Direct refresh on `/` and every legacy URL works through the SPA fallback.

Perform browser screenshot review on the complete landing page in both
languages at mobile and desktop widths after automated checks pass.

## Deployment

Keep the existing Docker and Nginx deployment path. Nginx retains SPA fallback
for legacy URL redirects and direct refresh. Do not deploy or publish as part
of implementation unless the owner explicitly requests it.

## Out Of Scope

- Backend, CMS, authentication, or form submission.
- Automatic scraping or synchronization of SICT news.
- New institutional claims beyond the explicitly retained current content.
- Replacing temporary news, partner, research, or media records with new facts
  that the owner has not supplied.
- A production deployment.
