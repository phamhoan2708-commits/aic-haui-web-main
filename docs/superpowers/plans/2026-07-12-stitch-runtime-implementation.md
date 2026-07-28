# AIC Stitch Runtime Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild every AIC route with the approved Stitch layouts and demo records while preserving official branding and one-step media replacement.

**Architecture:** Keep verified AIC records in `verified.ts`, add source-labelled Stitch demo records in `stitch.ts`, and compose both in `site.ts`. Page-specific components render the distinct Stitch layouts; all image, video, partner, and map slots resolve through a semantic media manifest.

**Tech Stack:** React, TypeScript, Vite, React Router, Tailwind CSS, Vitest, Testing Library, Lucide React.

**Commit policy:** Do not commit or push during implementation. The user will review the complete diff first.

---

## File Map

- Create `src/content/stitch.ts`: all Stitch demo records and page copy.
- Modify `src/content/types.ts`: source-labelled records, metrics, council entries, and semantic media references.
- Modify `src/content/assets.ts`: semantic media manifest and resolver.
- Modify `src/content/site.ts`: compose verified and Stitch content.
- Create `src/content/stitch.test.ts`: dataset counts, source labels, and replacement contracts.
- Modify `src/components/media/*`: resolve optional media without changing page JSX.
- Modify `src/pages/*`: page-specific Stitch hierarchy.
- Modify `src/components/cards/*`: route-specific card variants.
- Modify `src/styles/globals.css` and `src/styles/tokens.css`: prototype proportions and responsive behavior.
- Modify route/page tests: content counts, hierarchy, accessibility, and responsive-safe contracts.
- Modify `docs/CONTENT_INTEGRATION.md` and `docs/MEDIA_INTEGRATION.md`: replacement instructions.

### Task 1: Stitch Content Dataset

**Files:**

- Create: `src/content/stitch.ts`
- Create: `src/content/stitch.test.ts`
- Modify: `src/content/types.ts`
- Modify: `src/content/site.ts`

- [ ] **Step 1: Write failing dataset contract tests**

```tsx
import { describe, expect, it } from "vitest";
import { stitchContent } from "./stitch";

describe("Stitch prototype content", () => {
  it("keeps the approved demo record counts", () => {
    expect(stitchContent.people.filter((p) => p.group === "director")).toHaveLength(3);
    expect(stitchContent.people.filter((p) => p.group === "student-leader")).toHaveLength(6);
    expect(stitchContent.research.directions).toHaveLength(3);
    expect(stitchContent.research.metrics).toHaveLength(4);
    expect(stitchContent.research.groups).toHaveLength(7);
    expect(stitchContent.cooperation.partners).toHaveLength(8);
    expect(stitchContent.students.joinSteps).toHaveLength(5);
  });

  it("marks every demo record as Stitch content", () => {
    const records = [
      ...stitchContent.people,
      ...stitchContent.research.directions,
      ...stitchContent.research.groups,
      ...stitchContent.cooperation.partners,
      ...stitchContent.students.joinSteps,
    ];
    expect(records.every((record) => record.source === "stitch")).toBe(true);
  });
});
```

- [ ] **Step 2: Run the tests and verify red state**

Run: `npm.cmd test -- src/content/stitch.test.ts`

Expected: FAIL because `src/content/stitch.ts` and the extended types do not exist.

- [ ] **Step 3: Extend the content types**

Add a reusable source marker and the missing Stitch structures:

```ts
export type ContentSource = "verified" | "stitch";
export type SourcedRecord = { source: ContentSource };
export type Metric = SourcedRecord & { id: string; value: string; label: string };
export type CouncilMember = SourcedRecord & {
  id: string;
  name: string;
  role: string;
  affiliation: string;
};
```

Extend `Person`, `ResearchItem`, `Lab`, `CooperationItem`, `Partner`, and `JoinStep` with `source`, `mediaRef`, and only the fields shown in Stitch.

- [ ] **Step 4: Transcribe the complete demo dataset**

`stitch.ts` must contain exactly:

