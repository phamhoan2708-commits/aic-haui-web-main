import { describe, expect, it } from "vitest";

import { composeSiteContent, mergeRecordsById } from "./site";
import { stitchContent } from "./stitch";
import type { StitchContent } from "./stitch";
import { stitchContentEn } from "./stitchEn";
import type { ContentSource, ResearchItem, SiteContent } from "./types";
import { verifiedSiteContentEn, verifiedSiteContentVi } from "./verified";

function deepFreeze(value: unknown): void {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return;

  Object.freeze(value);
  Object.values(value).forEach(deepFreeze);
}

function verifiedPair<T extends { id: string }>(records: readonly T[]): T[] {
  const shared = records[0];
  if (!shared) throw new Error("Synthetic collection requires one demo record");

  return [
    { ...shared, source: "verified" },
    { ...shared, id: `verified-only-${shared.id}`, source: "verified" },
  ] as T[];
}

function expectVerifiedMerge(
  actual: readonly { id: string; source?: string }[],
  demo: readonly { id: string }[],
): void {
  expect(actual.map(({ id }) => id)).toEqual([
    ...demo.map(({ id }) => id),
    `verified-only-${demo[0].id}`,
  ]);
  expect(actual[0].source).toBe("verified");
  expect(actual.at(-1)?.source).toBe("verified");
}

