# Selective Repository Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve both developers' work, selectively add compatible card visuals to the approved AIC landing page, and publish the verified result as the public repository `ninhhh1011/aic-haui-web`.

**Architecture:** Keep the approved application at commit `45d46f6` plus its design documentation as the source of truth. Snapshot and relocate the collaborator repository before making an isolated integration branch, then reimplement the approved card visuals and opening brain-network preloader with focused tests. Publish the integrated branch as `main` and the collaborator snapshot as a separate `archive/` branch.

**Tech Stack:** Git, PowerShell, React 19, TypeScript, Tailwind CSS, Lucide React, Vitest, Testing Library, ESLint, Prettier, Vite, GitHub CLI.

---

## File map

- Modify: `src/components/cards/ResearchCards.tsx` — decorative icon mapping and rendering for research-group cards only.
- Modify: `src/components/cards/StudentCards.tsx` — decorative icons and reduced-motion-safe presentation for the two student-lab cards.
- Modify: `src/components/cards/cards-behavior.test.tsx` — regression tests proving icons are decorative, content is unchanged, and motion has a reduced-motion fallback.
- Create: `src/assets/brain-network.svg` — the collaborator's exact brain-network path with its drawing animation defined inside the single SVG source.
- Create: `src/components/layout/OpeningPreloader.tsx` — timer and document-overflow lifecycle for the 4.5-second opening.
- Create: `src/components/layout/OpeningPreloader.css` — full-screen layout, graphic fade, and split-panel exit.
- Create: `src/components/layout/OpeningPreloader.test.tsx` — timer, overflow cleanup, inert-shell, and reduced-motion regression tests.
- Modify: `src/app/App.tsx` — mount the preloader and make the routed application inert while it is active.
- Reference only: `DESIGN.md` — approved typography, header, motion, and content contract.
- Reference only: `docs/superpowers/specs/2026-07-26-selective-repository-integration-design.md` — approved integration and publication requirements.
- Reference only: collaborator `public/media/preloader/brain-network.svg` — exact source geometry for the approved opening visual.
- Do not copy or modify: collaborator `src/components/layout/Header.tsx`, `src/pages/HomePage.tsx`, `src/content/stitch.ts`, `src/components/layout/Preloader.tsx`, `src/lib/useBrainNetworkDraw.ts`, or `tsconfig.app.tsbuildinfo`.

### Task 1: Preserve the collaborator worktree

**Repositories:**

- Approved: `E:\aic-haui-web-phamhoan2708`
- Collaborator source: `E:\aic-haui-web-phamhoan2708\aic-haui-web\aic-haui-web`
- Collaborator destination: `E:\aic-haui-web-collaborator`

- [ ] **Step 1: Verify the exact repositories and dirty scope**

Run:

```powershell
$approved = 'E:\aic-haui-web-phamhoan2708'
$collaborator = 'E:\aic-haui-web-phamhoan2708\aic-haui-web\aic-haui-web'

git -C $approved rev-parse --show-toplevel
git -C $approved status --short --branch
git -C $collaborator rev-parse --show-toplevel
git -C $collaborator status --short --branch
```

Expected:

- Approved root resolves to `E:/aic-haui-web-phamhoan2708`.
- Approved status contains only the untracked `aic-haui-web/` wrapper.
- Collaborator root resolves to the double-nested path.
- Collaborator status contains only modified `src/components/layout/Header.tsx` and `src/pages/HomePage.tsx`.

Stop if any additional collaborator file is dirty; do not include unknown files in the preservation commit.

- [ ] **Step 2: Create the collaborator preservation branch**

Run:

```powershell
$collaborator = 'E:\aic-haui-web-phamhoan2708\aic-haui-web\aic-haui-web'
git -C $collaborator switch -c archive/collaborator-f23ee9d-wip
```

Expected: Git reports a new branch named `archive/collaborator-f23ee9d-wip`.

- [ ] **Step 3: Stage only the two known dirty files**

Run:

```powershell
$collaborator = 'E:\aic-haui-web-phamhoan2708\aic-haui-web\aic-haui-web'
git -C $collaborator add -- src/components/layout/Header.tsx src/pages/HomePage.tsx
git -C $collaborator diff --cached --name-only
```

