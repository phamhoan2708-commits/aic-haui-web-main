import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ContentSection } from "./ContentSection";

describe("ContentSection", () => {
  it("does not leave a heading or section spacing when hidden", () => {
    const { container } = render(
      <ContentSection title="Tổ chức" state={{ status: "empty" }}>
        <p>Nội dung</p>
      </ContentSection>,
    );

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole("heading", { name: "Tổ chức" })).not.toBeInTheDocument();
  });

  it("renders a neutral scaffold without visible placeholder copy in review mode", () => {
    render(
      <ContentSection
        title="Nhóm nghiên cứu"
        state={{ status: "scaffold", expectedCount: 7 }}
        scaffold={<div data-testid="research-scaffold" aria-hidden="true" />}
      >
        <p>Nội dung thật</p>
      </ContentSection>,
    );

    expect(screen.getByRole("heading", { name: "Nhóm nghiên cứu" })).toBeInTheDocument();
    expect(screen.getByTestId("research-scaffold")).toBeInTheDocument();
    expect(screen.queryByText("Nội dung thật")).not.toBeInTheDocument();
    expect(screen.queryByText(/placeholder|chưa có/i)).not.toBeInTheDocument();
  });
});
