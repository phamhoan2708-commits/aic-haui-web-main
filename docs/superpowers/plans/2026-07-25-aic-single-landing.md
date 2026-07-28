# AIC Single Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the existing bilingual AIC React site into one production-ready landing page whose seven navigation items scroll to stable sections, while preserving every content block explicitly approved in the design specification.

**Architecture:** `HomePage` remains the composition root. Existing Research, Cooperation, and Students page components gain an embedded rendering mode instead of being copied into a monolith. A shared landing-section registry becomes the single source for header navigation, mobile navigation, footer links, active-section observation, hero CTA anchors, and legacy-route redirects. Centralized content and the media manifest remain authoritative; no new institutional facts or assets are introduced.

**Tech Stack:** React 19, TypeScript, React Router, Vite, Tailwind CSS, Vitest, Testing Library, ESLint, Prettier, Docker/Nginx.

**Authoritative specification:** `docs/superpowers/specs/2026-07-25-aic-single-landing-design.md`

---

## Task 1: Lock the approved visual contract and local typography

**Files:**

- Create: `DESIGN.md`
- Modify: `src/styles/style-contract.test.ts`
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/globals.css`
- Modify: `tailwind.config.ts`
- Modify: `index.html`

- [ ] **Step 1: Add a failing source-contract test**

Extend `src/styles/style-contract.test.ts` so the approved design document and shared type tokens are executable requirements:

```ts
import designSource from "../../DESIGN.md?raw";

it("documents and exposes the approved SICT-derived typography scale", () => {
  expect(designSource).toContain("Be Vietnam Pro");
  expect(designSource).toContain("Desktop hero: 56px / 64px / 700");
  expect(designSource).toContain("Desktop header: 72px brand tier + 48px navigation tier");
  expect(tokensCss).toContain("--type-body-size: 14px");
  expect(tokensCss).toContain("--type-section-size: 22px");
  expect(tokensCss).toContain("--type-hero-size: 36px");
  expect(tokensCss).toContain("--landing-header-offset: 64px");
});

it("uses only the local Be Vietnam Pro family", () => {
  expect(globalsCss).not.toMatch(/Merriweather|fonts\.googleapis\.com/);
  expect(tailwindConfig).not.toMatch(/Merriweather/);
  expect(indexSource).not.toMatch(/fonts\.(googleapis|gstatic)\.com/);
});
```

- [ ] **Step 2: Run the contract test and confirm it fails**

Run:

```bash
npx vitest run src/styles/style-contract.test.ts
```

Expected: FAIL because `DESIGN.md` and the shared typography variables do not exist, while Google Fonts and Merriweather are still present.

- [ ] **Step 3: Create the root design contract**

Create `DESIGN.md` containing only approved implementation rules:

```md
# AIC Website Design Contract

## Typography

- Family: self-hosted Be Vietnam Pro for all interface and content text.
- Mobile body: 14px / 24px.
- Mobile card heading: 17px / 25px / 700.
- Mobile section heading: 22px / 31px / 700.
- Mobile major heading: 30px / 42px / 700.
- Mobile hero: 36px / 44px / 700.
- Desktop body: 14px / 26px.
- Desktop card heading: 18px / 27px / 700.
- Desktop section heading: 23px / 34px / 700.
- Desktop major heading: 35px / 52px / 700.
- Desktop hero: 56px / 64px / 700.

## Header

- Desktop header: 72px brand tier + 48px navigation tier.
- Mobile header: one fixed 64px bar.

## Visual language

- Preserve AIC navy, blue, gold, rounded surfaces, video hero, and generous spacing.
- Equivalent heading levels use consistent capitalization and typography.
- Missing factual media uses the existing neutral frame; it must not be represented as official.

## Motion and accessibility

- Keep lightweight reveals, the hero phrase rotation, and clipped staff portrait zoom.
- Staff portrait hover scale is exactly 1.2.
- Disable nonessential motion when `prefers-reduced-motion: reduce`.
```

- [ ] **Step 4: Move typography and header dimensions into shared CSS tokens**

Add the mobile defaults and desktop overrides in `src/styles/tokens.css`:

```css
:root {
  --type-body-size: 14px;
  --type-body-line: 24px;
  --type-card-size: 17px;
  --type-card-line: 25px;
  --type-section-size: 22px;
  --type-section-line: 31px;
  --type-major-size: 30px;
  --type-major-line: 42px;
  --type-hero-size: 36px;
  --type-hero-line: 44px;
  --landing-header-offset: 64px;
}

@media (min-width: 1024px) {
  :root {
    --type-body-line: 26px;
    --type-card-size: 18px;
    --type-card-line: 27px;
    --type-section-size: 23px;
    --type-section-line: 34px;
    --type-major-size: 35px;
    --type-major-line: 52px;
    --type-hero-size: 56px;
    --type-hero-line: 64px;
    --landing-header-offset: 120px;
  }
}
```

Use these variables in `src/styles/globals.css` and the shared heading components. Remove both remote `@import` statements, all Merriweather rules, and the radial layer from `.tech-grid-bg`. Map Tailwind `sans`, `display`, and any retained `serif` alias to Be Vietnam Pro so old `font-serif` classes cannot reintroduce another font.

Remove Google Fonts preconnect/preload tags from `index.html`. Do not remove the five local `@fontsource/be-vietnam-pro` imports in `src/main.tsx`.

- [ ] **Step 5: Re-run the focused style test**

Run:

```bash
npx vitest run src/styles/style-contract.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit the visual contract**

