import { describe, expect, it } from "vitest";

import { legacyLandingSections } from "./landingSections";
import { routes } from "./routes";

describe("route registry", () => {
  it("contains the home route and compatibility paths from the landing registry", () => {
    expect(routes.map((route) => route.path)).toEqual([
      "/",
      ...legacyLandingSections.map((section) => section.legacyPath),
    ]);
    expect(new Set(routes.map((route) => route.path)).size).toBe(routes.length);
  });
});
