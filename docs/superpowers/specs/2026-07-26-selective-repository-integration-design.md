# Selective repository integration design

## Goal

Combine the approved AIC landing-page implementation and the collaborator's work
into one maintained repository without losing either history, importing
unverified institutional content, or regressing the approved interface.

The approved repository at `E:\aic-haui-web-phamhoan2708`, commit `45d46f6`, is
the integration base. The collaborator repository currently located at
`E:\aic-haui-web-phamhoan2708\aic-haui-web\aic-haui-web`, commit `f23ee9d`, is
treated as a source of selected ideas rather than as a branch to merge wholesale.

## Preservation strategy

Before integration work:

1. Create a preservation branch in the collaborator repository.
2. Commit its two current working-tree changes,
   `src/components/layout/Header.tsx` and `src/pages/HomePage.tsx`, to that
   preservation branch with a clearly labelled snapshot commit.
3. Confirm that the collaborator repository has no remaining uncommitted
   changes.
4. Move the collaborator repository to a sibling directory outside the approved
   repository. This prevents Git, Vitest, ESLint, and Prettier from traversing
   both codebases as if they were one project.
5. Confirm both repositories and their histories remain readable after the
   move.

No history is deleted, rebased, or force-pushed during preservation.

## Integration architecture

Create a dedicated integration branch from `45d46f6`. The approved repository
remains the single runnable application and the future source of truth.

Do not merge or cherry-pick the collaborator's three commits as complete units.
They overlap nineteen committed paths with the approved implementation and also
contain generated files, obsolete landing-page architecture, and unverified
content. Instead, inspect and reimplement each approved visual improvement in a
small, isolated commit.

The collaborator repository remains available beside the approved repository as
a reference and recovery source. Its history does not need to become part of the
application's main Git history to preserve its work.

## Included scope

Only the following collaborator ideas are candidates for the first integration:

- Relevant icons for research and student cards.
- Card-layout refinements that preserve existing content, responsive behaviour,
  typography, colours, spacing contract, and accessibility.
- Lightweight card presentation effects that respect
  `prefers-reduced-motion` and do not delay access to the page.
- The collaborator's brain-network opening visual, reimplemented as one
  self-contained preloader without duplicated assets or unused animation code.

Each candidate is included only when it is compatible with the current design
contract and passes the existing tests.

## Explicitly excluded scope

The first integration does not include:

- The collaborator's uncommitted header redesign.
- The extra section headings in the collaborator's uncommitted home page.
- The collaborator's duplicated brain-network SVG, unused drawing hook, and
  unused Tailwind animation declarations.
- Research tags, group sizes, or any other institutional facts not confirmed by
  the user.
- Google Fonts or Merriweather.
- The collaborator's router, hash-navigation, embedded-page, button-link, or
  header-offset implementations, because the approved repository already has
  tested replacements.
- The collaborator's `DESIGN.md`, generated `tsconfig.app.tsbuildinfo`, or
  unrelated formatting changes.
- Direct changes to approved staff, news, contact, bilingual content, or the
  two-tier desktop header.

## Implementation boundaries

Card content continues to come from the approved content model. Presentation
components may gain icons or layout refinements, but they must not introduce new
facts into that model.

Navigation continues to use the approved landing-section registry,
active-section observer, primary-click handling, and CSS header-offset variable.
The approved self-hosted Be Vietnam Pro font and current design tokens remain
authoritative.

Every integration commit should represent one coherent visual change so it can
be reviewed or reverted independently.

## Opening preloader

On every full page load, show the collaborator's brain-network visual as a
full-screen preloader for 4.5 seconds before revealing the landing page. While
the preloader is active, lock document scrolling and prevent interaction with
the page behind it. At the end of the interval, fade the preloader out, restore
the previous document overflow value, and unmount it.

The preloader has no audio and introduces no institutional copy or facts. Its
visual is implemented from one source of truth; do not keep both a duplicated
inline path and an unused public SVG, and do not bring over the collaborator's
unused drawing hook or unused Tailwind keyframes.

If `prefers-reduced-motion: reduce` matches when the application loads, bypass
the preloader immediately. Do not display a static 4.5-second waiting screen for
reduced-motion users. The component must also restore document state when it
unmounts early or during a test.

## Failure handling and rollback

- If the collaborator's dirty snapshot cannot be committed, stop before moving
  its directory and report the exact Git error.
- If the destination sibling directory already exists, stop and request a new
  destination rather than overwriting it.
- If a selected visual change breaks an approved test or requirement, remove
  that change from the integration branch instead of weakening the requirement.
- The original approved branch, the collaborator preservation branch, and the
  remote backup branches remain untouched, providing independent rollback
  points.

## GitHub publication

After the integrated application passes every verification gate and the user
approves the resulting interface:

1. Create the public repository `ninhhh1011/aic-haui-web`.
2. Rename the existing `origin` remote to a descriptive backup name so its URL
   and history remain available.
3. Add `https://github.com/ninhhh1011/aic-haui-web.git` as the new `origin`.
4. Publish the verified integrated result as the new repository's `main` branch
   without force-pushing.
5. Publish the collaborator preservation branch under an `archive/` branch name
   so the collaborator's original commits and dirty-worktree snapshot remain
   recoverable from the same GitHub repository.
6. Confirm the public repository URL, default branch, remote configuration, and
   published commit identifiers.

Repository creation is attempted only while GitHub CLI is authenticated as
`ninhhh1011`. If that identity or its permissions change, stop and report the
authentication problem instead of creating the repository under another owner.
The existing GitHub repository is not deleted or overwritten.

## Verification

After preservation:

- Both repositories report clean working trees.
- The approved repository no longer reports the collaborator directory as
  untracked.
- Commit histories and preservation commits can be inspected in both
  repositories.

After each selected integration:

- Run the relevant focused tests first.
- Run the complete existing test suite.
- Run ESLint with zero warnings.
- Run Prettier in check mode.
- Run TypeScript and the production build.
- Inspect the affected cards at desktop and mobile widths and confirm keyboard
  focus and reduced-motion behaviour.
- Verify the preloader remains mounted before 4.5 seconds, releases the page
  after the interval, locks and restores document overflow, cleans up its timer,
  and bypasses itself when reduced motion is requested.
- Inspect the preloader at desktop and mobile widths, confirm the landing page
  is not interactable while it is active, and confirm no console errors occur
  during its transition.

After publication:

- Confirm `ninhhh1011/aic-haui-web` is public.
- Confirm `main` points to the verified integrated commit.
- Confirm the collaborator snapshot exists under its archive branch.
- Confirm a fresh remote query can read both branches without relying on local
  Git state.

The integration is complete only when all gates pass and the user approves the
resulting interface.
