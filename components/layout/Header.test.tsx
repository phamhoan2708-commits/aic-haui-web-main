import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { Header } from "./Header";

vi.mock("../../hooks/useActiveSection", () => ({
  useActiveSection: () => "nghien-cuu",
}));

describe("Header", () => {
  it("uses the official AIC identity in fixed desktop brand and navigation tiers", () => {
    const { container } = render(<Header />, {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={["/ve-chung-toi"]}>{children}</MemoryRouter>
      ),
    });

    const logoImage = screen.getByRole("img", { name: /Logo AIC/ });
    expect(logoImage).toHaveAttribute("src", "/media/official/aic-logo.jpg");
    expect(logoImage).toHaveClass("rounded-[10px]");
    expect(logoImage).not.toHaveClass("rounded-card", "rounded-media");
    expect(screen.getAllByRole("img", { name: /Logo AIC/ })).toHaveLength(1);
    const logoWrapper = logoImage.closest("[data-logo-source]");
    expect(logoWrapper).toHaveClass("rounded-[10px]");
    expect(logoWrapper).not.toHaveClass("rounded-card", "rounded-media");
    expect(screen.getByRole("link", { name: /AIC/ })).toHaveTextContent("AIC");
    expect(screen.getAllByRole("link", { name: /AIC/ })).toHaveLength(1);
    expect(screen.queryByText("AIC Center")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Trung tâm Nghiên cứu và Ứng dụng Trí tuệ Nhân tạo"),
    ).not.toBeInTheDocument();
    expect(container.querySelector("header")).toHaveClass("fixed");
    expect(screen.getByTestId("header-brand-tier")).toHaveClass(
      "h-16",
      "lg:h-[72px]",
      "bg-aic-navy",
    );
    expect(screen.getByTestId("header-nav-tier")).toHaveClass("h-12", "bg-white");
    expect(screen.getByRole("link", { current: "location" })).toHaveAttribute(
      "href",
      "/#nghien-cuu",
    );
  });

  it("keeps a single navy mobile bar with the menu trigger", () => {
    const { container } = render(<Header />, {
      wrapper: ({ children }) => <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>,
    });

    expect(container.querySelector("header")).toHaveClass("fixed");
    expect(screen.getByRole("button", { expanded: false })).toBeInTheDocument();
    expect(container.querySelector("[data-testid='header-brand-tier']")).toHaveClass(
      "h-16",
      "lg:h-[72px]",
    );
    expect(container.querySelector("[data-testid='header-nav-tier']")).toHaveClass(
      "hidden",
      "lg:block",
    );
  });

  it("keeps the brand link and exact logo footprint when the header image fails", () => {
    render(<Header />, {
      wrapper: ({ children }) => <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>,
    });
    const logo = screen.getByRole("img", { name: /Logo AIC/ });
    const brandLink = screen.getByRole("link", { name: /AIC/ });

    fireEvent.error(logo);

    expect(screen.queryByRole("img", { name: /Logo AIC/ })).not.toBeInTheDocument();
    expect(brandLink).toBeInTheDocument();
    expect(brandLink.querySelector("[data-logo-source='slot']")).toHaveClass(
      "prototype-media-slot",
      "size-9",
      "aspect-square",
      "rounded-[10px]",
    );
    expect(brandLink.querySelector("[data-logo-source='slot']")).not.toHaveClass(
      "rounded-card",
      "rounded-media",
    );
  });
});
