import type { SiteContent } from "../../content/types";
import type { AboutSectionLabels } from "../../content/labels";
import { useLabels } from "../../content/labels";
import { sectionAccents } from "../../content/section-theme";
import { VideoFrame } from "../media/VideoFrame";
import { PageContainer } from "../ui/PageContainer";
import { Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";
import { bodyCopyTypography } from "../ui/typography";
import { cn } from "../../lib/cn";

type HomeAboutProps = {
  content: SiteContent["about"];
  title: string;
  labels: AboutSectionLabels;
  showVideo?: boolean;
  showParentUnit?: boolean;
  sectionId?: string;
  landingSection?: boolean;
  testId?: string;
  /**
   * When true, the intro text renders as a single caption line directly
   * under the title instead of a boxed column next to Vision/Mission.
   */
  introAsCaption?: boolean;
  /**
   * When introAsCaption is true, controls whether the intro text is shown
   * as the heading's description line. Set to false when the intro is
   * already shown elsewhere (e.g. the About page's Hero banner).
   */
  showIntroCaption?: boolean;
  /**
   * Visual tone for this block. "navy" is used for the single-page landing's
   * "Về chúng tôi" section: deep navy background with white heading/body text.
   */
  tone?: "light" | "navy";
};

export function HomeAbout({
  content,
  title,
  labels,
  showVideo = true,
  showParentUnit = false,
  sectionId,
  landingSection = false,
  testId,
  introAsCaption = false,
  showIntroCaption = true,
  tone = "light",
}: HomeAboutProps) {
  const isNavy = tone === "navy";
  const headingInvertClassName = isNavy
    ? "[&_h2]:!text-white [&_.section-description]:!text-white/75"
    : undefined;
  const { navigationLabels } = useLabels();
  const accent = sectionAccents["ve-chung-toi"];

  return (
    <>
      <Section
        id={sectionId}
        data-landing-section={landingSection ? "" : undefined}
        data-testid={testId}
        className={cn(
          "section-reveal scroll-mt-[var(--landing-header-offset)] overflow-hidden py-16 md:py-20 lg:py-24",
          isNavy ? "bg-aic-navy-deep" : "bg-white",
        )}
      >
        <PageContainer>
          {/* Centered Title and Caption */}
          <div className="mb-14 text-center md:mb-16 lg:mb-20">
            <SectionHeading
              title={title}
              description={introAsCaption && showIntroCaption ? content.intro : undefined}
              eyebrow={landingSection ? navigationLabels.about.toUpperCase() : undefined}
              eyebrowClassName={accent.eyebrowClassName}
              accentClassName={accent.accentClassName}
              align="center"
              className={headingInvertClassName}
            />
            {!landingSection && labels.foundedDate && (
              <p className="mt-3 text-sm font-medium uppercase tracking-wider text-aic-muted/80">
                {labels.foundedDate}
              </p>
            )}
          </div>

          {introAsCaption ? (
            /* Vision & Mission - full width, side by side */
            <div data-testid="about-principles" className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              {content.vision && (
                <article className="rounded-lg border border-aic-line bg-white p-6 sm:p-8 lg:p-10 shadow-card hover:shadow-md transition-shadow">
                  <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-aic-blue mb-3">
                    {labels.visionHeading}
                  </h3>
                  <p className={cn("text-aic-muted leading-relaxed", bodyCopyTypography)}>{content.vision}</p>
                </article>
              )}
              {content.mission && (
                <article className="rounded-lg border border-aic-line bg-white p-6 sm:p-8 lg:p-10 shadow-card hover:shadow-md transition-shadow">
                  <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-aic-blue mb-3">
                    {labels.missionHeading}
                  </h3>
                  <p className={cn("text-aic-muted leading-relaxed", bodyCopyTypography)}>{content.mission}</p>
                </article>
              )}
            </div>
          ) : (
            /* Two Column Content Below */
            <div className="grid gap-8 md:gap-10 lg:grid-cols-2">
              {/* Left Column - Intro */}
              <div className="flex flex-col justify-start">
                {content.intro && (
                  <div className="rounded-lg border border-aic-line bg-aic-mist/40 p-6 sm:p-8 lg:p-10 shadow-soft">
                    <p className={cn("text-aic-muted leading-relaxed", bodyCopyTypography)}>
                      {content.intro}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column - Vision & Mission */}
              <div
                data-testid="about-principles"
                className="grid grid-cols-1 gap-6 md:gap-8"
              >
                {content.vision && (
                  <article className="rounded-lg border border-aic-line bg-white p-6 sm:p-8 lg:p-10 shadow-card hover:shadow-md transition-shadow">
                    <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-aic-blue mb-3">
                      {labels.visionHeading}
                    </h3>
                    <p className={cn("text-aic-muted leading-relaxed", bodyCopyTypography)}>{content.vision}</p>
                  </article>
                )}
                {content.mission && (
                  <article className="rounded-lg border border-aic-line bg-white p-6 sm:p-8 lg:p-10 shadow-card hover:shadow-md transition-shadow">
                    <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-aic-blue mb-3">
                      {labels.missionHeading}
                    </h3>
                    <p className={cn("text-aic-muted leading-relaxed", bodyCopyTypography)}>{content.mission}</p>
                  </article>
                )}
              </div>
            </div>
          )}
        </PageContainer>
      </Section>
      {showVideo && (
        <Section
          data-testid="home-video"
          className={cn(
            "section-reveal py-16 md:py-20 lg:py-24",
            isNavy ? "bg-aic-navy-deep" : "bg-aic-mist/50",
          )}
        >
          <PageContainer>
            <SectionHeading
              title={labels.videoHeading}
              align="center"
              className={cn("mb-12", headingInvertClassName)}
            />
            <div className="mx-auto max-w-5xl">
              <VideoFrame mediaRef="about.intro-video" />
            </div>
          </PageContainer>
        </Section>
      )}
      {showParentUnit && content.parentUnit && (
        <Section className="section-reveal bg-white py-16 md:py-20 lg:py-24">
          <PageContainer>
            <div className="rounded-lg border border-aic-line bg-aic-mist/40 p-8 md:p-12 lg:p-14 shadow-soft">
              <SectionHeading title={labels.parentUnitHeading} className="mb-6" />
              <p className={cn("max-w-3xl text-aic-muted leading-relaxed", bodyCopyTypography)}>
                {content.parentUnit}
              </p>
            </div>
          </PageContainer>
        </Section>
      )}
    </>
  );
}