```bash
git add DESIGN.md src/styles/style-contract.test.ts src/styles/tokens.css src/styles/globals.css tailwind.config.ts index.html
git commit -m "style: establish AIC landing design contract"
```

## Task 2: Introduce one shared landing-section registry

**Files:**

- Create: `src/app/landingSections.ts`
- Create: `src/app/landingSections.test.ts`
- Modify: `src/app/routes.ts`
- Modify: `src/app/routes.test.ts`
- Modify: `src/content/labels.ts`

- [ ] **Step 1: Write the failing registry tests**

Create `src/app/landingSections.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { landingSections, legacyLandingSections, landingHref } from "./landingSections";

describe("landing section registry", () => {
  it("keeps the seven approved sections in source order", () => {
    expect(landingSections.map(({ id }) => id)).toEqual([
      "tin-tuc",
      "ve-chung-toi",
      "to-chuc",
      "nghien-cuu",
      "hop-tac",
      "sinh-vien",
      "lien-he",
    ]);
    expect(new Set(landingSections.map(({ id }) => id)).size).toBe(7);
  });

  it("maps every legacy route to a valid landing section", () => {
    expect(legacyLandingSections.map(({ legacyPath, id }) => [legacyPath, id])).toEqual([
      ["/ve-chung-toi", "ve-chung-toi"],
      ["/to-chuc", "to-chuc"],
      ["/nghien-cuu", "nghien-cuu"],
      ["/hop-tac", "hop-tac"],
      ["/sinh-vien", "sinh-vien"],
      ["/lien-he", "lien-he"],
    ]);
    expect(landingHref("nghien-cuu")).toBe("/#nghien-cuu");
  });
});
```

Update `src/app/routes.test.ts` to assert that compatibility routes are derived from the same six legacy records, not from a separate navigation registry.

- [ ] **Step 2: Run the registry tests and confirm they fail**

Run:

```bash
npx vitest run src/app/landingSections.test.ts src/app/routes.test.ts
```

Expected: FAIL because `landingSections.ts` does not exist and the current route model does not include News.

- [ ] **Step 3: Implement the shared typed registry**

Create `src/app/landingSections.ts`:

```ts
export type LandingSectionKey =
  "news" | "about" | "organization" | "research" | "cooperation" | "students" | "contact";

export type LandingSection = {
  key: LandingSectionKey;
  id: string;
  legacyPath?: `/${string}`;
};

export const landingSections = [
  { key: "news", id: "tin-tuc" },
  { key: "about", id: "ve-chung-toi", legacyPath: "/ve-chung-toi" },
  { key: "organization", id: "to-chuc", legacyPath: "/to-chuc" },
  { key: "research", id: "nghien-cuu", legacyPath: "/nghien-cuu" },
  { key: "cooperation", id: "hop-tac", legacyPath: "/hop-tac" },
  { key: "students", id: "sinh-vien", legacyPath: "/sinh-vien" },
  { key: "contact", id: "lien-he", legacyPath: "/lien-he" },
] as const satisfies readonly LandingSection[];

export type LandingSectionId = (typeof landingSections)[number]["id"];

export const legacyLandingSections = landingSections.filter(
  (section): section is (typeof landingSections)[number] & { legacyPath: `/${string}` } =>
    "legacyPath" in section,
);

export const landingHref = (id: LandingSectionId) => `/#${id}` as const;
```

Refactor `src/app/routes.ts` to keep `/` plus the six compatibility paths, generated from `legacyLandingSections`. Remove `navigationRoutes`; navigation will consume `landingSections` directly.

Add the missing bilingual navigation label:

```ts
// Vietnamese
news: "Tin tức",

// English
news: "News",
```

- [ ] **Step 4: Re-run the focused tests**

Run:

```bash
npx vitest run src/app/landingSections.test.ts src/app/routes.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit the registry**

```bash
git add src/app/landingSections.ts src/app/landingSections.test.ts src/app/routes.ts src/app/routes.test.ts src/content/labels.ts
git commit -m "refactor: centralize landing section registry"
```

## Task 3: Redirect every legacy page URL to its landing anchor

**Files:**

- Modify: `src/app/router.test.tsx`
- Modify: `src/app/router.tsx`
- Modify: `src/app/DeferredPage.tsx` only if it becomes unused and can be removed safely

- [ ] **Step 1: Replace page-route expectations with failing redirect tests**

In `src/app/router.test.tsx`, delete expectations that `/nghien-cuu`, `/hop-tac`, and `/sinh-vien` render separate page `h1` elements. Add:

