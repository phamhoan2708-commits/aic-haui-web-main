import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Card } from "./Card";

describe("Card typography", () => {
  it("scopes card heading typography to semantic descendant h3 elements without changing body copy semantics", () => {
    render(
      <Card data-testid="card">
        <div>
          <h3>Card title</h3>
        </div>
        <p>Card body copy</p>
      </Card>,
    );

    const card = screen.getByTestId("card");
    const heading = screen.getByRole("heading", { level: 3, name: "Card title" });
    const body = screen.getByText("Card body copy");

    expect(card).not.toHaveClass("text-[length:var(--type-card-size)]");
    expect(card).not.toHaveClass("leading-[var(--type-card-line)]");
    expect(card).toHaveClass(
      "[&_h3]:text-[length:var(--type-card-size)]",
      "[&_h3]:leading-[var(--type-card-line)]",
      "[&_h3]:font-bold",
    );
    expect(heading).toBeInTheDocument();
    expect(body).not.toHaveAttribute("role", "heading");
  });
});