Expected exactly:

```text
src/components/layout/Header.tsx
src/pages/HomePage.tsx
```

- [ ] **Step 4: Commit and verify the snapshot**

Run:

```powershell
$collaborator = 'E:\aic-haui-web-phamhoan2708\aic-haui-web\aic-haui-web'
git -C $collaborator commit -m "chore: preserve collaborator worktree"
git -C $collaborator status --short --branch
git -C $collaborator log -1 --oneline
```

Expected: the branch is clean and the latest commit message is `chore: preserve collaborator worktree`.

### Task 2: Move the collaborator repository outside the approved repository

**Paths:**

- Move: `E:\aic-haui-web-phamhoan2708\aic-haui-web\aic-haui-web`
- To: `E:\aic-haui-web-collaborator`
- Remove only when empty: `E:\aic-haui-web-phamhoan2708\aic-haui-web`

- [ ] **Step 1: Validate source and destination paths**

Run:

```powershell
$approved = (Resolve-Path -LiteralPath 'E:\aic-haui-web-phamhoan2708').Path
$wrapper = (Resolve-Path -LiteralPath 'E:\aic-haui-web-phamhoan2708\aic-haui-web').Path
$source = (Resolve-Path -LiteralPath 'E:\aic-haui-web-phamhoan2708\aic-haui-web\aic-haui-web').Path
$destination = 'E:\aic-haui-web-collaborator'

if (-not $source.StartsWith($wrapper + [IO.Path]::DirectorySeparatorChar)) {
  throw "Collaborator source is outside the expected wrapper: $source"
}
if (Test-Path -LiteralPath $destination) {
  throw "Destination already exists: $destination"
}
git -C $source status --porcelain
```

Expected: no output from `git status --porcelain`; stop if the destination exists or the collaborator worktree is dirty.

- [ ] **Step 2: Move the repository and remove only the empty wrapper**

Run:

```powershell
$wrapper = 'E:\aic-haui-web-phamhoan2708\aic-haui-web'
$source = 'E:\aic-haui-web-phamhoan2708\aic-haui-web\aic-haui-web'
$destination = 'E:\aic-haui-web-collaborator'

Move-Item -LiteralPath $source -Destination $destination
$remaining = @(Get-ChildItem -LiteralPath $wrapper -Force)
if ($remaining.Count -eq 0) {
  Remove-Item -LiteralPath $wrapper
} else {
  throw "Wrapper is not empty; it was not removed."
}
```

Expected: the collaborator repository is at `E:\aic-haui-web-collaborator` and the old wrapper no longer exists.

- [ ] **Step 3: Verify both repositories and histories after the move**

Run:

```powershell
$approved = 'E:\aic-haui-web-phamhoan2708'
$collaborator = 'E:\aic-haui-web-collaborator'

git -C $approved status --short --branch
git -C $collaborator status --short --branch
git -C $collaborator log --oneline -4
```

Expected:

- Approved repository no longer reports `aic-haui-web/`.
- Collaborator branch is `archive/collaborator-f23ee9d-wip` and clean.
- Its log contains the preservation commit followed by `f23ee9d`, `9577d14`, and `734e1ae`.

### Task 3: Create an isolated integration branch and prove the baseline

**Repository:**

- Approved: `E:\aic-haui-web-phamhoan2708`

- [ ] **Step 1: Create the integration branch from the approved documented state**

Run:

```powershell
git switch -c agent/selective-repository-integration
git log -3 --oneline
git merge-base --is-ancestor e436cf0 HEAD
```

Expected: the branch includes the approved specification commit `e436cf0` and
this implementation plan; application code still descends from approved commit
`45d46f6`.

- [ ] **Step 2: Run the clean baseline**

