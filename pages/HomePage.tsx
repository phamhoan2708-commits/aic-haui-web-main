import { ContactGrid } from "../components/cards/ContactCards";
import { RouteTransition } from "../components/layout/RouteTransition";
import { MapFrame } from "../components/media/MapFrame";
import { DynamicHero } from "../components/sections/DynamicHero";
import { HomeAbout } from "../components/sections/HomeAbout";
import { OrganizationContent } from "../components/sections/OrganizationContent";
import { ResearchPage } from "./ResearchPage";
import { CooperationPage } from "./CooperationPage";
import { StudentsPage } from "./StudentsPage";
import { PageContainer } from "../components/ui/PageContainer";
import { Section } from "../components/ui/Section";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Reveal } from "../components/ui/Reveal";
import { useSiteContent } from "../content/site";
import { useLabels } from "../content/labels";
import { sectionAccents } from "../content/section-theme";

export function HomePage() {
  const siteContent = useSiteContent();
  const { aboutSectionLabels, contactSectionLabels, navigationLabels } = useLabels();
  const contactAccent = sectionAccents["lien-he"];
  const organizationAccent = sectionAccents["to-chuc"];

  return (
    <RouteTransition>
      <DynamicHero content={siteContent.hero} />
      <Reveal>
        <HomeAbout
          content={siteContent.about}
          title={aboutSectionLabels.homeHeading}
          labels={aboutSectionLabels}
          sectionId="ve-chung-toi"
          landingSection
          introAsCaption
          testId="home-about"
          tone="navy"
        />
      </Reveal>
      <Reveal>
        <Section
          id="to-chuc"
          data-landing-section=""
          data-testid="home-organization"
          className="scroll-mt-[var(--landing-header-offset)] bg-white py-16 md:py-20 lg:py-24"
        >
          <PageContainer>
            <OrganizationContent
              content={siteContent}
              eyebrow={navigationLabels.organization.toUpperCase()}
              eyebrowClassName={organizationAccent.eyebrowClassName}
              accentClassName={organizationAccent.accentClassName}
            />
          </PageContainer>
        </Section>
      </Reveal>
      <div
        id="nghien-cuu"
        data-landing-section=""
        className="scroll-mt-[var(--landing-header-offset)]"
      >
        <ResearchPage embedded />
      </div>
      <div
        id="hop-tac"
        data-landing-section=""
        className="scroll-mt-[var(--landing-header-offset)]"
      >
        <CooperationPage embedded />
      </div>
      <div
        id="sinh-vien"
        data-landing-section=""
        className="scroll-mt-[var(--landing-header-offset)]"
      >
        <StudentsPage embedded />
      </div>
      <Reveal>
        <Section
          id="lien-he"
          data-landing-section=""
          data-testid="home-contact"
          className="scroll-mt-[var(--landing-header-offset)] bg-white py-16 md:py-20 lg:py-24"
        >
          <PageContainer>
            <SectionHeading
              title={siteContent.pages.contact.title}
              description={siteContent.pages.contact.description}
              eyebrow={navigationLabels.contact.toUpperCase()}
              eyebrowClassName={contactAccent.eyebrowClassName}
              accentClassName={contactAccent.accentClassName}
              align="center"
              className="mb-12 md:mb-14 lg:mb-16"
            />
            <div
              data-testid="home-contact-band"
              className="grid min-w-0 gap-6 lg:grid-cols-[.75fr_1.5fr]"
            >
              <ContactGrid
                items={siteContent.contact.items}
                className="md:grid-cols-3 lg:grid-cols-1"
              />
              <div className="min-w-0 [&>div]:h-full [&>div]:min-h-72 [&>div]:w-full [&>div]:aspect-auto">
                <MapFrame mediaRef="contact.map" title={contactSectionLabels.mapTitle} />
              </div>
            </div>
          </PageContainer>
        </Section>
      </Reveal>
    </RouteTransition>
  );
}
