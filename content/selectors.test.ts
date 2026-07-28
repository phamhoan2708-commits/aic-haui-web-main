import { describe, expect, it } from "vitest";

import { resolveSectionState } from "./selectors";

describe("resolveSectionState", () => {
  it("marks populated collections ready", () => {
    expect(resolveSectionState(["content"], false)).toEqual({
      status: "ready",
      items: ["content"],
    });
  });

  it("hides missing content in production", () => {
    expect(resolveSectionState([], false)).toEqual({ status: "empty" });
  });

  it("returns a neutral scaffold with the expected layout count in review mode", () => {
    expect(resolveSectionState([], true, 7)).toEqual({
      status: "scaffold",
      expectedCount: 7,
    });
  });
});
