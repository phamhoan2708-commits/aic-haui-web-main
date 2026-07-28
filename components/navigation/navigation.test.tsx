import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";
import { LanguageProvider } from "../../contexts/LanguageProvider";
import { labelsEn, labelsVi } from "../../content/labels";

const { scrollToSection } = vi.hoisted(() => ({ scrollToSection: vi.fn() }));

vi.mock("../../lib/scrollToSection", () => ({ scrollToSection }));

describe("navigation", () => {
  beforeEach(() => {
    scrollToSection.mockReset();
  });

  it("renders all six landing section links on desktop", () => {
    render(<DesktopNav />, { wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter> });

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(6);
    expect(links.find((link) => link.getAttribute("href") === "/#ve-chung-toi")).toBeDefined();
  });

  it("uses a location current state and visible active treatment for the active section", () => {
    render(<DesktopNav activeSection="nghien-cuu" />, {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    const active = screen.getByRole("link", { current: "location" });
    expect(active).toHaveAttribute("href", "/#nghien-cuu");
    expect(screen.getAllByRole("link", { current: "location" })).toEqual([active]);
    expect(active).toHaveClass("bg-aic-gold-dark", "text-white", "font-extrabold");
  });

  it("restores focus to the mobile trigger when Escape closes the menu", async () => {
    const user = userEvent.setup();
    render(<MobileNav />, { wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter> });
    const trigger = screen.getByRole("button", { expanded: false });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByRole("button", { name: labelsVi.layoutLabels.closeMenu }),
    ).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(document.body).not.toHaveStyle({ overflow: "hidden" });
  });

  it("closes from the localized control inside the dialog and restores focus and overflow", async () => {
    const user = userEvent.setup();
    render(<MobileNav />, { wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter> });
    const trigger = screen.getByRole("button", { expanded: false });

    await user.click(trigger);
    const dialog = screen.getByRole("dialog");
    const internalClose = within(dialog).getByRole("button", {
      name: labelsVi.layoutLabels.closeMenu,
    });
    expect(internalClose).toHaveFocus();
    expect(document.body).toHaveStyle({ overflow: "hidden" });

    await user.click(internalClose);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(document.body).not.toHaveStyle({ overflow: "hidden" });
  });

  it("cycles forward and reverse focus through the mobile dialog", async () => {
    const user = userEvent.setup();
    render(<MobileNav />, { wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter> });

    await user.click(screen.getByRole("button", { expanded: false }));
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(6);
    const englishButton = screen.getByRole("button", {
      name: labelsVi.layoutLabels.englishLanguage,
    });
    const closeButton = within(screen.getByRole("dialog")).getByRole("button", {
      name: labelsVi.layoutLabels.closeMenu,
    });
    englishButton.focus();
    await user.keyboard("{Tab}");
    expect(closeButton).toHaveFocus();

    await user.keyboard("{Shift>}{Tab}{/Shift}");
    expect(englishButton).toHaveFocus();
  });

  it("contains focus when it is moved outside the mobile dialog", async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">Outside</button>
        <MemoryRouter>
          <MobileNav />
        </MemoryRouter>
      </>,
    );

    await user.click(screen.getByRole("button", { expanded: false }));
    screen.getByRole("button", { name: "Outside" }).focus();

    expect(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: labelsVi.layoutLabels.closeMenu,
      }),
    ).toHaveFocus();
  });

  it("uses a backdrop to intercept background pointer interaction", async () => {
    const user = userEvent.setup();
    const onBackgroundClick = vi.fn();
    render(
      <>
        <button type="button" onClick={onBackgroundClick}>
          Background action
        </button>
        <MemoryRouter>
          <MobileNav />
        </MemoryRouter>
      </>,
    );

    const trigger = screen.getByRole("button", { expanded: false });
    await user.click(trigger);
    const backdrop = screen.getByTestId("mobile-nav-backdrop");
    expect(backdrop).toHaveClass("fixed", "inset-0");
    expect(backdrop).not.toHaveAttribute("tabindex");

    await user.click(backdrop);

    expect(onBackgroundClick).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(document.body).not.toHaveStyle({ overflow: "hidden" });
  });

  it("restores overflow when the mobile menu unmounts", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<MobileNav />, {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    await user.click(screen.getByRole("button", { expanded: false }));
    expect(document.body).toHaveStyle({ overflow: "hidden" });
    unmount();
    expect(document.body).not.toHaveStyle({ overflow: "hidden" });
  });

  it("updates mobile section labels from the selected language", async () => {
    const user = userEvent.setup();
    render(<MobileNav />, {
      wrapper: ({ children }) => (
        <LanguageProvider>
          <MemoryRouter>{children}</MemoryRouter>
        </LanguageProvider>
      ),
    });

    await user.click(screen.getByRole("button", { expanded: false }));
    await user.click(screen.getByRole("button", { name: labelsVi.layoutLabels.englishLanguage }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { expanded: false })).toHaveFocus();
    expect(document.body).not.toHaveStyle({ overflow: "hidden" });
    await user.click(screen.getByRole("button", { expanded: false }));

    expect(screen.getByRole("link", { name: "About Us" })).toHaveAttribute(
      "href",
      "/#ve-chung-toi",
    );
    expect(
      screen.getByRole("button", { name: labelsEn.layoutLabels.englishLanguage }),
    ).toBeInTheDocument();
  });

  it("closes before scrolling to a selected landing section", async () => {
    const user = userEvent.setup();
    render(<MobileNav />, { wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter> });
    scrollToSection.mockImplementation(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { expanded: false }));
    await user.click(screen.getByRole("link", { name: /Nghi/ }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(scrollToSection).toHaveBeenCalledWith("nghien-cuu");
    expect(screen.getByRole("button", { expanded: false })).toHaveFocus();
    expect(document.body).not.toHaveStyle({ overflow: "hidden" });
  });

  it.each([
    ["Control", { ctrlKey: true }],
    ["Meta", { metaKey: true }],
    ["Shift", { shiftKey: true }],
    ["Alt", { altKey: true }],
  ])("does not close or scroll for a modified %s click", async (_modifier, clickOptions) => {
    const user = userEvent.setup();
    render(<MobileNav />, { wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter> });

    await user.click(screen.getByRole("button", { expanded: false }));
    fireEvent.click(screen.getByRole("link", { name: /Nghi/ }), clickOptions);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(scrollToSection).not.toHaveBeenCalled();
  });

  it("does not close or scroll for a non-primary click", async () => {
    const user = userEvent.setup();
    render(<MobileNav />, { wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter> });

    await user.click(screen.getByRole("button", { expanded: false }));
    fireEvent.click(screen.getByRole("link", { name: /Nghi/ }), { button: 1 });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(scrollToSection).not.toHaveBeenCalled();
  });
});