```ts
import { waitFor } from "@testing-library/react";
import { legacyLandingSections } from "./landingSections";

it.each(legacyLandingSections)(
  "replaces $legacyPath with /#$id",
  async ({ legacyPath, id }) => {
    const router = createAppRouter([legacyPath]);
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
      expect(router.state.location.hash).toBe(`#${id}`);
      expect(router.state.historyAction).toBe("REPLACE");
    });
  },
);
```

Keep the `/` and not-found coverage. The `/` assertion must still require exactly one `h1`.

- [ ] **Step 2: Run the router test and confirm it fails**

Run:

```bash
npx vitest run src/app/router.test.tsx
```

Expected: FAIL for Research, Cooperation, and Students because those routes still render `DeferredPage`.

- [ ] **Step 3: Generate redirect routes from the registry**

Simplify `src/app/router.tsx`:

```tsx
const children = [
  { index: true as const, element: <HomePage /> },
  ...legacyLandingSections.map(({ legacyPath, id }) => ({
    path: legacyPath.slice(1),
    element: <Navigate to={landingHref(id)} replace />,
  })),
  { path: "*", element: <NotFoundPage /> },
];
```

Remove `pageByKey`, `RouteKey`, and `DeferredPage` imports. Remove `src/app/DeferredPage.tsx` only after `rg "DeferredPage" src` proves it has no consumers.

- [ ] **Step 4: Re-run the router test**

Run:

```bash
npx vitest run src/app/router.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit route compatibility**

```bash
git add src/app/router.tsx src/app/router.test.tsx src/app/DeferredPage.tsx
git commit -m "feat: redirect legacy routes to landing anchors"
```

If `DeferredPage.tsx` remains referenced, omit it from the commit and do not delete it.

## Task 4: Implement header-aware scrolling and visible-section tracking

**Files:**

- Modify: `src/lib/scrollToSection.ts`
- Create: `src/lib/scrollToSection.test.ts`
- Create: `src/hooks/useActiveSection.ts`
- Create: `src/hooks/useActiveSection.test.tsx`
- Modify: `src/components/layout/ScrollToTop.tsx`
- Modify: `src/test/setup.ts`

- [ ] **Step 1: Write failing scroll behavior tests**

Create `src/lib/scrollToSection.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";
import { scrollToSection } from "./scrollToSection";

describe("scrollToSection", () => {
  beforeEach(() => {
    document.body.innerHTML = '<section id="nghien-cuu"></section>';
    vi.spyOn(window.history, "replaceState");
    vi.spyOn(document.documentElement, "clientWidth", "get").mockReturnValue(1280);
  });

  it("uses the 120px desktop header offset and replaces the hash", () => {
    vi.spyOn(document.getElementById("nghien-cuu")!, "getBoundingClientRect").mockReturnValue({
      top: 500,
    } as DOMRect);
    Object.defineProperty(window, "scrollY", { configurable: true, value: 100 });
    const scroll = vi.spyOn(window, "scrollTo");

    scrollToSection("nghien-cuu");

    expect(scroll).toHaveBeenCalledWith({ top: 480, behavior: "smooth" });
    expect(window.history.replaceState).toHaveBeenCalledWith(null, "", "/#nghien-cuu");
  });

  it("falls back to the top for an unknown section", () => {
    const scroll = vi.spyOn(window, "scrollTo");
    scrollToSection("khong-ton-tai");
    expect(scroll).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
```

- [ ] **Step 2: Write a failing observer hook test**

Create `src/hooks/useActiveSection.test.tsx`. Install a callback-capturing `IntersectionObserver` mock and assert that the nearest intersecting approved section becomes active:

```tsx
function Probe() {
  const active = useActiveSection();
  return <output>{active}</output>;
}

it("selects the visible approved section", () => {
  document.body.innerHTML = landingSections
    .map(({ id }) => `<section id="${id}"></section>`)
    .join("");
  render(<Probe />, { wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter> });

  act(() => {
    observerCallback([entry("ve-chung-toi", false, 0), entry("nghien-cuu", true, 140)]);
  });

  expect(screen.getByText("nghien-cuu")).toBeInTheDocument();
});
```

- [ ] **Step 3: Run the new tests and confirm they fail**

Run:

```bash
npx vitest run src/lib/scrollToSection.test.ts src/hooks/useActiveSection.test.tsx
```

Expected: FAIL because the current helper uses a fixed 88px offset, pushes history, silently returns for unknown IDs, and the hook does not exist.

- [ ] **Step 4: Implement scrolling without layout polling**

In `src/lib/scrollToSection.ts`, derive the offset from the desktop breakpoint:

```ts
const headerOffset = () => (window.matchMedia("(min-width: 1024px)").matches ? 120 : 64);

export function scrollToSection(sectionId: string, behavior: ScrollBehavior = "smooth") {
  const element = document.getElementById(sectionId);
  if (!element) {
    window.scrollTo({ top: 0, behavior });
    window.history.replaceState(null, "", "/");
    return;
  }

  const top = element.getBoundingClientRect().top + window.scrollY - headerOffset();
  window.scrollTo({ top, behavior });
  window.history.replaceState(null, "", `/#${sectionId}`);
}
```

Update `ScrollToTop.tsx` to call this helper after landing-page hash navigation and to use `"auto"` on initial/redirect navigation. Do not add a window scroll listener.

- [ ] **Step 5: Implement `useActiveSection`**

Observe only IDs from `landingSections`, with a root margin that accounts for the fixed header. Choose the intersecting entry nearest the header; disconnect on cleanup. Return `undefined` outside `/` and do not mutate the URL from the observer.

```ts
export function useActiveSection() {
  const { pathname } = useLocation();
  const [active, setActive] = useState<LandingSectionId>();

  useEffect(() => {
    if (pathname !== "/") return;
    const elements = landingSections
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));
    const observer = new IntersectionObserver(
      (entries) => {
        const nearest = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)[0];
        if (nearest) setActive(nearest.target.id as LandingSectionId);
      },
      { rootMargin: "-120px 0px -55% 0px", threshold: [0, 0.15, 0.5] },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  return active;
}
```

Use a mobile-specific root margin if the implementation proves necessary; it must still be observer-based. Upgrade the test mock in `src/test/setup.ts` with the methods used by the hook.

- [ ] **Step 6: Re-run focused tests**

Run:

```bash
npx vitest run src/lib/scrollToSection.test.ts src/hooks/useActiveSection.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit scroll and observation behavior**

```bash
git add src/lib/scrollToSection.ts src/lib/scrollToSection.test.ts src/hooks/useActiveSection.ts src/hooks/useActiveSection.test.tsx src/components/layout/ScrollToTop.tsx src/test/setup.ts
git commit -m "feat: add landing scroll and active section behavior"
```

## Task 5: Rebuild header, navigation, and footer around section anchors

**Files:**

- Modify: `src/components/ui/NavPill.tsx`
- Modify: `src/components/navigation/DesktopNav.tsx`
- Modify: `src/components/navigation/MobileNav.tsx`
- Modify: `src/components/navigation/navigation.test.tsx`
- Modify: `src/components/navigation/LanguageSwitcher.tsx`
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Header.test.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/layout/PageLayout.test.tsx`

- [ ] **Step 1: Write failing navigation and header tests**

Update `src/components/navigation/navigation.test.tsx` to require:

```tsx
it("renders all seven desktop section links and marks the observed one", () => {
  render(<DesktopNav activeSection="nghien-cuu" />, { wrapper: MemoryWrapper });
  expect(screen.getAllByRole("link")).toHaveLength(7);
  expect(screen.getByRole("link", { name: "Tin tức" })).toHaveAttribute("href", "/#tin-tuc");
  expect(screen.getByRole("link", { name: "Nghiên cứu" })).toHaveAttribute(
    "aria-current",
    "location",
  );
});

