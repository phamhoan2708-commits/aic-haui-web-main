import { fireEvent, render, screen } from "@testing-library/react";
import type { MouseEventHandler } from "react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";

describe("Button links", () => {
  it("renders mail links without requiring a router", () => {
    render(<Button href="mailto:verified@example.edu">Gửi email</Button>);
    expect(screen.getByRole("link", { name: "Gửi email" })).toHaveAttribute(
      "href",
      "mailto:verified@example.edu",
    );
  });

  it("forwards anchor attributes for links", () => {
    render(
      <Button href="https://example.edu" target="_blank" rel="noreferrer">
        Visit partner
      </Button>,
    );

    expect(screen.getByRole("link", { name: "Visit partner" })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "Visit partner" })).toHaveAttribute(
      "rel",
      "noreferrer",
    );
  });

  it("accepts native button click handlers for buttons without href", () => {
    const onClick: MouseEventHandler<HTMLButtonElement> = vi.fn();

    render(<Button onClick={onClick}>Save</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onClick).toHaveBeenCalledOnce();
  });
});
