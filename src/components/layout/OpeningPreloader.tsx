import { useEffect } from "react";

import brainNetworkUrl from "../../assets/brain-network.svg";
import "./OpeningPreloader.css";

export const OPENING_PRELOADER_MS = 4500;

interface OpeningPreloaderProps {
  onComplete: () => void;
}

export function OpeningPreloader({ onComplete }: OpeningPreloaderProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const completionTimer = window.setTimeout(onComplete, OPENING_PRELOADER_MS);

    return () => {
      window.clearTimeout(completionTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [onComplete]);

  return (
    <div className="opening-preloader" data-testid="opening-preloader" aria-hidden="true">
      <span className="opening-preloader__panel opening-preloader__panel--left" />
      <span className="opening-preloader__panel opening-preloader__panel--right" />
      <div className="opening-preloader__graphic-shell">
        <div className="opening-preloader__graphic-frame">
          <img
            className="opening-preloader__graphic"
            src={brainNetworkUrl}
            alt=""
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