it("closes the mobile menu before scrolling to a section", async () => {
  const user = userEvent.setup();
  render(<MobileNav activeSection="tin-tuc" />, { wrapper: MemoryWrapper });
  await user.click(screen.getByRole("button", { name: "Mở menu" }));
  await user.click(screen.getByRole("link", { name: "Về chúng tôi" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
```

Keep Escape/focus restoration coverage and assert seven mobile links.

Replace the old transparent-overlay expectations in `Header.test.tsx` with:

```tsx
expect(screen.getByTestId("header-brand-tier")).toHaveClass("lg:h-[72px]", "bg-aic-navy");
expect(screen.getByTestId("header-nav-tier")).toHaveClass("lg:h-12", "bg-white");
expect(container.querySelector("header")).toHaveClass("fixed");
expect(screen.getByRole("img", { name: "Logo AIC" })).toBeInTheDocument();
expect(screen.getByText(siteContent.identity.name)).toBeInTheDocument();
```

- [ ] **Step 2: Run the focused tests and confirm they fail**

Run:

```bash
npx vitest run src/components/navigation/navigation.test.tsx src/components/layout/Header.test.tsx src/components/layout/PageLayout.test.tsx
```

Expected: FAIL because navigation still consumes route pages, the header is one tier, and News is absent.

- [ ] **Step 3: Make `NavPill` an explicit section link**

Replace route-derived active logic with explicit props:

```tsx
export function NavPill({
  sectionId,
  active = false,
  children,
  onClick,
}: {
  sectionId: LandingSectionId;
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  const { pathname } = useLocation();
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.();
    if (pathname !== "/") return;
    event.preventDefault();
    scrollToSection(sectionId);
  };

  return (
    <Link
      to={landingHref(sectionId)}
      aria-current={active ? "location" : undefined}
      onClick={handleClick}
      className={cn(/* current focus/hover treatment */, active && "bg-aic-blue text-white")}
    >
      {children}
    </Link>
  );
}
```

Use one visual tone for the white desktop navigation tier. Keep a visible non-color active cue such as font weight plus inset ring/border.

- [ ] **Step 4: Make desktop, mobile, and Footer consume `landingSections`**

Give `DesktopNav` and `MobileNav` an optional `activeSection` prop and map the shared registry. Mobile calls `setOpen(false)` before the pill scroll handler runs.

In `Footer.tsx`, keep current markup/content and replace route links with:

```tsx
function FooterNavigation() {
  return (
    <>
      {landingSections.map((section) => (
        <Link key={section.id} to={landingHref(section.id)}>
          {navigationLabels[section.key]}
        </Link>
      ))}
    </>
  );
}
```

Remove `font-serif` from the Footer brand.

- [ ] **Step 5: Implement the two-tier fixed header**

Use `useActiveSection()` once in `Header` and pass it to both navigation variants. Desktop structure:

```tsx
<header className="fixed inset-x-0 top-0 z-40 w-full">
  <div data-testid="header-brand-tier" className="h-16 bg-aic-navy lg:h-[72px]">
    <PageContainer className="flex h-full items-center justify-between">
      <Link to="/" aria-label="AIC">
        {/* logo + short name */}
      </Link>
      <p className="hidden text-center text-sm font-bold text-white lg:block">
        {siteContent.identity.name}
      </p>
      <LanguageSwitcher overlay />
      <MobileNav activeSection={activeSection} />
    </PageContainer>
  </div>
  <div
    data-testid="header-nav-tier"
    className="hidden border-b bg-white shadow-soft lg:block lg:h-12"
  >
    <PageContainer className="flex h-full items-center justify-center">
      <DesktopNav activeSection={activeSection} />
    </PageContainer>
  </div>
</header>
```

Do not retain the home hero transparent-overlay scroll listener. Ensure the language control is not duplicated on mobile because the mobile menu already contains VN/EN.

Update the main-content top offset in `PageLayout` only if the hero/header composition needs it. The landing hero must begin behind neither the 64px mobile bar nor the 120px desktop header.

- [ ] **Step 6: Re-run navigation and layout tests**

Run:

```bash
npx vitest run src/components/navigation/navigation.test.tsx src/components/layout/Header.test.tsx src/components/layout/PageLayout.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit navigation shell changes**

```bash
git add src/components/ui/NavPill.tsx src/components/navigation/DesktopNav.tsx src/components/navigation/MobileNav.tsx src/components/navigation/navigation.test.tsx src/components/navigation/LanguageSwitcher.tsx src/components/layout/Header.tsx src/components/layout/Header.test.tsx src/components/layout/Footer.tsx src/components/layout/PageLayout.test.tsx
git commit -m "feat: add two-tier landing navigation shell"
```

## Task 6: Compose all approved content into `HomePage`

**Files:**

- Modify: `src/pages/ResearchPage.tsx`
- Modify: `src/pages/CooperationPage.tsx`
- Modify: `src/pages/StudentsPage.tsx`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/app/router.test.tsx`
- Modify: `src/pages/page-layouts.test.tsx`

- [ ] **Step 1: Write a failing home-order regression test**

Replace the old “without generic page previews” assertion in `src/app/router.test.tsx`:

```tsx
it("renders the approved single landing hierarchy", () => {
  const { container } = render(<RouterProvider router={createAppRouter(["/"])} />);
  expect(
    Array.from(container.querySelectorAll("[data-landing-section]")).map((section) => section.id),
  ).toEqual([
    "tin-tuc",
    "ve-chung-toi",
    "to-chuc",
    "nghien-cuu",
    "hop-tac",
    "sinh-vien",
    "lien-he",
  ]);
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
});
```

Add focused embedded-mode tests to `src/pages/page-layouts.test.tsx`:

```tsx
it.each([
  [<ResearchPage embedded />, siteContent.pages.research.title],
  [<CooperationPage embedded />, siteContent.pages.cooperation.title],
  [<StudentsPage embedded />, siteContent.pages.students.title],
])("renders %s with an h2 and no nested h1", (page, title) => {
  render(page, { wrapper: MemoryWrapper });
  expect(screen.getByRole("heading", { level: 2, name: title })).toBeInTheDocument();
  expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the focused tests and confirm they fail**

Run:

```bash
npx vitest run src/app/router.test.tsx src/pages/page-layouts.test.tsx
```

Expected: FAIL because the three full content areas are absent from Home and page components do not support `embedded`.

- [ ] **Step 3: Add embedded rendering without copying content**

Add `embedded?: boolean` to the three page components.

For `ResearchPage`, render `PageHero` only in standalone mode. In embedded mode render a standard `SectionHeading` using `actualContent.pages.research.title` and `.description`, then keep the existing three directions, four metrics, seven groups, and CTA unchanged.

For `CooperationPage`, replace the video/page-hero block with a standard `SectionHeading` in embedded mode; keep the current cooperation cards, international band, all eight `Logo 1`–`Logo 8` records, partner presentation, and mail CTA.

For `StudentsPage`, replace `StudentHero` with a standard `SectionHeading` in embedded mode; keep both labs, benefits/media frames, five process steps, and mail CTA.

The embedded heading component must render `h2`, never `h1`. Do not change the centralized data records.

- [ ] **Step 4: Compose the approved order in `HomePage`**

Wrap each navigation target with both `id` and `data-landing-section`:

```tsx
<div id="tin-tuc" data-landing-section className="scroll-mt-[var(--landing-header-offset)]">
  <HomeNews />
</div>
{/* existing About and Organization */}
<div id="nghien-cuu" data-landing-section>
  <ResearchPage embedded />
</div>
<div id="hop-tac" data-landing-section>
  <CooperationPage embedded />
</div>
<div id="sinh-vien" data-landing-section>
  <StudentsPage embedded />
</div>
{/* existing Contact */}
```

Apply the same `data-landing-section` attribute to About, Organization, and Contact. Do not wrap entire embedded page components in nested `Reveal` if their child sections already use the existing reveal behavior.

Update `DynamicHero` CTA destinations to `landingHref("nghien-cuu")` and `landingHref("sinh-vien")`; on `/`, use the shared scroll helper.

- [ ] **Step 5: Preserve internal anchors without ID collisions**

Keep current internal IDs such as `research-groups`, `cooperation-fields`, and `research-space`. Use global `rg 'id="' src` plus a rendered DOM assertion to confirm no duplicate IDs on Home.

Add:

```tsx
const ids = Array.from(container.querySelectorAll("[id]"), (node) => node.id);
expect(new Set(ids).size).toBe(ids.length);
```

- [ ] **Step 6: Re-run page tests**

Run:

```bash
npx vitest run src/app/router.test.tsx src/pages/page-layouts.test.tsx
```

Expected: PASS, with exactly one landing-page `h1`.

- [ ] **Step 7: Commit the landing composition**

```bash
git add src/pages/ResearchPage.tsx src/pages/CooperationPage.tsx src/pages/StudentsPage.tsx src/pages/HomePage.tsx src/app/router.test.tsx src/pages/page-layouts.test.tsx
git commit -m "feat: compose approved content into one landing page"
```

## Task 7: Apply the approved About layout and clipped staff zoom

**Files:**

- Modify: `src/components/sections/HomeAbout.tsx`
- Modify: `src/components/cards/PersonCard.tsx`
- Modify: `src/components/cards/cards-behavior.test.tsx`
- Modify: `src/app/router.test.tsx`

- [ ] **Step 1: Write failing About and portrait behavior tests**

Replace obsolete overlap-layout assertions with:

```tsx
it("uses intro left and vertically stacked vision and mission right", () => {
  render(<RouterProvider router={createAppRouter(["/"])} />);
  const about = screen.getByTestId("home-about");
  expect(within(about).queryByTestId("about-side-media")).not.toBeInTheDocument();
  expect(within(about).getByTestId("about-layout")).toHaveClass("lg:grid-cols-[.9fr_1.1fr]");
  expect(within(about).getByTestId("about-principles")).toHaveClass("grid-cols-1");
  expect(screen.getByTestId("home-video")).toBeInTheDocument();
});
```

Add to `src/components/cards/cards-behavior.test.tsx`:

```tsx
it.each(["director", "teacher"] as const)(
  "clips the %s portrait and scales its image to exactly 1.2 on hover",
  (variant) => {
    const { container } = render(<PersonCard person={personWithImage} variant={variant} />);
    const portrait = container.querySelector("[data-person-portrait]");
    expect(portrait).toHaveClass("overflow-hidden");
    expect(portrait?.className).toContain("group-hover:[&_img]:scale-[1.2]");
    expect(portrait?.className).toContain("motion-reduce:[&_img]:transform-none");
  },
);
```

- [ ] **Step 2: Run the focused tests and confirm they fail**

Run:

```bash
npx vitest run src/app/router.test.tsx src/components/cards/cards-behavior.test.tsx
```

Expected: FAIL because About still has a right media panel/overlap and portraits do not zoom.

- [ ] **Step 3: Rebuild About without its side media frame**

In `HomeAbout.tsx`, remove the `neutral-visual` sibling. Use:

```tsx
<div
  data-testid="about-layout"
  className="grid overflow-hidden rounded-media border border-aic-line bg-white shadow-soft lg:grid-cols-[.9fr_1.1fr]"
>
  <div className="p-6 sm:p-9 lg:p-12">{/* heading + intro */}</div>
  <div data-testid="about-principles" className="grid grid-cols-1 gap-4 p-6 sm:p-9 lg:p-12">
    {/* vision, then mission */}
  </div>
</div>
```

Do not edit or move the separate `VideoFrame` section below it.

- [ ] **Step 4: Add one reusable portrait-motion class**

In `PersonPortrait`, add `data-person-portrait` and:

```tsx
const staffPortraitMotion =
  "overflow-hidden [&_img]:transition-transform [&_img]:duration-300 group-hover:[&_img]:scale-[1.2] motion-reduce:[&_img]:transform-none";
```

Apply it only when `variant` is `director` or `teacher`; pass an explicit `zoom` flag into `PersonPortrait`. Keep student portraits unchanged because the approved request specifically concerns staff.

- [ ] **Step 5: Re-run focused tests**

Run:

```bash
npx vitest run src/app/router.test.tsx src/components/cards/cards-behavior.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit the approved local layout changes**

```bash
git add src/components/sections/HomeAbout.tsx src/components/cards/PersonCard.tsx src/components/cards/cards-behavior.test.tsx src/app/router.test.tsx
git commit -m "style: refine about and staff portrait interactions"
```

## Task 8: Preserve bilingual content and clear all known lint defects

**Files:**

- Create: `src/contexts/language.ts`
- Create: `src/contexts/LanguageProvider.tsx`
- Delete: `src/contexts/LanguageContext.tsx`
- Modify: all imports returned by `rg "contexts/LanguageContext" src`
- Modify: `src/components/sections/DynamicHero.tsx`
- Modify: `src/components/ui/Reveal.tsx`
- Modify: `src/components/sections/OrganizationContent.tsx`
- Modify: `src/content/stitch.ts`
- Modify: `src/content/site.ts`
- Modify: `src/pages/ContactPage.tsx`
- Modify: `src/content/site.test.tsx` or the existing language integration test

- [ ] **Step 1: Add a failing bilingual landing integration test**

In the existing language/content integration test, render `/`, switch to English, and assert representative content from every layer changes together:

```tsx
expect(screen.getByRole("link", { name: "Tin tức" })).toBeInTheDocument();
await user.click(screen.getByRole("button", { name: "English language" }));
expect(screen.getByRole("link", { name: "News" })).toBeInTheDocument();
expect(
  screen.getByRole("heading", { name: siteContentEn.pages.research.title }),
).toBeInTheDocument();
expect(
  screen.getByRole("heading", { name: siteContentEn.pages.cooperation.title }),
).toBeInTheDocument();
expect(
  screen.getByRole("heading", { name: siteContentEn.pages.students.title }),
).toBeInTheDocument();
```

Do not add translated copy inside the test or JSX; use the existing English dataset.

- [ ] **Step 2: Run the integration test and lint**

Run:

```bash
npx vitest run src/content/site.test.tsx
npm run lint
```

Expected: language integration may fail for newly embedded headings; ESLint reports the known React hook/refresh, unused import/prop, and explicit `any` errors.

- [ ] **Step 3: Split context definitions from the provider component**

Create `src/contexts/language.ts` with `Language`, `LanguageContext`, and `useLanguage`. Create `src/contexts/LanguageProvider.tsx` exporting only `LanguageProvider`. Update `src/main.tsx`, content hooks, `LanguageSwitcher`, and `MobileNav` imports. Delete `LanguageContext.tsx` after:

```bash
rg "LanguageContext" src
```

shows no old imports.

- [ ] **Step 4: Fix reduced-motion effects without synchronous effect state updates**

In `DynamicHero.tsx`, initialize preference state lazily and let the effect only subscribe:

```ts
const reducedMotionQuery = () => window.matchMedia("(prefers-reduced-motion: reduce)");
const [prefersReducedMotion, setPrefersReducedMotion] = useState(
  () => reducedMotionQuery().matches,
);

useEffect(() => {
  const query = reducedMotionQuery();
  const update = () => setPrefersReducedMotion(query.matches);
  query.addEventListener("change", update);
  return () => query.removeEventListener("change", update);
}, []);
```

Do not start the phrase interval when reduced motion is enabled. Apply the same lazy-initial-state pattern to `Reveal.tsx`; its effect should only observe and clean up.

- [ ] **Step 5: Remove the remaining lint errors without weakening rules**

- Remove the unused `PageContainer` import from `OrganizationContent.tsx`.
- Extend `StitchContent` in `src/content/stitch.ts` with an optional typed contact override and replace `(demo as any).contact` in `src/content/site.ts` with `demo.contact`.
- Remove the unused `scaffoldMode` binding from `ContactPage.tsx`; preserve the current Home contact cards, map, and no-form behavior.
- Do not add ESLint disable comments and do not exclude `src` from lint.

- [ ] **Step 6: Re-run language test and lint**

Run:

```bash
npx vitest run src/content/site.test.tsx
npm run lint
```

Expected: PASS, with zero lint warnings/errors.

- [ ] **Step 7: Commit language and quality cleanup**

```bash
git add src/contexts src/main.tsx src/components src/content src/pages/ContactPage.tsx
git commit -m "fix: preserve bilingual landing behavior and lint cleanly"
```

Review `git diff --cached --stat` before committing so generated files are not included.

## Task 9: Reconcile the retained content/media regression suite

**Files:**

- Modify: `src/pages/page-layouts.test.tsx`
- Modify: `src/pages/ContactPage.test.tsx`
- Modify: `src/components/media/MapFrame.test.tsx`
- Modify: `src/components/media/media-behavior.test.tsx`
- Modify: `src/components/cards/cards-behavior.test.tsx`
- Modify: `src/content/stitch.test.ts`
- Modify: any additional failing test identified by the full run
- Do not modify centralized content records unless a test exposes a genuine mismatch with the approved specification

- [ ] **Step 1: Run the complete test suite and classify failures**

Run:

```bash
npm test
```

Expected at the start of this task: failures from stale multi-page, prototype-removal, typography, map, or layout expectations. Record each failing test against the approved specification before editing it.

- [ ] **Step 2: Preserve approved current data with positive assertions**

Ensure tests explicitly retain:

```ts
expect(siteContent.news).toHaveLength(3);
expect(siteContent.research.directions).toHaveLength(3);
expect(siteContent.research.metrics).toHaveLength(4);
expect(siteContent.research.groups).toHaveLength(7);
expect(siteContent.cooperation.partners.map(({ name }) => name)).toEqual(
  Array.from({ length: 8 }, (_, index) => `Logo ${index + 1}`),
);
expect(siteContent.students.labs).toHaveLength(2);
expect(siteContent.students.joinSteps).toHaveLength(5);
```

Keep the current director, lecturer, Scientific Council, and student-leader assertions. Do not replace records merely to satisfy an old test.

- [ ] **Step 3: Update stale layout expectations only**

Remove assertions that require:

- separate Research, Cooperation, or Students page navigation;
- the removed About side media panel or overlap;
- Merriweather or Google Fonts;
- prototype content to be absent when the approved specification explicitly keeps it;
- a contact form.

Keep or add assertions for:

- three Contact cards and the current map behavior;
- no Contact form;
- the separate About introduction video;
- semantic neutral frames for missing factual media;
- all eight temporary partner labels;
- mailto CTAs for Cooperation and Students;
- reduced-motion static partner layout;
- one landing-page `h1`;
- unique DOM IDs.

- [ ] **Step 4: Run the complete suite until green**

Run:

```bash
npm test
```

Expected: all tests PASS. Fix production behavior when the test reveals a real defect; change a test only when it contradicts the approved specification.

- [ ] **Step 5: Commit the regression alignment**

```bash
git add src
git diff --cached --check
git commit -m "test: align regressions with approved landing content"
```

Do not stage `tsconfig.app.tsbuildinfo`, `.superpowers/`, screenshots, or unrelated user files.

## Task 10: Verify responsive behavior, SPA fallback, and final quality gates

**Files:**

- Modify: `nginx.conf` only if direct-refresh inspection shows SPA fallback is missing
- Modify: `Dockerfile` only if the existing build path fails
- Modify: source/tests only for defects found by verification
- Do not deploy

- [ ] **Step 1: Run all automated quality gates**

Run in this order:

```bash
npm test
npm run lint
npm run build
npm run format
```

Expected: all four commands exit 0. If `npm run format` fails, run `npm run format:write`, inspect the diff, then run all four gates again.

- [ ] **Step 2: Start the production-like local site**

Run:

```bash
npm run dev -- --host 127.0.0.1
```

Expected: Vite prints a local URL and the page loads without console errors.

- [ ] **Step 3: Perform browser checks in Vietnamese and English**

At 320px, 375px, tablet, and desktop widths verify:

- no horizontal overflow;
- the fixed header does not cover section headings or focused links;
- desktop shows the 72px + 48px two-tier header;
- mobile shows one 64px header and the hamburger;
- all seven navigation links reach the correct section;
- active navigation follows the visible section;
- the mobile menu closes on selection and Escape restores focus;
- VN/EN updates navigation, headings, CTAs, and retained content;
- About has no right media panel and the lower introduction video remains;
- staff portraits clip the exact `1.2` hover zoom;
- Hero, three News cards, all Organization groups, full Research, Cooperation, Students, Contact, and Footer render in approved order;
- reduced-motion emulation stops nonessential motion without hiding content.

Capture full-page desktop and mobile screenshots for both languages outside tracked source directories. Do not add `.superpowers/` or screenshots to commits.

- [ ] **Step 4: Verify direct refresh and legacy SPA fallback**

Inspect `nginx.conf` for:

```nginx
try_files $uri $uri/ /index.html;
```

With the local production container if Docker is available, request `/` and every legacy path. Each must serve the SPA, then replace to the correct hash client-side.

Run:

```bash
docker build -t aic-haui-web:local .
docker run --rm -p 8080:80 aic-haui-web:local
```

In a second terminal, check:

```bash
curl -I http://127.0.0.1:8080/
curl -I http://127.0.0.1:8080/nghien-cuu
curl -I http://127.0.0.1:8080/hop-tac
curl -I http://127.0.0.1:8080/sinh-vien
```

Expected: HTTP 200 for the SPA entry. Stop the temporary container after verification. If Docker is unavailable, report that environmental limitation and still verify `nginx.conf` statically.

- [ ] **Step 5: Inspect the final diff and commit verification fixes**

Run:

```bash
git status --short
git diff --check
git diff --stat
```

Confirm there are no invented facts, new generated institutional images, remote font dependencies, or production deployment changes.

If verification required source fixes:

```bash
git add <only-the-reviewed-files>
git commit -m "fix: resolve final landing verification issues"
```

- [ ] **Step 6: Final completion evidence**

Report:

- exact passing counts from `npm test`;
- zero-warning result from `npm run lint`;
- successful production build;
- successful Prettier check;
- browser widths/languages reviewed;
- SPA fallback result;
- any environmental limitation;
- confirmation that no production deployment was performed.
