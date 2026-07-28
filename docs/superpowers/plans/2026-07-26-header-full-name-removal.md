# Header Full Name Removal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the center's full name from the desktop header while preserving the AIC brand, language switcher, mobile controls, header dimensions, and navigation tier.

**Architecture:** Keep the existing two-tier `Header` component and centralized identity content. Remove only the desktop full-name element and simplify its brand-tier grid from three columns to two so the remaining controls stay aligned to opposite edges.

**Tech Stack:** React, TypeScript, Tailwind CSS, Vitest, Testing Library, Vite

---

## File Map

- Modify `src/components/layout/Header.test.tsx`: assert that the full name is absent while the retained controls still render.
- Modify `src/components/layout/Header.tsx`: remove the full-name paragraph and use a two-column brand-tier grid.

### Task 1: Lock the requested header behavior

**Files:**

- Modify: `src/components/layout/Header.test.tsx`

- [ ] **Step 1: Add the failing absence assertion**

In the desktop header test, add this assertion after the retained AIC brand assertions:

```ts
expect(
  screen.queryByText("Trung tâm Nghiên cứu và Ứng dụng Trí tuệ Nhân tạo"),
).not.toBeInTheDocument();
```

Keep the existing assertions for the logo, `AIC` short name, fixed header, tier heights, language controls, and desktop navigation.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
npm.cmd test -- src/components/layout/Header.test.tsx
```

Expected: FAIL because the desktop header still renders the center's full name.

### Task 2: Remove the desktop center name

**Files:**

- Modify: `src/components/layout/Header.tsx`

- [ ] **Step 1: Simplify the brand-tier grid**

Replace the three-column desktop grid with the same two-column definition at every breakpoint:

```tsx
<PageContainer className="grid h-full grid-cols-[1fr_auto] items-center gap-6">
```

- [ ] **Step 2: Remove only the full-name paragraph**

Delete this element:

```tsx
<p className="hidden text-center text-sm font-semibold tracking-wide text-white lg:block xl:text-base">
  {siteContent.identity.fullName}
</p>
```

Keep `{brand}` first and the existing right-aligned language/mobile-control wrapper second:

```tsx
{
  brand;
}
<div className="flex items-center justify-self-end">
  <LanguageSwitcher overlay />
  <MobileNav activeSection={activeSection} />
</div>;
```

- [ ] **Step 3: Run the focused test and verify GREEN**

Run:

```powershell
npm.cmd test -- src/components/layout/Header.test.tsx
```

Expected: all Header tests PASS.

### Task 3: Verify and commit

**Files:**

- Verify: `src/components/layout/Header.tsx`
- Verify: `src/components/layout/Header.test.tsx`

- [ ] **Step 1: Run all quality gates**

Run:

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run format
npm.cmd run build
git diff --check
```

Expected: every command exits `0`; all tests pass; lint, formatting, compilation, build, and whitespace checks are clean.

- [ ] **Step 2: Review the final diff**

Run:

```powershell
git diff -- src/components/layout/Header.tsx src/components/layout/Header.test.tsx
```

Expected: the diff contains one absence assertion, removal of the full-name paragraph, and the three-to-two-column grid change only.

- [ ] **Step 3: Commit the implementation**

Run:

```powershell
git add -- src/components/layout/Header.tsx src/components/layout/Header.test.tsx
git commit -m "style: remove full name from header"
```

Expected: one focused implementation commit.