Run:

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run format
npm.cmd run build
```

Expected:

- 30 test files and 216 tests pass.
- ESLint exits `0` with no warnings.
- Prettier reports all matched files use its formatting.
- TypeScript and Vite build successfully.

Stop if the baseline fails. Diagnose the failure before changing card code.

### Task 4: Add decorative research-lab icons with TDD

**Files:**

- Modify: `src/components/cards/cards-behavior.test.tsx`
- Modify: `src/components/cards/ResearchCards.tsx`

- [ ] **Step 1: Import `ResearchGroupCard` and add the failing icon test**

Change the research-card import in `src/components/cards/cards-behavior.test.tsx` to:

```tsx
import { ResearchDirectionCard, ResearchGroupCard } from "./ResearchCards";
```

Add this test inside `describe("card data-shape behavior", ...)`:

```tsx
it("renders a decorative icon for a research lab without changing its approved copy", () => {
  render(
    <ResearchGroupCard
      item={{
        id: "computer-vision-lab",
        title: "Computer Vision Lab",
        description: "Approved research description",
      }}
      memberSuffix="members"
    />,
  );

  const icon = screen.getByTestId("research-lab-icon-computer-vision-lab");
  expect(icon).toHaveAttribute("aria-hidden", "true");
  expect(screen.getByRole("heading", { name: "Computer Vision Lab" })).toBeInTheDocument();
  expect(screen.getByText("Approved research description")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```powershell
npx.cmd vitest run src/components/cards/cards-behavior.test.tsx -t "renders a decorative icon for a research lab"
```

Expected: FAIL because `research-lab-icon-computer-vision-lab` does not exist.

- [ ] **Step 3: Add the approved icon mapping**

At the top of `src/components/cards/ResearchCards.tsx`, add:

```tsx
import {
  Bot,
  Brain,
  Cpu,
  Database,
  MonitorPlay,
  Scale,
  Users,
  Wifi,
  type LucideIcon,
} from "lucide-react";
```

Add below the imports:

```tsx
const researchLabIcons: Readonly<Record<string, LucideIcon>> = {
  "computer-vision-lab": MonitorPlay,
  "nlp-lab": Brain,
  "robotics-lab": Bot,
  "data-science-lab": Database,
  "applied-ai-lab": Cpu,
  "iot-ai-lab": Wifi,
  "ai-ethics-lab": Scale,
};
```

- [ ] **Step 4: Extend `CardCopy` without changing content**

Replace the `CardCopy` signature and heading with:

```tsx
function CardCopy({
  item,
  ctaHref,
  icon: Icon,
}: {
  item: ResearchItem;
  ctaHref?: string;
  icon?: LucideIcon;
}) {
  return (
    <>
      {Icon ? (
        <div className="mb-4 flex items-center gap-3">
          <span
            data-testid={`research-lab-icon-${item.id}`}
            aria-hidden="true"
            className="grid size-11 shrink-0 place-items-center rounded-xl bg-aic-blue text-white shadow-sm"
          >
            <Icon size={22} strokeWidth={1.8} />
          </span>
          <h3 className="font-display font-bold text-aic-navy">{item.title}</h3>
        </div>
      ) : (
        <h3 className="font-display font-bold text-aic-navy">{item.title}</h3>
      )}
      <p className={cn("mt-3 text-aic-muted", bodyCopyTypography)}>{item.description}</p>
      {item.tags && item.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-aic-mist px-3 py-1 text-xs text-aic-blue">
              {tag}
            </span>
          ))}
        </div>
      )}
      {item.cta && ctaHref && (
        <a className="mt-5 inline-block text-sm font-bold text-aic-blue" href={ctaHref}>
          {item.cta}
        </a>
      )}
    </>
  );
}
```

- [ ] **Step 5: Supply icons only to research-group cards**

Inside `ResearchGroupCard`, before `return`, add:

```tsx
const Icon = researchLabIcons[item.id] ?? Users;
```

Replace:

```tsx
<CardCopy item={item} />
```

with:

```tsx
<CardCopy item={item} icon={Icon} />
```

Do not supply an icon from `ResearchDirectionCard`; direction-card output remains unchanged.

- [ ] **Step 6: Run focused and related tests**

Run:

```powershell
npx.cmd vitest run src/components/cards/cards-behavior.test.tsx src/pages/page-layouts.test.tsx src/styles/style-contract.test.ts
```

Expected: all selected tests pass and approved content-count assertions remain unchanged.

- [ ] **Step 7: Commit the research-card change**

Run:

```powershell
git add -- src/components/cards/ResearchCards.tsx src/components/cards/cards-behavior.test.tsx
git commit -m "feat: add research lab card icons"
```

Expected: one commit containing only the research component and its test.

### Task 5: Add decorative student-lab icons and safe motion with TDD

**Files:**

- Modify: `src/components/cards/cards-behavior.test.tsx`
- Modify: `src/components/cards/StudentCards.tsx`

- [ ] **Step 1: Add the failing student-lab presentation test**

Add this test inside `describe("card data-shape behavior", ...)`:

```tsx
it("adds a decorative student-lab icon with a reduced-motion fallback", () => {
  render(
    <LabCard
      lab={{
        id: "foundry",
        name: "AI Foundry",
        positioning: "Approved positioning",
        benefits: ["Approved benefit"],
      }}
    />,
  );

  const card = screen.getByRole("heading", { name: "AI Foundry" }).closest("[data-student-lab]");
  const icon = screen.getByTestId("student-lab-icon-foundry");

  expect(icon).toHaveAttribute("aria-hidden", "true");
  expect(card).toHaveClass(
    "transition-transform",
    "hover:-translate-y-1",
    "motion-reduce:transform-none",
    "motion-reduce:transition-none",
  );
  expect(screen.getByText("Approved positioning")).toBeInTheDocument();
  expect(screen.getByText("Approved benefit")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```powershell
npx.cmd vitest run src/components/cards/cards-behavior.test.tsx -t "adds a decorative student-lab icon"
```

Expected: FAIL because `student-lab-icon-foundry` and the motion classes do not exist.

- [ ] **Step 3: Add the student icon mapping**

At the top of `src/components/cards/StudentCards.tsx`, add:

```tsx
import { FlaskConical, Rocket, type LucideIcon } from "lucide-react";
```

Add before `LabCard`:

```tsx
const studentLabIcons: Readonly<Record<string, LucideIcon>> = {
  foundry: FlaskConical,
  innovation: Rocket,
};
```

- [ ] **Step 4: Add reduced-motion-safe card presentation**

At the start of `LabCard`, add:

```tsx
const Icon = studentLabIcons[lab.id];
```

Replace the `Card` class expression with:

```tsx
className={cn(
  "group transition-transform duration-300 hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none",
  lab.id === "foundry"
    ? "border-aic-gold/50 bg-aic-warm"
    : "border-aic-blue/20 bg-aic-mist",
)}
```

Replace the standalone lab heading:

```tsx
<h3 className="font-display font-bold text-aic-navy">{lab.name}</h3>
```

with:

```tsx
<div className="flex items-center gap-3">
  {Icon && (
    <span
      data-testid={`student-lab-icon-${lab.id}`}
      aria-hidden="true"
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-xl shadow-sm",
        lab.id === "foundry" ? "bg-aic-gold text-aic-navy" : "bg-aic-blue text-white",
      )}
    >
      <Icon size={22} strokeWidth={1.8} />
    </span>
  )}
  <h3 className="font-display font-bold text-aic-navy">{lab.name}</h3>
</div>
```

Keep the existing image, positioning, benefits, content order, and responsive grid unchanged.

- [ ] **Step 5: Run focused and related tests**

Run:

```powershell
npx.cmd vitest run src/components/cards/cards-behavior.test.tsx src/pages/page-layouts.test.tsx src/styles/style-contract.test.ts
```

Expected: all selected tests pass; the two approved student labs, their text, and their order remain unchanged.

- [ ] **Step 6: Commit the student-card change**

Run:

```powershell
git add -- src/components/cards/StudentCards.tsx src/components/cards/cards-behavior.test.tsx
git commit -m "feat: refine student lab cards"
```

Expected: one commit containing only the student component and its test update.

### Task 6: Run full quality gates and visual review

**Files:**

- Verify only: all tracked application files.

- [ ] **Step 1: Run formatting and apply only mechanical formatting if required**

Run:

```powershell
npm.cmd run format
```

Expected: PASS. If only the three intended card/test files fail, run:

```powershell
npx.cmd prettier --write src/components/cards/ResearchCards.tsx src/components/cards/StudentCards.tsx src/components/cards/cards-behavior.test.tsx
git add -- src/components/cards/ResearchCards.tsx src/components/cards/StudentCards.tsx src/components/cards/cards-behavior.test.tsx
git commit -m "style: format integrated card visuals"
```

Do not format unrelated files.

- [ ] **Step 2: Run all automated gates**

Run:

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run format
npm.cmd run build
```

Expected:

- The complete test suite passes.
- ESLint exits `0` with no warnings.
- Prettier passes.
- TypeScript and Vite production build pass.

- [ ] **Step 3: Confirm only approved files changed**

Run:

```powershell
git status --short
git diff 45d46f6..HEAD -- src/components/layout/Header.tsx src/pages/HomePage.tsx src/content/stitch.ts src/styles/globals.css src/styles/tokens.css
git log --oneline --decorate 45d46f6..HEAD
```

Expected:

- Working tree is clean.
- The protected implementation files in the second command have no integration diff.
- History contains the approved documentation commits and the two focused visual commits.

- [ ] **Step 4: Inspect desktop and mobile rendering**

Run the local server:

```powershell
npm.cmd run dev -- --host 127.0.0.1
```

Open `http://127.0.0.1:5173/#nghien-cuu` and inspect at approximately 1440px and 390px widths. Then inspect `http://127.0.0.1:5173/#sinh-vien`.

Expected:

- Research-group and student-lab cards show icons without duplicate text.
- Approved header, fonts, colours, content, contacts, news, staff, and section order are unchanged.
- Cards do not clip text or media at either viewport.
- Keyboard focus remains visible.
- With reduced motion enabled, card translation is disabled.

- [ ] **Step 5: Obtain user approval of the integrated interface**

Present the local result and report the exact test/build counts. Do not create the GitHub repository until the user approves this checkpoint.

### Task 7: Add the 4.5-second opening brain-network preloader

**Files:**

- Create: `src/assets/brain-network.svg`
- Create: `src/components/layout/OpeningPreloader.tsx`
- Create: `src/components/layout/OpeningPreloader.css`
- Create: `src/components/layout/OpeningPreloader.test.tsx`
- Modify: `src/app/App.tsx`

- [ ] **Step 1: Write the failing lifecycle and integration tests**

Create `src/components/layout/OpeningPreloader.test.tsx`:

```tsx
import { useState } from "react";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { App } from "../../app/App";
import { OPENING_PRELOADER_MS, OpeningPreloader } from "./OpeningPreloader";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function mockReducedMotion(matches: boolean) {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query) =>
      ({
        matches: query === REDUCED_MOTION_QUERY ? matches : false,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }) as MediaQueryList,
  );
}

function PreloaderHarness() {
  const [active, setActive] = useState(true);

  return active ? (
    <OpeningPreloader onComplete={() => setActive(false)} />
  ) : (
    <p>Landing page ready</p>
  );
}

describe("opening preloader", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.history.replaceState({}, "", "/");
    document.body.style.overflow = "";
  });

  afterEach(() => {
    cleanup();
    document.body.style.overflow = "";
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("holds the page for exactly 4.5 seconds and restores the previous overflow", () => {
    document.body.style.overflow = "clip";
    render(<PreloaderHarness />);

    expect(screen.getByTestId("opening-preloader")).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");

    act(() => vi.advanceTimersByTime(OPENING_PRELOADER_MS - 1));
    expect(screen.getByTestId("opening-preloader")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByTestId("opening-preloader")).not.toBeInTheDocument();
    expect(screen.getByText("Landing page ready")).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("clip");
  });

  it("clears its timer and restores overflow when unmounted early", () => {
    const onComplete = vi.fn();
    document.body.style.overflow = "auto";
    const { unmount } = render(<OpeningPreloader onComplete={onComplete} />);

    unmount();
    act(() => vi.advanceTimersByTime(OPENING_PRELOADER_MS));

    expect(onComplete).not.toHaveBeenCalled();
    expect(document.body.style.overflow).toBe("auto");
  });

  it("makes the routed application inert until the preloader completes", () => {
    mockReducedMotion(false);
    render(<App />);

    const shell = screen.getByTestId("app-shell");
    expect(shell).toHaveAttribute("inert");
    expect(screen.getByTestId("opening-preloader")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(OPENING_PRELOADER_MS));

    expect(screen.queryByTestId("opening-preloader")).not.toBeInTheDocument();
    expect(shell).not.toHaveAttribute("inert");
  });

  it("bypasses the preloader immediately when reduced motion is requested", () => {
    mockReducedMotion(true);
    render(<App />);

    expect(screen.queryByTestId("opening-preloader")).not.toBeInTheDocument();
    expect(screen.getByTestId("app-shell")).not.toHaveAttribute("inert");
    expect(document.body.style.overflow).toBe("");
  });
});
```

- [ ] **Step 2: Run the focused test and verify the red state**

Run:

```powershell
npx.cmd vitest run src/components/layout/OpeningPreloader.test.tsx
```

Expected: FAIL because `OpeningPreloader.tsx` and its exports do not exist.

- [ ] **Step 3: Copy the exact collaborator SVG geometry**

Run:

```powershell
$source = 'E:\aic-haui-web-collaborator\public\media\preloader\brain-network.svg'
$destination = 'src\assets\brain-network.svg'

if (-not (Test-Path -LiteralPath $source)) {
  throw "Collaborator brain-network source is missing: $source"
}
if (Test-Path -LiteralPath $destination) {
  throw "Destination already exists: $destination"
}

Copy-Item -LiteralPath $source -Destination $destination
```

Expected: one new SVG at `src/assets/brain-network.svg`. Do not copy the
collaborator's `Preloader.tsx`, drawing hook, or public preloader directory.

- [ ] **Step 4: Put the drawing animation inside the single SVG source**

In `src/assets/brain-network.svg`, add this style as the first child of
`<defs>`:

```svg
<style type="text/css"><![CDATA[
  #path1 {
    fill: none;
    stroke: #ff7800;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    filter: drop-shadow(0 0 5px #ff7800) drop-shadow(0 0 10px #ff7800);
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: brain-network-draw 3.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  @keyframes brain-network-draw {
    from { stroke-dashoffset: 1; }
    to { stroke-dashoffset: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    #path1 {
      animation: none;
      stroke-dashoffset: 0;
    }
  }
]]></style>
```

On the existing `path#path1`:

- retain its `d` attribute byte-for-byte;
- add `pathLength="1"`;
- change its inline style to:

```svg
style="fill:none;stroke:#ff7800;stroke-width:2;stroke-opacity:1"
```

Verify the geometry is unchanged:

```powershell
$sourceSvg = Get-Content -LiteralPath 'E:\aic-haui-web-collaborator\public\media\preloader\brain-network.svg' -Raw
$integratedSvg = Get-Content -LiteralPath 'src\assets\brain-network.svg' -Raw
$sourcePath = [regex]::Match($sourceSvg, '<path[\s\S]*?d="([^"]+)"[\s\S]*?/>').Groups[1].Value
$integratedPath = [regex]::Match($integratedSvg, '<path[\s\S]*?d="([^"]+)"[\s\S]*?/>').Groups[1].Value

if ($sourcePath -ne $integratedPath) {
  throw "Brain-network path geometry changed during integration."
}
```

Expected: no error; both path strings have length `20924`.

- [ ] **Step 5: Create the focused preloader stylesheet**

Create `src/components/layout/OpeningPreloader.css`:

```css
.opening-preloader {
  position: fixed;
  inset: 0;
  z-index: 200;
  overflow: hidden;
  pointer-events: auto;
}

.opening-preloader__panel {
  position: absolute;
  inset-block: 0;
  z-index: 0;
  width: 50%;
  background: #001a33;
  animation-duration: 1s;
  animation-delay: 3.5s;
  animation-timing-function: cubic-bezier(0.87, 0, 0.13, 1);
  animation-fill-mode: forwards;
}

.opening-preloader__panel--left {
  left: 0;
  border-right: 1px solid rgb(255 255 255 / 10%);
  box-shadow: 20px 0 50px rgb(0 0 0 / 50%);
  animation-name: opening-preloader-split-left;
}

.opening-preloader__panel--right {
  right: 0;
  border-left: 1px solid rgb(255 255 255 / 10%);
  box-shadow: -20px 0 50px rgb(0 0 0 / 50%);
  animation-name: opening-preloader-split-right;
}

.opening-preloader__graphic-shell {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: grid;
  place-items: center;
  pointer-events: none;
}

.opening-preloader__graphic {
  display: block;
  width: 95vw;
  max-width: 1600px;
  height: auto;
  animation: opening-preloader-graphic-exit 0.5s ease 3.5s forwards;
}

@keyframes opening-preloader-split-left {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

@keyframes opening-preloader-split-right {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

@keyframes opening-preloader-graphic-exit {
  from {
    opacity: 1;
    transform: scale(1);
  }

  to {
    opacity: 0;
    visibility: hidden;
    transform: scale(1.1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .opening-preloader {
    display: none;
  }

  .opening-preloader__panel,
  .opening-preloader__graphic {
    animation: none;
  }
}
```

- [ ] **Step 6: Implement timer and document cleanup**

Create `src/components/layout/OpeningPreloader.tsx`:

```tsx
import { useEffect } from "react";

import brainNetworkUrl from "../../assets/brain-network.svg";
import "./OpeningPreloader.css";

export const OPENING_PRELOADER_MS = 4500;

export function OpeningPreloader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(onComplete, OPENING_PRELOADER_MS);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [onComplete]);

  return (
    <div data-testid="opening-preloader" aria-hidden="true" className="opening-preloader">
      <div className="opening-preloader__panel opening-preloader__panel--left" />
      <div className="opening-preloader__panel opening-preloader__panel--right" />
      <div className="opening-preloader__graphic-shell">
        <img
          src={brainNetworkUrl}
          alt=""
          draggable={false}
          className="opening-preloader__graphic"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Mount the preloader and inert the routed application**

Replace `src/app/App.tsx` with:

```tsx
import { useState } from "react";
import { RouterProvider } from "react-router-dom";

import { OpeningPreloader } from "../components/layout/OpeningPreloader";
import { router } from "./router";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function shouldShowOpeningPreloader() {
  return typeof window !== "undefined" && !window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function App() {
  const [preloaderActive, setPreloaderActive] = useState(shouldShowOpeningPreloader);

  return (
    <>
      {preloaderActive && <OpeningPreloader onComplete={() => setPreloaderActive(false)} />}
      <div data-testid="app-shell" inert={preloaderActive || undefined}>
        <RouterProvider router={router} />
      </div>
    </>
  );
}
```

- [ ] **Step 8: Run focused tests and resolve only implementation errors**

Run:

```powershell
npx.cmd vitest run src/components/layout/OpeningPreloader.test.tsx
```

Expected: all four focused tests pass. If React's `inert` type or boolean
serialization differs, preserve the semantic inert attribute and adjust only
the test assertion or JSX representation required by the installed React 19
types; do not replace inert with a visual-only overlay.

- [ ] **Step 9: Prove there is one visual source and no dead collaborator code**

Run:

```powershell
rg -n "brain-network|useBrainNetworkDraw|opening-preloader" src public
```

Expected:

- one integrated SVG asset;
- one import of that asset from `OpeningPreloader.tsx`;
- no `useBrainNetworkDraw`;
- no duplicate public preloader SVG;
- no copied collaborator `Preloader.tsx`.

- [ ] **Step 10: Run all quality gates**

Run:

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run format
npm.cmd run build
```

Expected: the complete suite, ESLint, Prettier, TypeScript, and Vite build all
pass. Record the new JS/CSS/asset sizes and compare them with the pre-preloader
build.

- [ ] **Step 11: Inspect the preloader locally**

Reload `http://127.0.0.1:4173/` at approximately 1440px and 390px widths.

Expected:

- the orange brain-network path draws over the navy full-screen background;
- the routed page cannot receive pointer or keyboard interaction while inert;
- the graphic begins fading and both panels split after 3.5 seconds;
- the overlay is gone and scrolling is restored at 4.5 seconds;
- reloading plays it again;
- no duplicate graphic, copy, or audio appears;
- no console errors occur.

Use the automated reduced-motion test as the required evidence when the
available browser backend cannot emulate `prefers-reduced-motion`.

- [ ] **Step 12: Commit the preloader**

Run:

```powershell
git add -- src/assets/brain-network.svg src/components/layout/OpeningPreloader.tsx src/components/layout/OpeningPreloader.css src/components/layout/OpeningPreloader.test.tsx src/app/App.tsx
git commit -m "feat: add opening brain network preloader"
```

Expected: one focused commit with only the five planned files, followed by a
clean worktree.

- [ ] **Step 13: Obtain final user approval before publication**

Keep the local preview running, present the preloader result and fresh quality
gate counts, and wait for explicit user approval before Task 8.

### Task 8: Create and publish the new public GitHub repository

**GitHub target:**

- Owner: `ninhhh1011`
- Repository: `aic-haui-web`
- Visibility: public
- Main source: `E:\aic-haui-web-phamhoan2708`
- Archive source: `E:\aic-haui-web-collaborator`

- [ ] **Step 1: Recheck authentication and repository availability**

Run:

```powershell
gh auth status
gh api user --jq '.login'
gh repo view ninhhh1011/aic-haui-web --json nameWithOwner 2>$null
if ($LASTEXITCODE -eq 0) {
  throw "Repository already exists; stop before creating or overwriting it."
}
```

Expected: authenticated login is `ninhhh1011` and the target repository does not exist.

- [ ] **Step 2: Create the empty public repository**

Run:

```powershell
gh repo create ninhhh1011/aic-haui-web --public --description "AIC HaUI research center landing page"
```

Expected: GitHub returns `https://github.com/ninhhh1011/aic-haui-web`.

- [ ] **Step 3: Preserve the old remote and configure the new origin**

Run:

```powershell
git remote rename origin phamhoan2708
git remote add origin https://github.com/ninhhh1011/aic-haui-web.git
git remote -v
```

Expected:

- `origin` points to `ninhhh1011/aic-haui-web`.
- `phamhoan2708` still points to `phamhoan2708-commits/aic-haui-web`.

- [ ] **Step 4: Publish the verified integration as `main`**

Run:

```powershell
git branch -f main HEAD
git push -u origin main
gh repo edit ninhhh1011/aic-haui-web --default-branch main
```

Expected: new remote `main` points to the verified integration commit without a force push.

- [ ] **Step 5: Publish the collaborator snapshot as an archive branch**

Run:

```powershell
$collaborator = 'E:\aic-haui-web-collaborator'
$archiveCommit = git -C $collaborator rev-parse archive/collaborator-f23ee9d-wip
git -C $collaborator push https://github.com/ninhhh1011/aic-haui-web.git `
  "${archiveCommit}:refs/heads/archive/collaborator-f23ee9d-wip"
```

Expected: GitHub creates `archive/collaborator-f23ee9d-wip` at the preservation snapshot commit.

- [ ] **Step 6: Verify publication independently**

Run:

```powershell
gh repo view ninhhh1011/aic-haui-web --json nameWithOwner,url,visibility,defaultBranchRef
git ls-remote --heads https://github.com/ninhhh1011/aic-haui-web.git `
  main archive/collaborator-f23ee9d-wip
git remote -v
```

Expected:

- Repository is `PUBLIC`.
- Default branch is `main`.
- Both `main` and `archive/collaborator-f23ee9d-wip` return commit hashes.
- Both new and backup remotes remain configured locally.

- [ ] **Step 7: Report the final handoff**

Report:

- Public repository URL.
- Final `main` commit hash.
- Collaborator archive commit hash and branch.
- Test, lint, format, and build results.
- Old remote backup name `phamhoan2708`.
