export type SectionState = "ready" | "empty" | "hidden";
export type RuntimeMode = "development" | "production";
export type ContentSource = "verified" | "stitch";
export type SourcedRecord = { source: ContentSource };
export type MediaRef = string;

export type MediaManifestRecord = {
  id: MediaRef;
  kind: "image" | "video" | "map";
  aspectRatio: string;
  alt: string;
  src?: string;
  poster?: string;
  embedUrl?: string;
};

export type MediaManifest = Readonly<Record<MediaRef, MediaManifestRecord>>;

export type ContentState<T> =
  | { status: "ready"; items: T[] }
  | { status: "scaffold"; expectedCount?: number }
  | { status: "empty" };

export type MediaAsset = {
  type?: "image" | "video";
  src: string;
  alt: string;
  poster?: string;
};

export type Person = {
  id: string;
  name: string;
  role: string;
  group: "director" | "advisor" | "teacher-lab" | "student-leader";
  source?: ContentSource;
  email?: string;
  bio?: string;
  tags?: string[];
  image?: MediaAsset;
  mediaRef?: MediaRef;
};

export type ResearchItem = {
  id: string;
  title: string;
  description: string;
  source?: ContentSource;
  tags?: string[];
  leader?: string;
  memberCount?: number;
  cta?: string;
  image?: MediaAsset;
  mediaRef?: MediaRef;
};

export type Metric = SourcedRecord & { id: string; value: string; label: string };

export type CouncilMember = SourcedRecord & {
  id: string;
  name: string;
  role: string;
  affiliation: string;
};

export type Lab = {
  id: string;
  name: string;
  source?: ContentSource;
  positioning?: string;
  audience?: string;
  activities?: string[];
  benefits?: string[];
  image?: MediaAsset;
  mediaRef?: MediaRef;
  cta?: string;
};

export type CooperationItem = {
  id: string;
  title: string;
  description: string;
  source?: ContentSource;
  mediaRef?: MediaRef;
  cta?: string;
};

export type Partner = {
  id: string;
  name: string;
  source?: ContentSource;
  logo?: MediaAsset;
  mediaRef?: MediaRef;
  url?: string;
};
export type JoinStep = {
  id: string;
  title: string;
  description: string;
  source?: ContentSource;
};
export type ContactItem = {
  id: string;
  label: string;
  primary: string;
  secondary?: string;
  href?: string;
};

export type PageCopy = {
  eyebrow?: string;
  title: string;
  description?: string;
  mediaRef?: MediaRef;
};

export type SiteContent = {
  identity: { shortName: string; fullName: string };
  hero: PageCopy & { primaryCta?: string; secondaryCta?: string; media?: MediaAsset };
  pages: Record<
    "about" | "organization" | "research" | "cooperation" | "students" | "contact",
    PageCopy
  >;
  about: {
    intro?: string;
    vision?: string;
    mission?: string;
    parentUnit?: string;
    video?: MediaAsset;
  };
  people: Person[];
  research: {
    directions: ResearchItem[];
    metrics?: Metric[];
    council?: CouncilMember[];
    results: ResearchItem[];
    groups: ResearchItem[];
    activities: ResearchItem[];
  };
  cooperation: {
    enterprise: CooperationItem[];
    research: CooperationItem[];
    international: CooperationItem[];
    technologyTransfer: CooperationItem[];
    partners: Partner[];
    contactHref?: string;
  };
  students: {
    labs: Lab[];
    internship?: string;
    recruitment?: string;
    joinSteps: JoinStep[];
    contactHref?: string;
  };
  contact: { items: ContactItem[]; email?: string; mapUrl?: string };
  footer: { description?: string; copyright?: string };
};