describe("site content composition API", () => {
  it("exports a pure verified-first composer", async () => {
    const siteModule = await import("./site");

    expect(siteModule).toHaveProperty("composeSiteContent");
    expect(siteModule).toHaveProperty("mergeRecordsById");
  });

  it("replaces matching IDs, preserves demo order, and appends verified-only records", () => {
    type LabelledRecord = { id: string; label: string; source?: ContentSource };
    const verified: LabelledRecord[] = [
      { id: "shared", label: "Verified shared", source: "verified" as const },
      { id: "verified-only", label: "Verified only", source: "verified" as const },
    ];
    const demo: LabelledRecord[] = [
      { id: "shared", label: "Demo shared", source: "stitch" as const },
      { id: "demo-only", label: "Demo only", source: "stitch" as const },
    ];

    expect(mergeRecordsById(verified, demo)).toEqual([verified[0], demo[1], verified[1]]);
    expect(mergeRecordsById(verified, demo)[0]).not.toBe(verified[0]);
  });

  it("ignores source-less candidates for generic verified collection replacement", () => {
    type LabelledRecord = { id: string; label: string; source?: ContentSource };
    const candidates: LabelledRecord[] = [
      { id: "shared", label: "Unlabelled shared" },
      { id: "unlabelled-only", label: "Unlabelled only" },
      { id: "verified-only", label: "Verified only", source: "verified" as const },
    ];
    const demo: LabelledRecord[] = [
      { id: "shared", label: "Demo shared", source: "stitch" as const },
      { id: "demo-only", label: "Demo only", source: "stitch" as const },
    ];

    expect(mergeRecordsById(candidates, demo)).toEqual([demo[0], demo[1], candidates[2]]);
  });

  it("composes verified replacements across every runtime collection without mutation", () => {
    const verified: SiteContent = structuredClone(verifiedSiteContentVi);
    const demo: StitchContent = structuredClone(stitchContent);
    const syntheticResult: ResearchItem & { source: "stitch" } = {
      id: "result-shared",
      title: "Demo result",
      description: "Demo result description",
      source: "stitch",
    };
    const syntheticActivity: ResearchItem & { source: "stitch" } = {
      id: "activity-shared",
      title: "Demo activity",
      description: "Demo activity description",
      source: "stitch",
    };

    demo.research.results = [syntheticResult];
    demo.research.activities = [syntheticActivity];
    verified.people = verifiedPair(demo.people);
    verified.research = {
      directions: verifiedPair(demo.research.directions),
      metrics: verifiedPair(demo.research.metrics),
      council: verifiedPair(demo.research.council),
      results: verifiedPair(demo.research.results),
      groups: verifiedPair(demo.research.groups),
      activities: verifiedPair(demo.research.activities),
    };
    verified.cooperation = {
      ...verified.cooperation,
      enterprise: verifiedPair(demo.cooperation.enterprise),
      research: verifiedPair(demo.cooperation.research),
      international: verifiedPair(demo.cooperation.international),
      technologyTransfer: verifiedPair(demo.cooperation.technologyTransfer),
      partners: verifiedPair(demo.cooperation.partners),
    };
    verified.students = {
      ...verified.students,
      labs: verifiedPair(demo.students.labs),
      joinSteps: verifiedPair(demo.students.joinSteps),
    };

    const verifiedSnapshot = structuredClone(verified);
    const demoSnapshot = structuredClone(demo);
    deepFreeze(verified);
    deepFreeze(demo);

    const compose = composeSiteContent as unknown as (
      verifiedSource: SiteContent,
      demoSource: StitchContent,
    ) => SiteContent;
    const result = compose(verified, demo);

    expectVerifiedMerge(result.people, demo.people);
    expectVerifiedMerge(result.research.council ?? [], demo.research.council);
    expectVerifiedMerge(result.research.directions, demo.research.directions);
    expectVerifiedMerge(result.research.metrics ?? [], demo.research.metrics);
    expectVerifiedMerge(result.research.results, demo.research.results);
    expectVerifiedMerge(result.research.groups, demo.research.groups);
    expectVerifiedMerge(result.research.activities, demo.research.activities);
    expectVerifiedMerge(result.cooperation.enterprise, demo.cooperation.enterprise);
    expectVerifiedMerge(result.cooperation.research, demo.cooperation.research);
    expectVerifiedMerge(result.cooperation.international, demo.cooperation.international);
    expectVerifiedMerge(result.cooperation.technologyTransfer, demo.cooperation.technologyTransfer);
    expectVerifiedMerge(result.cooperation.partners, demo.cooperation.partners);
    expectVerifiedMerge(result.students.labs, demo.students.labs);
    expectVerifiedMerge(result.students.joinSteps, demo.students.joinSteps);
    expect(result.identity).toEqual(verified.identity);
    expect(result.about).toEqual(verified.about);
    expect(result.contact).toEqual(verified.contact);
    expect(result.cooperation.contactHref).toBe(verified.cooperation.contactHref);
    expect(result.students.contactHref).toBe(verified.students.contactHref);
    expect(verified).toEqual(verifiedSnapshot);
    expect(demo).toEqual(demoSnapshot);
  });

  it("keeps source-less verified lab names as overlays on Stitch records", () => {
    const result = (
      composeSiteContent as unknown as (
        verifiedSource: SiteContent,
        demoSource: StitchContent,
      ) => SiteContent
    )(verifiedSiteContentVi, stitchContent);

    expect(result.students.labs.map(({ name }) => name)).toEqual([
      "AIC Foundry Lab",
      "AIC Innovation Lab",
    ]);
    expect(result.students.labs.every(({ source }) => source === "stitch")).toBe(true);
    expect(result.students.labs[0].benefits).toEqual(stitchContent.students.labs[0].benefits);
  });

  it("composes English verified and mock content without Vietnamese fallbacks", () => {
    const result = composeSiteContent(verifiedSiteContentEn, stitchContentEn);

    expect(result.hero.title).toBe(stitchContentEn.hero.title);
    expect(result.research.groups).toEqual(stitchContentEn.research.groups);
    expect(result.students.joinSteps).toEqual(stitchContentEn.students.joinSteps);
    expect(result.footer.description).toBe(stitchContentEn.footer.description);
  });

  it("does not publish a source-less verified-only lab", () => {
    const verified: SiteContent = structuredClone(verifiedSiteContentVi);
    verified.students.labs.push({ id: "unlabelled-only", name: "Unlabelled Lab" });

    const result = composeSiteContent(verified, stitchContent);

    expect(result.students.labs.some(({ id }) => id === "unlabelled-only")).toBe(false);
  });

  it("limits a source-less same-ID lab overlay to its verified name", () => {
    const verified: SiteContent = structuredClone(verifiedSiteContentVi);
    const demo: StitchContent = structuredClone(stitchContent);
    const demoLab = demo.students.labs[0];
    verified.students.labs = [
      {
        id: demoLab.id,
        name: "Verified official name",
        positioning: "Unlabelled positioning",
        activities: ["Unlabelled activity"],
        benefits: ["Unlabelled benefit"],
        image: { src: "/unlabelled.webp", alt: "Unlabelled image" },
        mediaRef: "unlabelled.media",
        cta: "Unlabelled CTA",
      },
    ];

    const result = composeSiteContent(verified, demo);
    const composedLab = result.students.labs[0];

    expect(composedLab).toEqual({ ...demoLab, name: "Verified official name" });
    expect(composedLab.source).toBe("stitch");
  });

  it("allows a labelled verified lab to replace the full Stitch record", () => {
    const verified: SiteContent = structuredClone(verifiedSiteContentVi);
    const demo: StitchContent = structuredClone(stitchContent);
    const replacement = {
      id: demo.students.labs[0].id,
      name: "Verified complete lab",
      positioning: "Verified positioning",
      source: "verified" as const,
    };
    verified.students.labs = [replacement];

    const result = composeSiteContent(verified, demo);

    expect(result.students.labs[0]).toEqual(replacement);
  });

  it("clones selected hero and about video media away from source objects", () => {
    const verified: SiteContent = structuredClone(verifiedSiteContentVi);
    const demo: StitchContent = structuredClone(stitchContent);
    verified.about.video = {
      type: "video",
      src: "/media/official/about.webm",
      poster: "/media/official/about.webp",
      alt: "About video",
    };
    demo.hero.media = {
      type: "video",
      src: "/media/official/hero.webm",
      poster: "/media/official/hero.webp",
      alt: "Hero video",
    };

    const result = composeSiteContent(verified, demo);
    result.hero.media!.src = "/mutated-hero.webm";
    result.about.video!.src = "/mutated-about.webm";

    expect(demo.hero.media.src).toBe("/media/official/hero.webm");
    expect(verified.about.video.src).toBe("/media/official/about.webm");
  });
});
