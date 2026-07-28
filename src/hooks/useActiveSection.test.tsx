import { act, fireEvent, render, screen } from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { landingSections } from "../app/landingSections";
import { useActiveSection } from "./useActiveSection";

type ObservedInstance = {
  callback: IntersectionObserverCallback;
  options?: IntersectionObserverInit;
  observed: Element[];
  disconnect: ReturnType<typeof vi.fn>;
};

const observers: ObservedInstance[] = [];

class CapturingIntersectionObserver {
  readonly observed: Element[] = [];
  readonly disconnect = vi.fn();
  readonly instance: ObservedInstance;

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.instance = { callback, options, observed: this.observed, disconnect: this.disconnect };
    observers.push(this.instance);
  }

  observe = (element: Element) => this.observed.push(element);
  unobserve = vi.fn();
  takeRecords = () => [];
  root = null;
  rootMargin = "";
  thresholds = [];
}

function ActiveSectionProbe() {
  const activeSection = useActiveSection();
  return <output>{activeSection ?? "none"}</output>;
}

function LandingTargets() {
  return (
    <>
      {landingSections.map((section) => (
        <section id={section.id} key={section.id} />
      ))}
    </>
  );
}

function RouteControls() {
  return (
    <>
      <Link to="/to-chuc">other route</Link>
      <Link to="/">home route</Link>
    </>
  );
}

