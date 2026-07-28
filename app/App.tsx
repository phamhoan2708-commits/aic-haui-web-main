import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import { OpeningPreloader } from "../components/layout/OpeningPreloader";
import { router } from "./router";

function shouldShowOpeningPreloader() {
  return (
    typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function App() {
  const [preloaderActive, setPreloaderActive] = useState(shouldShowOpeningPreloader);

  return (
    <>
      {preloaderActive ? <OpeningPreloader onComplete={() => setPreloaderActive(false)} /> : null}
      <div data-testid="app-shell" inert={preloaderActive || undefined}>
        <RouterProvider router={router} />
      </div>
    </>
  );
}
