import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { landingSections, type LandingSectionId } from "../app/landingSections";

const landingSectionIds = new Set<LandingSectionId>(landingSections.map((section) => section.id));
const desktopMediaQuery = "(min-width: 1024px)";

export function useActiveSection(): LandingSectionId | undefined {
  const { key, pathname } = useLocation();
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(desktopMediaQuery).matches);
  const [activeSection, setActiveSection] = useState<{
    locationKey: string;
    sectionId: LandingSectionId | undefined;
  }>({ locationKey: key, sectionId: undefined });

  useEffect(() => {
    const mediaQuery = window.matchMedia(desktopMediaQuery);
    const syncViewport = () => {
      setActiveSection((current) =>
        current.locationKey === key && current.sectionId === undefined
          ? current
          : { locationKey: key, sectionId: undefined },
      );
      setIsDesktop(mediaQuery.matches);
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncViewport);
      return () => mediaQuery.removeEventListener("change", syncViewport);
    }

    mediaQuery.addListener(syncViewport);
    return () => mediaQuery.removeListener(syncViewport);
  }, [key]);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const headerOffset = isDesktop ? 120 : 64;
    const visibleSections = new Map<LandingSectionId, Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const sectionId = entry.target.id as LandingSectionId;
          if (!landingSectionIds.has(sectionId)) continue;

          if (entry.isIntersecting) {
            visibleSections.set(sectionId, entry.target);
          } else {
            visibleSections.delete(sectionId);
          }
        }

        let closestSection: LandingSectionId | undefined;
        let closestDistance = Infinity;
        for (const [sectionId, element] of visibleSections) {
          const distance = Math.abs(element.getBoundingClientRect().top - headerOffset);
          if (distance < closestDistance) {
            closestSection = sectionId;
            closestDistance = distance;
          }
        }

        setActiveSection((current) =>
          current.locationKey === key && current.sectionId === closestSection
            ? current
            : { locationKey: key, sectionId: closestSection },
        );
      },
      {
        rootMargin: `-${headerOffset}px 0px -50% 0px`,
        threshold: 0,
      },
    );

    for (const section of landingSections) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [isDesktop, key, pathname]);

  return pathname === "/" && activeSection.locationKey === key
    ? activeSection.sectionId
    : undefined;
}
