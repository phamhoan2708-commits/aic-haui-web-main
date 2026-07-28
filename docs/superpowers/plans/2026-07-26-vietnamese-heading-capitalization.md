# Vietnamese Heading Capitalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Normalize rendered Vietnamese headings to the approved sentence-case policy without changing English content, official names, news records, or body copy.

**Architecture:** Keep all copy in the existing centralized content modules. Add a focused content-contract test, update existing rendering expectations before production strings, then make the smallest possible string-only changes in `labels.ts` and `stitch.ts`.

**Tech Stack:** TypeScript, React, Vitest, Testing Library, Vite, ESLint, Prettier

---

## File Map

- Create `src/content/heading-capitalization.test.ts`: exact bilingual capitalization contract.
- Modify `src/pages/page-layouts.test.tsx`: rendered Vietnamese heading expectations.
- Modify `src/content/stitch.test.ts`: participation-step heading expectations.
- Modify `src/content/labels.ts`: centralized Vietnamese section and group labels.
- Modify `src/content/stitch.ts`: centralized Vietnamese page, card, and step headings.

### Task 1: Lock the approved capitalization contract

**Files:**

- Create: `src/content/heading-capitalization.test.ts`
- Modify: `src/pages/page-layouts.test.tsx`
- Modify: `src/content/stitch.test.ts`

- [ ] **Step 1: Write the failing content-contract test**

Create `src/content/heading-capitalization.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { labelsEn, labelsVi } from "./labels";
import { stitchContent } from "./stitch";
import { stitchContentEn } from "./stitchEn";

describe("heading capitalization contract", () => {
  it("uses sentence case for Vietnamese headings", () => {
    expect([
      labelsVi.homeNewsLabels.title,
      labelsVi.organizationSectionLabels.directors,
      labelsVi.organizationSectionLabels.council,
      labelsVi.organizationSectionLabels.teacherLeaders,
      labelsVi.organizationSectionLabels.studentLeaders,
      labelsVi.researchSectionLabels.directions,
      labelsVi.researchSectionLabels.groups,
      labelsVi.cooperationSectionLabels.fields,
      labelsVi.cooperationSectionLabels.partners,
      labelsVi.cooperationSectionLabels.closingTitle,
      labelsVi.studentSectionLabels.researchSpace,
      labelsVi.studentSectionLabels.timeline,
    ]).toEqual([
      "Tin tức & sự kiện",
      "Ban giám đốc",
      "Hội đồng khoa học",
      "Trưởng nhóm nghiên cứu (giảng viên)",
      "Trưởng nhóm nghiên cứu (sinh viên)",
      "Định hướng nghiên cứu",
      "Các nhóm nghiên cứu (Labs)",
      "Lĩnh vực hợp tác",
      "Đối tác chiến lược",
      "Cùng kiến tạo tương lai",
      "Không gian nghiên cứu",
      "Lộ trình tham gia",
    ]);

    expect(stitchContent.pages.cooperation.title).toBe("Mở rộng giới hạn cùng AI");
    expect(stitchContent.research.directions.map(({ title }) => title)).toEqual([
      "Thị giác máy tính",
      "Xử lý ngôn ngữ tự nhiên",
      "Robotics & tự động hóa",
    ]);
    expect(stitchContent.cooperation.international[0]?.title).toBe("Hợp tác quốc tế");
    expect(stitchContent.students.joinSteps.map(({ title }) => title)).toEqual([
      "Khám phá",
      "Ứng tuyển",
      "Phỏng vấn",
      "Gia nhập",
      "Dự án",
    ]);
  });

  it("preserves the official center name and English headings", () => {
    expect(stitchContent.hero.title).toBe("Trung tâm Nghiên cứu và Ứng dụng Trí tuệ Nhân tạo");
    expect(labelsEn.homeNewsLabels.title).toBe("News & Events");
    expect(labelsEn.cooperationSectionLabels.closingTitle).toBe("Co-creating the Future");
    expect(stitchContentEn.pages.cooperation.title).toBe("Expanding Boundaries with AI");
  });
});
```

- [ ] **Step 2: Update existing test expectations to the approved copy**

In `src/pages/page-layouts.test.tsx`, replace only old Vietnamese title-case literals with:

```ts
const approvedStudentLabels = {
  researchSpace: "Không gian nghiên cứu",
  heroCta: "Tham gia với chúng tôi",
  closingTitle: "Sẵn sàng kiến tạo tương lai AI?",
  closingButton: "Tham gia với chúng tôi",
} as const;
```

Use these exact rendered organization and cooperation expectations:

```ts
"Ban giám đốc";
"Hội đồng khoa học";
"Trưởng nhóm nghiên cứu (giảng viên)";
"Trưởng nhóm nghiên cứu (sinh viên)";
"Mở rộng giới hạn cùng AI";
```

In `src/content/stitch.test.ts`, use the approved participation-step list:

```ts
["Khám phá", "Ứng tuyển", "Phỏng vấn", "Gia nhập", "Dự án"];
```

- [ ] **Step 3: Run the focused tests and verify RED**

