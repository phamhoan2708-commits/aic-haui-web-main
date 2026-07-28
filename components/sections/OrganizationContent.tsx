import type { ReactNode } from "react";
import type { Person } from "../../content/types";
import { OrganizationGroup } from "./OrganizationGroup";
import { SectionHeading } from "../ui/SectionHeading";
import { useLabels } from "../../content/labels";
import { resolveSectionState } from "../../content/selectors";
import type { SiteContent } from "../../content/types";
import { cn } from "../../lib/cn";
import { scaffoldConfig } from "../../scaffold/config";
import type { OrganizationPersonVariant } from "../cards/PersonCard";

/** Alternating tint band used to visually separate each tier of the org chart. */
function TierBand({
  tone,
  className,
  children,
}: {
  tone: "a" | "b";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "w-full rounded-3xl px-6 py-10 sm:px-8 md:px-10",
        tone === "a" ? "bg-white" : "bg-aic-mist/50",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Short vertical line joining two consecutive tiers. */
function TierConnector() {
  return <div aria-hidden="true" className="h-10 w-px bg-aic-line md:h-12" />;
}

/**
 * Renders one tier of people. A single person is centered; multiple people
 * (e.g. two co-directors, several deputies) are laid out side by side with a
 * small connecting tree above them.
 */
function TierRow({
  people,
  variant,
}: {
  people: Person[];
  variant: OrganizationPersonVariant;
}) {
  if (people.length === 0) return null;

  if (people.length === 1) {
    return (
      <OrganizationGroup
        title=""
        state={{ status: "ready", items: people }}
        variant={variant}
      />
    );
  }

  return (
    <div className="relative flex w-full flex-wrap justify-center gap-8">
      <div
        aria-hidden="true"
        className="absolute left-[15%] right-[15%] top-0 h-px bg-aic-line"
      />
      {people.map((person) => (
        <div key={person.id} className="relative pt-6">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 h-6 w-px -translate-x-1/2 bg-aic-line"
          />
          <OrganizationGroup
            title=""
            state={{ status: "ready", items: [person] }}
            variant={variant}
          />
        </div>
      ))}
    </div>
  );
}

export function OrganizationContent({
  content,
  scaffoldMode,
  showHeading = true,
  eyebrow,
  eyebrowClassName,
  accentClassName,
}: {
  content: SiteContent;
  scaffoldMode?: boolean;
  showHeading?: boolean;
  /** Optional eyebrow label shown above the title (e.g. for the single-page landing). */
  eyebrow?: string;
  eyebrowClassName?: string;
  accentClassName?: string;
}) {
  const { organizationSectionLabels } = useLabels();
  const directors = content.people.filter((person) => person.group === "director");
  const teacherLeaders = content.people.filter((person) => person.group === "teacher-lab");
  const studentLeaders = content.people.filter((person) => person.group === "student-leader");

  const directorState = resolveSectionState(
    directors,
    scaffoldMode,
    scaffoldConfig.organization.directors,
  );
  const teacherState = resolveSectionState(
    teacherLeaders,
    scaffoldMode,
    scaffoldConfig.organization.teacherLeaders,
  );
  const studentState = resolveSectionState(
    studentLeaders,
    scaffoldMode,
    scaffoldConfig.organization.studentLeaders,
  );

  const showTeacher = teacherState.status !== "empty";
  const showStudent = studentState.status !== "empty";

  // Split directors into top-level director(s) and deputy director(s) for the
  // hierarchical view. There can be more than one top-level director (e.g. a
  // Scientific Director and an Executive Director side by side).
  const directorItems: Person[] = directorState.status === "ready" ? directorState.items : [];
  const topDirectors = directorItems.filter((p) => !p.role.toLowerCase().includes("phó"));
  const deputyDirectors = directorItems.filter((p) => p.role.toLowerCase().includes("phó"));
  const showTopDirectors = topDirectors.length > 0;
  const showDeputyDirectors = deputyDirectors.length > 0;

  return (
    <div className="flex flex-col items-center">
      {showHeading && (
        <SectionHeading
          title={content.pages.organization.title}
          description={content.pages.organization.description}
          eyebrow={eyebrow}
          eyebrowClassName={eyebrowClassName}
          accentClassName={accentClassName}
          align="center"
          className="mb-12 md:mb-14 lg:mb-16"
        />
      )}

      {/* Hierarchical Chart */}
      <div className="flex w-full max-w-5xl flex-col items-center">
        {/* Level 1: Director(s) */}
        {showTopDirectors && (
          <>
            <TierBand tone="a" className="flex flex-col items-center">
              <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-aic-blue/70">
                {organizationSectionLabels.directors}
              </h3>
              <TierRow people={topDirectors} variant="director" />
            </TierBand>
            {(showDeputyDirectors || showTeacher) && <TierConnector />}
          </>
        )}

        {/* Level 2: Deputy Director(s) */}
        {showDeputyDirectors && (
          <>
            <TierBand tone="b" className="flex flex-col items-center">
              <TierRow people={deputyDirectors} variant="director" />
            </TierBand>
            {showTeacher && <TierConnector />}
          </>
        )}

        {/* Level 3: Research Group Leaders (Teachers) */}
        {showTeacher && (
          <>
            <TierBand tone={showDeputyDirectors ? "a" : "b"} className="flex flex-col items-center">
              <h3 className="mb-8 text-sm font-bold uppercase tracking-widest text-aic-blue/70">
                {organizationSectionLabels.teacherLeaders}
              </h3>
              <div className="w-full">
                <OrganizationGroup title="" state={teacherState} variant="teacher" />
              </div>
            </TierBand>
            {showStudent && <TierConnector />}
          </>
        )}

        {/* Level 4: Student Leaders (Optional but included for completeness) */}
        {showStudent && (
          <TierBand
            tone={showTeacher ? (showDeputyDirectors ? "b" : "a") : "b"}
            className="flex flex-col items-center"
          >
            <OrganizationGroup
              title={organizationSectionLabels.studentLeaders}
              state={studentState}
              variant="student"
            />
          </TierBand>
        )}
      </div>
    </div>
  );
}
