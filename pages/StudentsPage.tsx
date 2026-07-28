import type { ReactNode } from "react";

import {
  JoinProcess,
  LabComparison,
  StudentCTA,
  StudentHero,
} from "../components/cards/StudentCards";
import { RouteTransition } from "../components/layout/RouteTransition";
import {
  LabCardSkeleton,
  MediaSkeleton,
  TimelineSkeleton,
} from "../components/scaffold/ScaffoldBlocks";
import { PageContainer } from "../components/ui/PageContainer";
import { Section } from "../components/ui/Section";
import { SectionHeading } from "../components/ui/SectionHeading";
import { useLabels } from "../content/labels";
import { sectionAccents } from "../content/section-theme";
import { resolveSectionState, uiScaffoldMode } from "../content/selectors";
import { useSiteContent } from "../content/site";
import type { ContentState, SiteContent } from "../content/types";
import { scaffoldConfig } from "../scaffold/config";
import { SectionRenderer } from "../scaffold/SectionRenderer";

function StudentSection({
  id,
  title,
  description,
  state,
  scaffold,
  children,
  tone = "white",
}: {
  id?: string;
  title: string;
  description: string;
  state: ContentState<unknown>;
  scaffold: ReactNode;
  children: ReactNode;
  tone?: "white" | "mist" | "navy";
}) {
  if (state.status === "empty") return null;

  const bgClass = tone === "white" ? "bg-white" : tone === "navy" ? "bg-aic-navy-deep" : "bg-aic-mist/50";
  const headingClassName =
    tone === "navy" ? "mb-12 md:mb-14 lg:mb-16 [&_h2]:!text-white [&_.section-description]:!text-white/75" : "mb-12 md:mb-14 lg:mb-16";

  return (
    <Section id={id} className={`section-reveal ${bgClass} py-16 md:py-20 lg:py-24`}>
      <PageContainer>
        <SectionHeading
          title={title}
          description={description}
          align="center"
          emphasis="feature"
          className={headingClassName}
        />
        <SectionRenderer state={state} scaffold={scaffold}>
          {children}
        </SectionRenderer>
      </PageContainer>
    </Section>
  );
}

export function StudentsPage({
  content,
  scaffoldMode = uiScaffoldMode,
  embedded = false,
}: {
  content?: SiteContent;
  scaffoldMode?: boolean;
  embedded?: boolean;
}) {
  const defaultContent = useSiteContent();
  const { studentSectionLabels, navigationLabels } = useLabels();
  const actualContent = content || defaultContent;
  const data = actualContent.students;
  const labsState = resolveSectionState(data.labs, scaffoldMode, scaffoldConfig.students.labs);
  const timelineState = resolveSectionState(
    data.joinSteps,
    scaffoldMode,
    scaffoldConfig.students.timeline,
  );
  const accent = sectionAccents["sinh-vien"];

  const pageContent = (
    <>
      {embedded ? (
        <Section className="section-reveal bg-aic-navy-deep py-16 md:py-20 lg:py-24">
          <PageContainer>
            <SectionHeading
              title={actualContent.pages.students.title}
              description={actualContent.pages.students.description}
              eyebrow={navigationLabels.students.toUpperCase()}
              eyebrowClassName={accent.eyebrowClassName}
              accentClassName={accent.accentClassName}
              align="center"
              emphasis="feature"
              className="mb-0 [&_h2]:!text-white [&_.section-description]:!text-white/75"
            />
          </PageContainer>
        </Section>
      ) : (
        <StudentHero
          copy={actualContent.pages.students}
          ctaHref={labsState.status === "ready" ? "#research-space" : undefined}
          ctaLabel={studentSectionLabels.heroCta}
          scaffold={scaffoldMode ? <MediaSkeleton className="aspect-[4/3]" /> : undefined}
        />
      )}
      <StudentSection
        id="research-space"
        title={studentSectionLabels.researchSpace}
        description={studentSectionLabels.researchSpaceDescription}
        state={labsState}
        scaffold={<LabCardSkeleton count={scaffoldConfig.students.labs} />}
        tone="navy"
      >
        <LabComparison labs={data.labs} />
      </StudentSection>
      <StudentSection
        title={studentSectionLabels.timeline}
        description={studentSectionLabels.timelineDescription}
        state={timelineState}
        scaffold={<TimelineSkeleton count={scaffoldConfig.students.timeline} />}
        tone="navy"
      >
        <JoinProcess steps={data.joinSteps} />
      </StudentSection>
      {data.contactHref && (
        <Section className="bg-aic-navy-deep py-16 md:py-20 lg:py-24">
          <PageContainer>
            <StudentCTA
              href={data.contactHref}
              title={studentSectionLabels.closingTitle}
              buttonLabel={studentSectionLabels.closingButton}
            />
          </PageContainer>
        </Section>
      )}
    </>
  );

  return embedded ? pageContent : <RouteTransition>{pageContent}</RouteTransition>;
}
