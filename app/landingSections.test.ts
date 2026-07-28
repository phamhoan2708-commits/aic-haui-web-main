import { describe, expect, expectTypeOf, it } from "vitest";

import { landingHref, landingSections, legacyLandingSections } from "./landingSections";

describe("landing section registry", () => {
  it("lists the landing section IDs in source order", () => {
    expect(landingSections.map((section) => section.id)).toEqual([
      "ve-chung-toi",
      "to-chuc",
      "nghien-cuu",
      "hop-tac",
      "sinh-vien",
      "lien-he",
    ]);
  });

  it("uses a unique ID for each landing section", () => {
    const ids = landingSections.map((section) => section.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("maps each legacy path to its landing section", () => {
    expect(legacyLandingSections.map(({ legacyPath, id }) => [legacyPath, id])).toEqual([
      ["/ve-chung-toi", "ve-chung-toi"],
      ["/to-chuc", "to-chuc"],
      ["/nghien-cuu", "nghien-cuu"],
      ["/hop-tac", "hop-tac"],
      ["/sinh-vien", "sinh-vien"],
      ["/lien-he", "lien-he"],
    ]);
  });

  it("builds landing links from section IDs", () => {
    expect(landingHref("nghien-cuu")).toBe("/#nghien-cuu");
  });

  it("preserves a literal section ID in the landing link type", () => {
    expectTypeOf(landingHref("nghien-cuu")).toEqualTypeOf<"/#nghien-cuu">();
  });
});
