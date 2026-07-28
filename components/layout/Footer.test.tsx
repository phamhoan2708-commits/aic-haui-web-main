import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BrowserRouter, useLocation } from "react-router-dom";

import { Footer } from "./Footer";

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{`${location.pathname}${location.hash}`}</output>;
}

afterEach(() => {
  window.history.replaceState(null, "", "/");
  vi.restoreAllMocks();
});

describe("Footer landing navigation", () => {
  it("replaces the current landing hash without adding history on repeated primary clicks", () => {
    const routerState = { usr: { source: "footer-test" }, key: "landing", idx: 4 };
    window.history.replaceState(routerState, "", "/");
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>,
    );
    const links = within(screen.getByRole("navigation")).getAllByRole("link");
    expect(links).toHaveLength(6);
    const initialLength = window.history.length;
    const pushState = vi.spyOn(window.history, "pushState");
    const replaceState = vi.spyOn(window.history, "replaceState");

    expect(fireEvent.click(links[0])).toBe(false);
    expect(fireEvent.click(links[3])).toBe(false);
    expect(fireEvent.click(links[5])).toBe(false);

    expect(pushState).not.toHaveBeenCalled();
    expect(replaceState).toHaveBeenCalledTimes(3);
    expect(window.history.length).toBe(initialLength);
    expect(window.history.state).toBe(routerState);
  });

  it.each([
    ["modified", { ctrlKey: true }],
    ["non-primary", { button: 1 }],
  ])("does not intercept a %s footer click", (_kind, clickOptions) => {
    window.history.replaceState({ key: "landing", idx: 2 }, "", "/");
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>,
    );
    const link = within(screen.getByRole("navigation")).getAllByRole("link")[0];
    link.setAttribute("target", "_blank");
    const replaceState = vi.spyOn(window.history, "replaceState");

    expect(fireEvent.click(link, clickOptions)).toBe(true);
    expect(replaceState).not.toHaveBeenCalled();
  });

  it("uses normal router navigation from outside the landing path", async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, "", "/research");
    render(
      <BrowserRouter>
        <Footer />
        <LocationProbe />
      </BrowserRouter>,
    );

    await user.click(within(screen.getByRole("navigation")).getAllByRole("link")[2]);

    expect(screen.getByTestId("location")).toHaveTextContent("/#nghien-cuu");
  });
});
