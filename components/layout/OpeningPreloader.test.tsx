import { act, cleanup, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { App } from "../../app/App";
import { OPENING_PRELOADER_MS, OpeningPreloader } from "./OpeningPreloader";

const originalMatchMedia = window.matchMedia;
const originalOverflow = document.body.style.overflow;

function setReducedMotion(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function PreloaderHarness() {
  const [ready, setReady] = useState(false);

  if (ready) {
    return <p>Landing ready</p>;
  }

  return <OpeningPreloader onComplete={() => setReady(true)} />;
}

describe("OpeningPreloader", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setReducedMotion(false);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
    vi.useRealTimers();
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: originalMatchMedia,
    });
    document.body.style.overflow = originalOverflow;
  });

  it("locks scrolling and completes after exactly 4500ms", () => {
    document.body.style.overflow = "clip";
    render(<PreloaderHarness />);

    expect(screen.getByTestId("opening-preloader")).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");

    act(() => {
      vi.advanceTimersByTime(OPENING_PRELOADER_MS - 1);
    });
    expect(screen.getByTestId("opening-preloader")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.queryByTestId("opening-preloader")).not.toBeInTheDocument();
    expect(screen.getByText("Landing ready")).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("clip");
  });

  it("clears its timer and restores overflow when unmounted early", () => {
    document.body.style.overflow = "auto";
    const onComplete = vi.fn();
    const { unmount } = render(<OpeningPreloader onComplete={onComplete} />);

    unmount();
    expect(document.body.style.overflow).toBe("auto");

    act(() => {
      vi.advanceTimersByTime(OPENING_PRELOADER_MS);
    });
    expect(onComplete).not.toHaveBeenCalled();
    expect(document.body.style.overflow).toBe("auto");
  });

  it("makes the app shell inert until the preloader completes", () => {
    setReducedMotion(false);
    render(<App />);

    expect(screen.getByTestId("opening-preloader")).toBeInTheDocument();
    expect(screen.getByTestId("app-shell")).toHaveAttribute("inert");

    act(() => {
      vi.advanceTimersByTime(OPENING_PRELOADER_MS);
    });
    expect(screen.queryByTestId("opening-preloader")).not.toBeInTheDocument();
    expect(screen.getByTestId("app-shell")).not.toHaveAttribute("inert");
  });

  it("skips the preloader, scroll lock, and inert shell for reduced motion", () => {
    document.body.style.overflow = "scroll";
    setReducedMotion(true);
    render(<App />);

    expect(screen.queryByTestId("opening-preloader")).not.toBeInTheDocument();
    expect(screen.getByTestId("app-shell")).not.toHaveAttribute("inert");
    expect(document.body.style.overflow).toBe("scroll");
  });
});