Run:

```powershell
npm.cmd test -- src/content/heading-capitalization.test.ts src/content/stitch.test.ts src/pages/page-layouts.test.tsx
```

Expected: FAIL because `labels.ts` and `stitch.ts` still expose the old Vietnamese title-case strings. The failure must show an expected sentence-case value and an actual title-case value.

### Task 2: Apply sentence case at the content sources

**Files:**

- Modify: `src/content/labels.ts`
- Modify: `src/content/stitch.ts`

- [ ] **Step 1: Update centralized section and group labels**

In the Vietnamese object in `src/content/labels.ts`, use these values:

```ts
homeNewsLabels: {
  title: "Tin tức & sự kiện",
  // Existing description, actions, and news records remain unchanged.
},
organizationSectionLabels: {
  directors: "Ban giám đốc",
  council: "Hội đồng khoa học",
  teacherLeaders: "Trưởng nhóm nghiên cứu (giảng viên)",
  studentLeaders: "Trưởng nhóm nghiên cứu (sinh viên)",
},
researchSectionLabels: {
  directions: "Định hướng nghiên cứu",
  groups: "Các nhóm nghiên cứu (Labs)",
  cooperationCta: "Đề xuất hợp tác nghiên cứu",
  membersSuffix: "thành viên",
},
cooperationSectionLabels: {
  fields: "Lĩnh vực hợp tác",
  partners: "Đối tác chiến lược",
  heroCta: "Khám phá cơ hội",
  learnMore: "Tìm hiểu",
  closingTitle: "Cùng kiến tạo tương lai",
  // Existing description and button remain unchanged.
},
studentSectionLabels: {
  researchSpace: "Không gian nghiên cứu",
  // Existing descriptions and actions remain unchanged.
  timeline: "Lộ trình tham gia",
},
```

- [ ] **Step 2: Update centralized page, card, and step headings**

In `src/content/stitch.ts`, apply only these string replacements:

```ts
pages: {
  cooperation: {
    title: "Mở rộng giới hạn cùng AI",
  },
},
research: {
  directions: [
    { id: "computer-vision", title: "Thị giác máy tính" },
    { id: "natural-language-processing", title: "Xử lý ngôn ngữ tự nhiên" },
    { id: "robotics-automation", title: "Robotics & tự động hóa" },
  ],
},
cooperation: {
  international: [{ id: "international", title: "Hợp tác quốc tế" }],
},
students: {
  joinSteps: [
    { id: "discover", title: "Khám phá" },
    { id: "apply", title: "Ứng tuyển" },
    { id: "interview", title: "Phỏng vấn" },
    { id: "onboard", title: "Gia nhập" },
    { id: "project", title: "Dự án" },
  ],
},
```

Keep every neighboring description, media reference, source marker, English dataset, official name, and news record byte-for-byte unchanged.

- [ ] **Step 3: Run the focused tests and verify GREEN**

Run:

```powershell
npm.cmd test -- src/content/heading-capitalization.test.ts src/content/stitch.test.ts src/pages/page-layouts.test.tsx
```

Expected: all selected test files PASS with no warnings or runtime errors.

### Task 3: Verify and commit the finished correction

**Files:**

- Verify all files changed in Tasks 1 and 2.

- [ ] **Step 1: Scan for the superseded title-case strings**

Run:

```powershell
rg -n "Tin tức & Sự kiện|Ban Giám Đốc|Hội Đồng Khoa Học|Trưởng Nhóm Nghiên Cứu|Định hướng Nghiên cứu|Các Nhóm Nghiên cứu|Mở Rộng Giới Hạn Cùng AI|Lĩnh Vực Hợp Tác|Đối Tác Chiến Lược|Cùng Kiến Tạo Tương Lai|Không Gian Nghiên Cứu|Lộ Trình Tham Gia|Thị giác Máy tính|Xử lý Ngôn ngữ Tự nhiên|Robotics & Tự động hóa|Hợp tác Quốc tế|Khám Phá|Ứng Tuyển|Phỏng Vấn|Gia Nhập|Dự Án" src
```

Expected: no matches.

- [ ] **Step 2: Run all quality gates**

Run:

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run format
npm.cmd run build
git diff --check
```

Expected: every command exits `0`; the full test suite passes; lint and formatting report no errors; Vite produces the production build; Git reports no whitespace errors.

- [ ] **Step 3: Review the final diff**

Run:

```powershell
git diff -- src/content/heading-capitalization.test.ts src/content/labels.ts src/content/stitch.ts src/content/stitch.test.ts src/pages/page-layouts.test.tsx
```

Expected: only approved Vietnamese heading capitalization and matching test expectations changed. English content, news records, official names, body copy, and URLs are unchanged.

- [ ] **Step 4: Commit the implementation**

Run:

```powershell
git add -- src/content/heading-capitalization.test.ts src/content/labels.ts src/content/stitch.ts src/content/stitch.test.ts src/pages/page-layouts.test.tsx
git commit -m "style: normalize Vietnamese heading capitalization"
```

Expected: one implementation commit containing the test-first copy correction.