function renderProbe(pathname = "/") {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route
          path="*"
          element={
            <>
              <LandingTargets />
              <ActiveSectionProbe />
              <RouteControls />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

const entryFor = (id: string, top: number, isIntersecting = true) => {
  const target = document.getElementById(id) as HTMLElement;
  target.getBoundingClientRect = () => ({ top }) as DOMRect;

  return {
    target,
    isIntersecting,
    boundingClientRect: { top },
  } as unknown as IntersectionObserverEntry;
};

const emitEntries = (entries: IntersectionObserverEntry[]) => {
  act(() => observers[0].callback(entries, {} as IntersectionObserver));
};

function controlViewport(matchesDesktop: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const mediaQuery = {
    matches: matchesDesktop,
    media: "(min-width: 1024px)",
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: (_: string, listener: EventListenerOrEventListenerObject) => {
      if (typeof listener === "function")
        listeners.add(listener as (event: MediaQueryListEvent) => void);
    },
    removeEventListener: (_: string, listener: EventListenerOrEventListenerObject) => {
      if (typeof listener === "function")
        listeners.delete(listener as (event: MediaQueryListEvent) => void);
    },
    dispatchEvent: () => false,
  };
  vi.spyOn(window, "matchMedia").mockReturnValue(mediaQuery);

  return {
    setDesktop(nextMatchesDesktop: boolean) {
      mediaQuery.matches = nextMatchesDesktop;
      act(() => {
        for (const listener of listeners) {
          listener({ matches: nextMatchesDesktop } as MediaQueryListEvent);
        }
      });
    },
  };
}

describe("useActiveSection", () => {
  afterEach(() => {
    observers.length = 0;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("observes every approved landing section", () => {
    vi.stubGlobal("IntersectionObserver", CapturingIntersectionObserver);

    renderProbe();

    expect(observers).toHaveLength(1);
    expect(observers[0].observed.map((element) => element.id)).toEqual(
      landingSections.map((section) => section.id),
    );
    expect(observers[0].options).toMatchObject({
      rootMargin: "-64px 0px -50% 0px",
      threshold: 0,
    });
  });

  it("recreates the observer when the fixed-header breakpoint changes", () => {
    const viewport = controlViewport(false);
    vi.stubGlobal("IntersectionObserver", CapturingIntersectionObserver);

    renderProbe();
    emitEntries([entryFor("ve-chung-toi", 64)]);
    viewport.setDesktop(true);

    expect(observers[0].disconnect).toHaveBeenCalledOnce();
    expect(observers[1].options).toMatchObject({ rootMargin: "-120px 0px -50% 0px" });
    expect(screen.getByRole("status")).toHaveTextContent("none");
  });

  it("registers and cleans up a modern media-query listener", () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: false,
      media: "(min-width: 1024px)",
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener,
      removeEventListener,
      dispatchEvent: () => false,
    });
    vi.stubGlobal("IntersectionObserver", CapturingIntersectionObserver);

    const { unmount } = renderProbe();
    unmount();

    expect(addEventListener).toHaveBeenCalledWith("change", expect.any(Function));
    expect(removeEventListener).toHaveBeenCalledWith("change", addEventListener.mock.calls[0][1]);
  });

  it("registers and cleans up a legacy media-query listener", () => {
    const addListener = vi.fn();
    const removeListener = vi.fn();
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: false,
      media: "(min-width: 1024px)",
      onchange: null,
      addListener,
      removeListener,
      dispatchEvent: () => false,
    } as unknown as MediaQueryList);
    vi.stubGlobal("IntersectionObserver", CapturingIntersectionObserver);

    const { unmount } = renderProbe();
    unmount();

    expect(addListener).toHaveBeenCalledWith(expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith(addListener.mock.calls[0][0]);
  });

  it("sets the intersecting section nearest the header as active", () => {
    vi.stubGlobal("IntersectionObserver", CapturingIntersectionObserver);

    renderProbe();
    emitEntries([entryFor("ve-chung-toi", 300), entryFor("to-chuc", 100)]);

    expect(screen.getByRole("status")).toHaveTextContent("to-chuc");
  });

  it("keeps prior intersections when later callbacks contain only one target", () => {
    vi.stubGlobal("IntersectionObserver", CapturingIntersectionObserver);

    renderProbe();
    emitEntries([entryFor("ve-chung-toi", 300), entryFor("to-chuc", 100)]);
    emitEntries([entryFor("ve-chung-toi", 70)]);

    expect(screen.getByRole("status")).toHaveTextContent("ve-chung-toi");

    emitEntries([entryFor("ve-chung-toi", 70, false)]);

    expect(screen.getByRole("status")).toHaveTextContent("to-chuc");
  });

  it("recomputes visible section geometry across observer callback batches", () => {
    vi.stubGlobal("IntersectionObserver", CapturingIntersectionObserver);
    renderProbe();
    const first = document.getElementById("ve-chung-toi") as HTMLElement;
    const second = document.getElementById("to-chuc") as HTMLElement;
    let firstTop = 100;
    const secondTop = 300;
    first.getBoundingClientRect = () => ({ top: firstTop }) as DOMRect;
    second.getBoundingClientRect = () => ({ top: secondTop }) as DOMRect;

    emitEntries([
      {
        target: first,
        isIntersecting: true,
        boundingClientRect: { top: firstTop },
      } as unknown as IntersectionObserverEntry,
    ]);
    firstTop = 500;
    emitEntries([
      {
        target: second,
        isIntersecting: true,
        boundingClientRect: { top: secondTop },
      } as unknown as IntersectionObserverEntry,
    ]);

    expect(screen.getByRole("status")).toHaveTextContent("to-chuc");
  });

  it("disconnects the observer during cleanup", () => {
    vi.stubGlobal("IntersectionObserver", CapturingIntersectionObserver);

    const { unmount } = renderProbe();
    const observer = observers[0];
    unmount();

    expect(observer.disconnect).toHaveBeenCalledOnce();
  });

  it("does not observe or select a section outside the landing route", () => {
    vi.stubGlobal("IntersectionObserver", CapturingIntersectionObserver);

    renderProbe("/to-chuc");

    expect(observers).toHaveLength(0);
    expect(screen.getByRole("status")).toHaveTextContent("none");
  });

  it("does not reuse an earlier section when returning to the landing route", () => {
    vi.stubGlobal("IntersectionObserver", CapturingIntersectionObserver);

    renderProbe();
    emitEntries([entryFor("ve-chung-toi", 64)]);
    expect(screen.getByRole("status")).toHaveTextContent("ve-chung-toi");

    fireEvent.click(screen.getByRole("link", { name: "other route" }));
    expect(screen.getByRole("status")).toHaveTextContent("none");

    fireEvent.click(screen.getByRole("link", { name: "home route" }));
    expect(screen.getByRole("status")).toHaveTextContent("none");
  });

  it("never mutates the URL from an observer callback", () => {
    vi.stubGlobal("IntersectionObserver", CapturingIntersectionObserver);
    const replaceState = vi.spyOn(window.history, "replaceState");

    renderProbe();
    emitEntries([entryFor("ve-chung-toi", 64)]);

    expect(replaceState).not.toHaveBeenCalled();
  });
});
