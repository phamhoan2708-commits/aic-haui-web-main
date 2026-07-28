import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SkeletonBlock } from "./SkeletonBlock";

describe("SkeletonBlock", () => {
  it("can render the expected neutral shell count without visible copy", () => {
    const { container } = render(<SkeletonBlock count={3} className="h-20" />);

    expect(container.querySelectorAll("[data-scaffold-block]")).toHaveLength(3);
    expect(container).toHaveTextContent("");
  });
});
