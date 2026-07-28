import { act, fireEvent, render, screen } from "@testing-library/react";
import { Link, MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ScrollToTop } from "./ScrollToTop";

describe("ScrollToTop", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("runs header-aware home hash scrolling with auto behavior", () => {
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
    const target = document.createElement("section");
    target.id = "ve-chung-toi";
    target.getBoundingClientRect = () => ({ top: 100 }) as DOMRect;
    document.body.append(target);
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    let callback: FrameRequestCallback | undefined;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((nextCallback) => {
      callback = nextCallback;
      return 1;
    });

    render(<ScrollToTop />, {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={["/#ve-chung-toi"]}>{children}</MemoryRouter>
      ),
    });
    act(() => callback?.(0));

    expect(scrollTo).toHaveBeenCalledWith({ top: 36, behavior: "auto" });
  });

  it("only treats hashes as landing-section anchors on the home route", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    const frame = vi.spyOn(window, "requestAnimationFrame").mockImplementation(() => 1);

    render(<ScrollToTop />, {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={["/to-chuc#ve-chung-toi"]}>{children}</MemoryRouter>
      ),
    });

    expect(frame).not.toHaveBeenCalled();
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  });

  it("cancels pending hash frames on navigation and unmount", () => {
    const cancelFrame = vi.spyOn(window, "cancelAnimationFrame");
    const frame = vi
      .spyOn(window, "requestAnimationFrame")
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(2);
    const { unmount } = render(
      <>
        <ScrollToTop />
        <Link to="/#lien-he">next anchor</Link>
      </>,
      {
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={["/#ve-chung-toi"]}>{children}</MemoryRouter>
        ),
      },
    );

    fireEvent.click(screen.getByRole("link", { name: "next anchor" }));
    unmount();

    expect(frame).toHaveBeenCalledTimes(2);
    expect(cancelFrame).toHaveBeenNthCalledWith(1, 1);
    expect(cancelFrame).toHaveBeenNthCalledWith(2, 2);
  });
});