- Directors: TS. Trần Thị An, PGS.TS. Nguyễn Hợp, TS. Lê Cường.
- Council: GS.TS. Phạm Văn A, PGS.TS. Lê Thị B, TS. Hoàng Văn C.
- Teacher leaders: Cô Hồng Lan, Thầy Hà, Thầy Mạnh Hùng.
- Student leaders: Đông Hưng, Nhã, Niên, Long Nhật, Bảo, Quân.
- Research directions: Thị giác Máy tính, Xử lý Ngôn ngữ Tự nhiên, Robotics & Tự động hóa.
- Metrics: `50+`, `15`, `12`, `07` with the Stitch labels.
- Research groups: Computer Vision, NLP, Robotics, Data Science, Applied AI, IoT & AI, AI Ethics.
- Cooperation types and international banner copy from `cooperation_aic.png`.
- Partner records named `Logo 1` through `Logo 8`.
- Foundry and Innovation descriptions/benefits from `students_aic.png`.
- Join steps: Khám Phá, Ứng Tuyển, Phỏng Vấn, Gia Nhập, Dự Án.

- [ ] **Step 5: Compose verified and Stitch records**

`site.ts` keeps verified identity, about, contact, and official lab names, then overlays the Stitch page copy and demo collections. It must not mutate either source object.

- [ ] **Step 6: Run focused tests**

Run: `npm.cmd test -- src/content/stitch.test.ts src/content/verified.test.ts`

Expected: PASS.

### Task 2: Replaceable Media Manifest

**Files:**

- Modify: `src/content/assets.ts`
- Modify: `src/content/types.ts`
- Modify: `src/components/media/HeroMedia.tsx`
- Modify: `src/components/media/ImageFrame.tsx`
- Modify: `src/components/media/VideoFrame.tsx`
- Modify: `src/components/media/MapFrame.tsx`
- Modify: `src/components/media/media-behavior.test.tsx`

- [ ] **Step 1: Write failing media replacement tests**

