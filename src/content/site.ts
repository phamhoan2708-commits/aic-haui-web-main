import { stitchContent } from "./stitch";
import type { StitchContent } from "./stitch";
import type {
  CooperationItem,
  ContentSource,
  CouncilMember,
  JoinStep,
  Lab,
  Metric,
  Partner,
  Person,
  ResearchItem,
  SiteContent,
} from "./types";
import { verifiedSiteContentVi, verifiedSiteContentEn } from "./verified";
import { stitchContentEn } from "./stitchEn";
import { useLanguage } from "../contexts/language";

type IdentifiedRecord = { id: string };
type SourcedIdentifiedRecord = IdentifiedRecord & { source?: ContentSource };
type RecordCloner<T> = (record: T) => T;
export type VerifiedRecord<T extends SourcedIdentifiedRecord> = T & { source: "verified" };

const cloneRecord = <T extends IdentifiedRecord>(record: T): T => ({ ...record });

function isVerifiedRecord<T extends SourcedIdentifiedRecord>(
  record: T,
): record is VerifiedRecord<T> {
  return record.source === "verified";
}

export function mergeRecordsById<T extends SourcedIdentifiedRecord>(
  verified: readonly T[],
  demo: readonly T[],
  clone: RecordCloner<T> = cloneRecord,
): T[] {
  const verifiedRecords = verified.filter(isVerifiedRecord);
  const verifiedById = new Map(verifiedRecords.map((record) => [record.id, record]));
  const demoIds = new Set(demo.map((record) => record.id));
  const merged = demo.map((record) => clone(verifiedById.get(record.id) ?? record));

  for (const record of verifiedRecords) {
    if (!demoIds.has(record.id)) merged.push(clone(record));
  }

  return merged;
}

const clonePerson: RecordCloner<Person> = (person) => ({
  ...person,
  tags: person.tags ? [...person.tags] : undefined,
  image: person.image ? { ...person.image } : undefined,
});

const cloneResearchItem: RecordCloner<ResearchItem> = (item) => ({
  ...item,
  tags: item.tags ? [...item.tags] : undefined,
  image: item.image ? { ...item.image } : undefined,
});

const cloneLab: RecordCloner<Lab> = (lab) => ({
  ...lab,
  activities: lab.activities ? [...lab.activities] : undefined,
  benefits: lab.benefits ? [...lab.benefits] : undefined,
  image: lab.image ? { ...lab.image } : undefined,
});

const clonePartner: RecordCloner<Partner> = (partner) => ({
  ...partner,
  logo: partner.logo ? { ...partner.logo } : undefined,
});

function composeLabs(verified: readonly Lab[], demo: readonly Lab[]): Lab[] {
  const verifiedById = new Map(verified.map((lab) => [lab.id, lab]));
  const demoIds = new Set(demo.map((lab) => lab.id));
  const composed = demo.map((lab) => {
    const replacement = verifiedById.get(lab.id);

    if (!replacement) return cloneLab(lab);
    if (replacement.source === "verified") return cloneLab(replacement);

    return cloneLab({ ...lab, name: replacement.name });
  });

  for (const lab of verified) {
    if (!demoIds.has(lab.id) && lab.source === "verified") composed.push(cloneLab(lab));
  }
  return composed;
}

export function composeSiteContent(verified: SiteContent, demo: StitchContent): SiteContent {
  const hero = { ...verified.hero, ...demo.hero };

  return {
    ...verified,
    identity: { ...verified.identity },
    hero: { ...hero, media: hero.media ? { ...hero.media } : undefined },
    pages: {
      about: { ...verified.pages.about, ...demo.pages.about },
      organization: { ...verified.pages.organization, ...demo.pages.organization },
      research: { ...verified.pages.research, ...demo.pages.research },
      cooperation: { ...verified.pages.cooperation, ...demo.pages.cooperation },
      students: { ...verified.pages.students, ...demo.pages.students },
      contact: { ...verified.pages.contact, ...demo.pages.contact },
    },
    about: {
      ...verified.about,
      video: verified.about.video ? { ...verified.about.video } : undefined,
    },
    people: mergeRecordsById(verified.people, demo.people, clonePerson),
    research: {
      directions: mergeRecordsById(
        verified.research.directions,
        demo.research.directions,
        cloneResearchItem,
      ),
      metrics: mergeRecordsById<Metric>(verified.research.metrics ?? [], demo.research.metrics),
      council: mergeRecordsById<CouncilMember>(
        verified.research.council ?? [],
        demo.research.council,
      ),
      results: mergeRecordsById(
        verified.research.results,
        demo.research.results,
        cloneResearchItem,
      ),
      groups: mergeRecordsById(verified.research.groups, demo.research.groups, cloneResearchItem),
      activities: mergeRecordsById(
        verified.research.activities,
        demo.research.activities,
        cloneResearchItem,
      ),
    },
    cooperation: {
      enterprise: mergeRecordsById<CooperationItem>(
        verified.cooperation.enterprise,
        demo.cooperation.enterprise,
      ),
      research: mergeRecordsById<CooperationItem>(
        verified.cooperation.research,
        demo.cooperation.research,
      ),
      international: mergeRecordsById<CooperationItem>(
        verified.cooperation.international,
        demo.cooperation.international,
      ),
      technologyTransfer: mergeRecordsById<CooperationItem>(
        verified.cooperation.technologyTransfer,
        demo.cooperation.technologyTransfer,
      ),
      partners: mergeRecordsById(
        verified.cooperation.partners,
        demo.cooperation.partners,
        clonePartner,
      ),
      contactHref: verified.cooperation.contactHref,
    },
    students: {
      ...verified.students,
      labs: composeLabs(verified.students.labs, demo.students.labs),
      joinSteps: mergeRecordsById<JoinStep>(verified.students.joinSteps, demo.students.joinSteps),
      contactHref: verified.students.contactHref,
    },
    contact: {
      ...verified.contact,
      // Sử dụng ép kiểu (any) tạm thời để vượt qua kiểm tra của TS vì StitchContent thiếu trường này
      mapUrl: verified.contact.mapUrl || demo.contact?.mapUrl,
      email: verified.contact.email || demo.contact?.email,
      items: verified.contact.items.map((item) => ({ ...item })),
    },
    footer: { ...verified.footer, ...demo.footer },
  };
}

export function useSiteContent(): SiteContent {
  const { language } = useLanguage();
  const verified = language === "en" ? verifiedSiteContentEn : verifiedSiteContentVi;
  const demo = language === "en" ? stitchContentEn : stitchContent;
  return composeSiteContent(verified, demo);
}

export const siteContent = composeSiteContent(verifiedSiteContentVi, stitchContent);
