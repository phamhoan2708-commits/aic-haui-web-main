import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RouteTransition } from "./RouteTransition";

describe("RouteTransition", () => {
  it("uses the lightweight reduced-motion-aware CSS transition", () => {
    const { container } = render(
      <RouteTransition>
        <p>Nội dung</p>
      </RouteTransition>,
    );

    expect(container.firstElementChild).toHaveClass("route-transition");
  });
});
