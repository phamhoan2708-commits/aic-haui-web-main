import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { labelsVi } from "../../content/labels";
import { HomeAbout } from "./HomeAbout";

describe("HomeAbout typography", () => {
  it("uses the shared body tokens for intro, principle, and parent-unit prose", () => {
    render(
      <HomeAbout
        content={{
          intro: "Approved intro prose",
          vision: "Approved vision prose",
          mission: "Approved mission prose",
          parentUnit: "Approved parent-unit prose",
        }}
        title="About"
        labels={labelsVi.aboutSectionLabels}
        showVideo={false}
        showParentUnit
      />,
    );

    for (const copy of [
      "Approved intro prose",
      "Approved vision prose",
      "Approved mission prose",
      "Approved parent-unit prose",
    ]) {
      expect(screen.getByText(copy)).toHaveClass(
        "text-[length:var(--type-body-size)]",
        "leading-[var(--type-body-line)]",
      );
    }
  });
});
