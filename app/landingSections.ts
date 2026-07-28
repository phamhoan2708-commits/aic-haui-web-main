export type LandingSectionKey =
  "about" | "organization" | "research" | "cooperation" | "students" | "contact";

export type LandingSection = {
  key: LandingSectionKey;
  id: string;
  legacyPath?: `/${string}`;
};

export const landingSections = [
  { key: "about", id: "ve-chung-toi", legacyPath: "/ve-chung-toi" },
  { key: "organization", id: "to-chuc", legacyPath: "/to-chuc" },
  { key: "research", id: "nghien-cuu", legacyPath: "/nghien-cuu" },
  { key: "cooperation", id: "hop-tac", legacyPath: "/hop-tac" },
  { key: "students", id: "sinh-vien", legacyPath: "/sinh-vien" },
  { key: "contact", id: "lien-he", legacyPath: "/lien-he" },
] as const satisfies readonly LandingSection[];

export type LandingSectionId = (typeof landingSections)[number]["id"];
export type LegacyLandingSection = Extract<
  (typeof landingSections)[number],
  { readonly legacyPath: string }
>;

export const legacyLandingSections = landingSections.filter(
  (section): section is LegacyLandingSection => "legacyPath" in section,
);

export const landingHref = <Id extends LandingSectionId>(sectionId: Id) =>
  `/#${sectionId}` as const;
