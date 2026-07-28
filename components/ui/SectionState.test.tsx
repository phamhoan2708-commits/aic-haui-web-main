import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SectionStateView } from "./SectionStateView";

describe("SectionStateView", () => {
  it("renders nothing when hidden", () => {
    render(
      <SectionStateView state="hidden" emptyLabel="Không có dữ liệu">
        <span>content</span>
      </SectionStateView>,
    );
    expect(screen.queryByText("content")).not.toBeInTheDocument();
    expect(screen.queryByText("Không có dữ liệu")).not.toBeInTheDocument();
  });

  it("renders the development empty state without fake records", () => {
    render(
      <SectionStateView state="empty" emptyLabel="Chưa có dữ liệu">
        <span>content</span>
      </SectionStateView>,
    );
    expect(screen.getByText("Chưa có dữ liệu")).toBeInTheDocument();
  });
});
