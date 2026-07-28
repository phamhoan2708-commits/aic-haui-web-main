import {
  legacyLandingSections,
  type LandingSectionId,
  type LandingSectionKey,
} from "./landingSections";

export type RouteKey = "home" | LandingSectionKey;

export type SiteRoute = {
  key: RouteKey;
  path: string;
  nav: boolean;
  homeSection?: LandingSectionId;
};

const homeSectionIds: readonly LandingSectionId[] = ["ve-chung-toi", "to-chuc", "lien-he"];

const compatibilityRoutes = legacyLandingSections.map((section) => ({
  key: section.key,
  path: section.legacyPath,
  nav: true,
  ...(homeSectionIds.includes(section.id) ? { homeSection: section.id } : {}),
}));

export const routes: SiteRoute[] = [{ key: "home", path: "/", nav: false }, ...compatibilityRoutes];