```tsx
it("renders a stable neutral slot when a semantic asset has no source", () => {
  render(<HeroMedia mediaRef="students.hero" />);
  expect(screen.getByTestId("media-slot-students.hero")).toHaveClass("aspect-[4/3]");
});

it("renders the configured image without changing the consumer API", () => {
  render(
    <HeroMedia
      mediaRef="home.hero"
      manifest={{
        "home.hero": {
          id: "home.hero",
          kind: "image",
          src: "/media/official/home.webp",
          alt: "AIC",
        },
      }}
    />,
  );
  expect(screen.getByRole("img", { name: "AIC" })).toHaveAttribute(
    "src",
    "/media/official/home.webp",
  );
});
```

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npm.cmd test -- src/components/media/media-behavior.test.tsx`

Expected: FAIL because media components do not accept semantic references.

- [ ] **Step 3: Add the manifest**

Define records for `brand.aic.logo`, `home.hero`, `about.intro-video`, every person portrait, three direction images, seven research images, both student labs, `cooperation.hero`, `students.hero`, eight partner logos, and `contact.map`. Only the official logo has a production `src`; all other records keep stable dimensions and aspect ratios without a fake image URL.

- [ ] **Step 4: Update media components**

Accept `mediaRef` and resolve it through the manifest. Missing sources render `.prototype-media-slot` with `data-testid="media-slot-${mediaRef}"`, no visible placeholder label, and the final aspect ratio. Video records accept a later `poster` and `src`; map records accept a later `embedUrl` or approved image.

- [ ] **Step 5: Run focused tests**

Run: `npm.cmd test -- src/components/media/media-behavior.test.tsx src/components/media/MapFrame.test.tsx`

Expected: PASS.

### Task 3: Shell, Home, And About

**Files:**

- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/sections/DynamicHero.tsx`
- Create: `src/components/sections/HomeAbout.tsx`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/AboutPage.tsx`
- Modify: `src/app/router.test.tsx`

- [ ] **Step 1: Write failing Home hierarchy tests**

Assert the Home page renders one H1, Stitch CTA labels, About, separate video, three directors, and contact, in document order. Assert the official accessible brand name remains `AIC` and no runtime text says `AIC Center`.

- [ ] **Step 2: Run the router test and verify failure**

Run: `npm.cmd test -- src/app/router.test.tsx`

Expected: FAIL because the current production Home hides demo sections.

- [ ] **Step 3: Rebuild the Home composition**

Implement the Stitch hierarchy with a navy full-width hero, layered About/media region, two vision/mission cards, independent 16:9 video frame, three director preview cards, and contact preview. Use manifest references for all media. Keep the official pill navigation and logo.

- [ ] **Step 4: Align About with the shared composition**

Render verified intro, parent unit, vision, and mission through the same section primitives; do not duplicate the copy in JSX.

- [ ] **Step 5: Run focused tests**

Run: `npm.cmd test -- src/app/router.test.tsx src/components/layout/Header.test.tsx`

Expected: PASS.

### Task 4: Organization Layout Variants

**Files:**

- Modify: `src/components/cards/PersonCard.tsx`
- Create: `src/components/cards/CouncilPanel.tsx`
- Modify: `src/components/sections/OrganizationGroup.tsx`
- Modify: `src/pages/OrganizationPage.tsx`
- Modify: `src/pages/page-layouts.test.tsx`

- [ ] **Step 1: Write failing Organization tests**

Assert three director cards, three council rows, three teacher leader cards, and six student leader entries. Assert the director emails use `mailto:` and every image slot resolves by semantic ID.

- [ ] **Step 2: Run and verify failure**

Run: `npm.cmd test -- src/pages/page-layouts.test.tsx -t Organization`

Expected: FAIL because the current page uses one generic grid and empty data.

- [ ] **Step 3: Implement route-specific variants**

Create `director`, `teacher`, and `student` PersonCard variants plus a separate CouncilPanel. Reproduce the 3-card director row, council/teacher split band, and six-item compact leader strip shown in `organization_aic.png`.

- [ ] **Step 4: Run focused tests**

Run: `npm.cmd test -- src/pages/page-layouts.test.tsx src/components/cards/cards-behavior.test.tsx`

Expected: PASS.

### Task 5: Research Page

**Files:**

- Modify: `src/components/cards/ResearchCards.tsx`
- Create: `src/components/sections/ResearchMetrics.tsx`
- Modify: `src/pages/ResearchPage.tsx`
- Modify: `src/pages/page-layouts.test.tsx`

- [ ] **Step 1: Write failing Research tests**

Assert three direction cards, four metrics, seven group cards, one featured Computer Vision card, and one wide Applied AI card. Assert every visible number comes from `stitch.ts`.

- [ ] **Step 2: Run and verify failure**

Run: `npm.cmd test -- src/pages/page-layouts.test.tsx -t Research`

Expected: FAIL because production data is empty and the metric band is missing.

- [ ] **Step 3: Implement the Stitch layout**

Render the centered page hero, image-backed direction cards, full-width metric band, and asymmetric lab grid. Keep card copy and member counts in content data; page JSX only chooses variants and order.

- [ ] **Step 4: Run focused tests**

Run: `npm.cmd test -- src/pages/page-layouts.test.tsx src/components/cards/cards-behavior.test.tsx`

Expected: PASS.

### Task 6: Cooperation Page

**Files:**

- Modify: `src/components/cards/CooperationCards.tsx`
- Modify: `src/components/media/PartnerLogo.tsx`
- Modify: `src/pages/CooperationPage.tsx`
- Modify: `src/pages/page-layouts.test.tsx`

- [ ] **Step 1: Write failing Cooperation tests**

Assert the split hero, three cooperation type cards, international banner, eight partner slots, and closing CTA. Assert duplicate marquee anchors are not keyboard-focusable.

- [ ] **Step 2: Run and verify failure**

Run: `npm.cmd test -- src/pages/page-layouts.test.tsx -t Cooperation`

Expected: FAIL because production collections are empty.

- [ ] **Step 3: Implement the page hierarchy**

Restore the Stitch copy and section order. Use the replaceable hero slot, static 4x2 logo grid for eight source-less partner records, and only enable marquee when five or more records have real logo sources.

- [ ] **Step 4: Fix marquee accessibility**

The duplicated track must render non-linking logo frames or apply `tabIndex={-1}` to duplicate anchors while keeping `aria-hidden="true"`.

- [ ] **Step 5: Run focused tests**

Run: `npm.cmd test -- src/pages/page-layouts.test.tsx src/components/cards/cards-behavior.test.tsx`

Expected: PASS.

### Task 7: Students And Contact

**Files:**

- Modify: `src/components/cards/StudentCards.tsx`
- Modify: `src/components/cards/ContactCards.tsx`
- Modify: `src/pages/StudentsPage.tsx`
- Modify: `src/pages/ContactPage.tsx`
- Modify: `src/pages/page-layouts.test.tsx`
- Modify: `src/pages/ContactPage.test.tsx`

- [ ] **Step 1: Write failing Students tests**

Assert the split hero, two official lab names, both Stitch descriptions, four benefits total, five join steps, and closing CTA. Assert the media slot is present without visible placeholder text.

- [ ] **Step 2: Write failing Contact tests**

Assert three verified cards, `mailto:aic-sict@haui.edu.vn`, full address, rounded map slot, and one-column mobile stacking. Assert there is no phone number.

- [ ] **Step 3: Run and verify failures**

Run: `npm.cmd test -- src/pages/page-layouts.test.tsx src/pages/ContactPage.test.tsx`

Expected: FAIL because Student demo details and the production map frame are absent.

- [ ] **Step 4: Implement Students**

Render the Stitch split hero, cream/blue lab cards, five-step desktop timeline that becomes vertical on mobile, and navy CTA band. All copy comes from the composed content object.

- [ ] **Step 5: Implement Contact**

Use the verified contact data beside the manifest-driven map frame. Keep the approved full address and `mailto:` link. The source-less map remains a neutral visual frame with the final rounded dimensions and no fake map controls.

- [ ] **Step 6: Run focused tests**

Run: `npm.cmd test -- src/pages/page-layouts.test.tsx src/pages/ContactPage.test.tsx`

Expected: PASS.

### Task 8: Responsive Styling, Documentation, And QA

**Files:**

- Modify: `src/styles/globals.css`
- Modify: `src/styles/tokens.css`
- Modify: `tailwind.config.ts`
- Modify: `docs/CONTENT_INTEGRATION.md`
- Modify: `docs/MEDIA_INTEGRATION.md`
- Create: `screenshots_stitch_runtime/*`

- [ ] **Step 1: Add responsive and motion contracts**

Add CSS/Tailwind rules for stable hero/media ratios, alternating white/ice bands, 20-32px media radii, vertical mobile timelines, compact 320px card padding, visible focus states, and reduced-motion fallbacks. Remove the existing decorative radial orb backgrounds from runtime hero visuals.

- [ ] **Step 2: Update integration guides**

Document how to replace each semantic media ID, how to replace a Stitch record with verified content, and how to identify demo records by `source: "stitch"`.

- [ ] **Step 3: Run the complete automated verification**

Run:

```powershell
npm.cmd run lint
npm.cmd test
npm.cmd run build
docker build -t aic-haui-web:local .
```

Expected: all commands exit 0.

- [ ] **Step 4: Run route and responsive QA**

Capture `/`, `/ve-chung-toi`, `/to-chuc`, `/nghien-cuu`, `/hop-tac`, `/sinh-vien`, and `/lien-he` at 1440x1100, 768x1024, 375x812, and 320x812. Verify no overlap, horizontal overflow, blank sections, broken media, or dead CTA.

- [ ] **Step 5: Open local review**

Start/restart the local Docker site at `http://127.0.0.1:5173`, open it in the browser, and report the exact diff and verification results without committing or pushing.
