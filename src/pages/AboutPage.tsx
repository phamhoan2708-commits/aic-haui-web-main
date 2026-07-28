import { RouteTransition } from "../components/layout/RouteTransition";
import { HomeAbout } from "../components/sections/HomeAbout";
import { OrganizationContent } from "../components/sections/OrganizationContent";
import { PageHero } from "../components/sections/PageHero";
import { PageContainer } from "../components/ui/PageContainer";
import { Section } from "../components/ui/Section";
import { useLabels } from "../content/labels";
import { useSiteContent } from "../content/site";

export function AboutPage() {
  const siteContent = useSiteContent();
  const { aboutSectionLabels } = useLabels();
  return (
    <RouteTransition>
      <PageHero
        copy={{
          ...siteContent.pages.about,
          description: siteContent.about.intro ?? siteContent.pages.about.description,
        }}
      />
      <HomeAbout
        content={siteContent.about}
        title={aboutSectionLabels.introHeading}
        labels={aboutSectionLabels}
        showVideo={false}
        showParentUnit
        introAsCaption
        showIntroCaption={false}
      />
      <Section className="section-reveal bg-aic-mist/20 py-16 md:py-20 lg:py-24 border-t border-aic-line">
        <PageContainer>
          <OrganizationContent content={siteContent} showHeading={true} />
        </PageContainer>
      </Section>
    </RouteTransition>
  );
}
