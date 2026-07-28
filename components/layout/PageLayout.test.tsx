import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { PageLayout } from "./PageLayout";

describe("PageLayout", () => {
  it("does not force empty vertical space below short pages", () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<PageLayout />}>
            <Route index element={<p>Nội dung ngắn</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("main")).not.toHaveClass("min-h-[70vh]");
  });

  it("reserves space for the fixed navigation shell at each breakpoint", () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<PageLayout />}>
            <Route index element={<p>Content</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("main")).toHaveClass("pt-16", "lg:pt-[120px]");
  });
});
