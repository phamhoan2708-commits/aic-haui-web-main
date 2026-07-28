import type { MouseEvent, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

import { landingHref, type LandingSectionId } from "../../app/landingSections";
import { cn } from "../../lib/cn";
import { isPrimaryUnmodifiedClick } from "../../lib/primaryClick";
import { scrollToSection } from "../../lib/scrollToSection";

export function NavPill({
  sectionId,
  active = false,
  children,
  onClick,
}: {
  sectionId: LandingSectionId;
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  const { pathname } = useLocation();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isPrimaryUnmodifiedClick(event)) return;

    onClick?.();
    if (pathname !== "/") return;

    event.preventDefault();
    scrollToSection(sectionId);
  };

  return (
    <Link
      to={landingHref(sectionId)}
      aria-current={active ? "location" : undefined}
      onClick={handleClick}
      className={cn(
        "flex min-h-11 items-center justify-center rounded-lg border px-2 text-xs font-semibold uppercase whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aic-blue focus-visible:ring-offset-2 xl:px-3 xl:text-sm",
        active
          ? "font-extrabold border-aic-blue bg-aic-blue text-white"
          : "border-transparent text-aic-navy hover:border-aic-blue/30 hover:bg-aic-mist hover:text-aic-blue",
      )}
    >
      {children}
    </Link>
  );
}
