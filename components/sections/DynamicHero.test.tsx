import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { labelsVi } from "../../content/labels";
import { DynamicHero } from "./DynamicHero";

const { scrollToSection } = vi.hoisted(() => ({ scrollToSection: vi.fn() }));

vi.mock("../../lib/scrollToSection", () => ({ scrollToSection }));

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  scrollToSection.mockReset();
});

describe("DynamicHero background media", () => {
  it("keeps a background video decorative and disables autoplay for reduced motion", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: true,
        media: "(prefers-reduced-motion: reduce)",
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    );

    const { container } = render(
      <DynamicHero
        content={{
          title: "Hero test",
          media: {
            type: "video",
            src: "/media/hero.mp4",
            poster: "/media/hero.jpg",
            alt: "Decorative laboratory scene",
          },
        }}
      />,
      { wrapper: MemoryRouter },
    );
    const video = container.querySelector("video");

    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute("aria-hidden", "true");
    expect(video).not.toHaveAttribute("aria-label");
    expect(video).toHaveAttribute("preload", "metadata");
    expect(video).not.toHaveAttribute("autoplay");
    expect(video).toHaveAttribute("src", "/media/hero.mp4");
  });

  it("resolves the content media reference through the manifest-owned source", () => {
    const { container } = render(
      <DynamicHero content={{ title: "Manifest hero", mediaRef: "home.hero" }} />,
      { wrapper: MemoryRouter },
    );

    expect(container.querySelector("video")).toHaveAttribute("src", "/media/hero-video.webm");
  });

  it("renders a stable background fallback when runtime video loading fails", () => {
    const { container } = render(
      <DynamicHero
        content={{
          title: "Runtime fallback",
          media: { type: "video", src: "/media/custom.webm", alt: "Custom hero" },
        }}
      />,
      { wrapper: MemoryRouter },
    );

    fireEvent.error(container.querySelector("video")!);

    expect(container.querySelector("video")).not.toBeInTheDocument();
    expect(screen.getByTestId("hero-media-fallback")).toHaveClass(
      "prototype-media-slot",
      "absolute",
      "inset-0",
    );
  });

  it("keeps the first phrase visible without scheduling rotation for reduced motion", () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: true,
        media: "(prefers-reduced-motion: reduce)",
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    );

    render(<DynamicHero content={{ title: "Hero test" }} />, { wrapper: MemoryRouter });
    act(() => vi.advanceTimersByTime(3_000));

    expect(screen.getByText(labelsVi.heroLabels.phrases[0])).toBeInTheDocument();
  });

  it("subscribes with legacy media-query listeners when modern listeners are unavailable", () => {
    const addListener = vi.fn();
    const removeListener = vi.fn();
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: false,
        media: "(prefers-reduced-motion: reduce)",
        onchange: null,
        addListener,
        removeListener,
        dispatchEvent: vi.fn(),
      }),
    );

    const { unmount } = render(<DynamicHero content={{ title: "Hero test" }} />, {
      wrapper: MemoryRouter,
    });

    expect(addListener).toHaveBeenCalledOnce();
    unmount();
    expect(removeListener).toHaveBeenCalledOnce();
  });

  it("uses landing anchors and scrolls the primary CTA on the home path", () => {
    render(
      <DynamicHero
        content={{
          title: "Hero test",
          primaryCta: "Research",
          secondaryCta: "Students",
          media: { type: "video", src: "/media/hero.mp4", alt: "Decorative laboratory scene" },
        }}
      />,
      { wrapper: MemoryRouter },
    );

    const primary = screen.getByRole("link", { name: "Research" });
    expect(primary).toHaveAttribute("href", "/#nghien-cuu");
    expect(screen.getByRole("link", { name: "Students" })).toHaveAttribute("href", "/#sinh-vien");

    fireEvent.click(primary);
    expect(scrollToSection).toHaveBeenCalledWith("nghien-cuu");

    fireEvent.click(screen.getByRole("link", { name: "Students" }));
    expect(scrollToSection).toHaveBeenCalledWith("sinh-vien");

    scrollToSection.mockClear();
    fireEvent.click(primary, { ctrlKey: true });
    expect(scrollToSection).not.toHaveBeenCalled();
  });
});
