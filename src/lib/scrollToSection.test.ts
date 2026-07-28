import { afterEach, describe, expect, it, vi } from "vitest";

import { scrollToSection } from "./scrollToSection";

const setViewport = (matchesDesktop: boolean) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === "(min-width: 1024px)" && matchesDesktop,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }));
};

describe("scrollToSection", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
    window.history.replaceState(null, "", "/");
  });

  it.each([
    [true, 120],
    [false, 64],
  ])("scrolls to a section below the %spx header", (matchesDesktop, offset) => {
    setViewport(matchesDesktop);
    Object.defineProperty(window, "scrollY", { configurable: true, value: 500 });
    const target = document.createElement("section");
    target.id = "ve-chung-toi";
    target.getBoundingClientRect = () => ({ top: 250 }) as DOMRect;
    document.body.append(target);
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    const replaceState = vi.spyOn(window.history, "replaceState");
    const pushState = vi.spyOn(window.history, "pushState");

    scrollToSection(target.id);

    expect(scrollTo).toHaveBeenCalledWith({
      top: 750 - offset,
      behavior: "smooth",
    });
    expect(replaceState).toHaveBeenCalledWith(null, "", "/#ve-chung-toi");
    expect(pushState).not.toHaveBeenCalled();
  });

  it("uses the requested scroll behavior", () => {
    setViewport(false);
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
    const target = document.createElement("section");
    target.id = "lien-he";
    target.getBoundingClientRect = () => ({ top: 100 }) as DOMRect;
    document.body.append(target);
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);

    scrollToSection(target.id, "auto");

    expect(scrollTo).toHaveBeenCalledWith({ top: 36, behavior: "auto" });
  });

  it("preserves router history state when replacing a valid section hash", () => {
    const routerState = { key: "landing", idx: 4, usr: { source: "nav" } };
    window.history.replaceState(routerState, "", "/");
    const target = document.createElement("section");
    target.id = "to-chuc";
    target.getBoundingClientRect = () => ({ top: 64 }) as DOMRect;
    document.body.append(target);
    const replaceState = vi.spyOn(window.history, "replaceState");

    scrollToSection(target.id);

    expect(replaceState).toHaveBeenCalledWith(routerState, "", "/#to-chuc");
    expect(replaceState.mock.calls.at(-1)?.[0]).toBe(routerState);
  });

  it("falls back to the page top and clears an unknown section hash", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    const replaceState = vi.spyOn(window.history, "replaceState");

    scrollToSection("missing");

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    expect(replaceState).toHaveBeenCalledWith(null, "", "/");
  });

  it("preserves router history state when normalizing an unknown section", () => {
    const routerState = { key: "legacy", idx: 6, usr: { source: "redirect" } };
    window.history.replaceState(routerState, "", "/#unknown");
    const replaceState = vi.spyOn(window.history, "replaceState");

    scrollToSection("missing");

    expect(replaceState).toHaveBeenCalledWith(routerState, "", "/");
    expect(replaceState.mock.calls.at(-1)?.[0]).toBe(routerState);
  });
});
