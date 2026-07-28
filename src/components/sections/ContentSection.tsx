import type { ReactNode } from "react";
import type { ContentState } from "../../content/types";
import { SectionRenderer } from "../../scaffold/SectionRenderer";
import { PageContainer } from "../ui/PageContainer";
import { Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";

const toneClassName = {
  white: "section-reveal bg-white py-20 md:py-30 lg:py-40",
  mist: "section-reveal bg-aic-mist/50 py-20 md:py-30 lg:py-40",
  navy: "section-reveal bg-aic-navy py-20 md:py-30 lg:py-40",
} as const;

export function ContentSection({
  title,
  description,
  state,
  scaffold,
  children,
  tone = "white",
  headingAlign = "left",
  headingEmphasis = "standard",
  containerClassName,
}: {
  title: string;
  description?: string;
  state: ContentState<unknown>;
  scaffold?: ReactNode;
  children: ReactNode;
  tone?: "white" | "mist" | "navy";
  headingAlign?: "left" | "center";
  headingEmphasis?: "standard" | "feature";
  /** Extra classes applied to the inner PageContainer, e.g. to widen it beyond the default max width. */
  containerClassName?: string;
}) {
  if (state.status === "empty") return null;

  return (
    <Section className={toneClassName[tone]}>
      <PageContainer className={containerClassName}>
        <SectionHeading
          title={title}
          description={description}
          align={headingAlign}
          emphasis={headingEmphasis}
          invert={tone === "navy"}
          className="mb-12 md:mb-14 lg:mb-16"
        />
        <SectionRenderer state={state} scaffold={scaffold}>
          {children}
        </SectionRenderer>
      </PageContainer>
    </Section>
  );
}
