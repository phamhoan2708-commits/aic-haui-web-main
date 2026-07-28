import { RouteTransition } from "../components/layout/RouteTransition";
import { OrganizationContent } from "../components/sections/OrganizationContent";
import { PageHero } from "../components/sections/PageHero";
import { PageContainer } from "../components/ui/PageContainer";
import { Section } from "../components/ui/Section";
import { useSiteContent } from "../content/site";
import type { SiteContent } from "../content/types";

export function OrganizationPage({
  content,
  scaffoldMode,
}: {
  content?: SiteContent;
  scaffoldMode?: boolean;
}) {
  const defaultContent = useSiteContent();
  const actualContent = content || defaultContent;

  return (
    <RouteTransition>
      <PageHero copy={actualContent.pages.organization} />
      <Section className="section-reveal bg-white">
        <PageContainer>
          <OrganizationContent
            content={actualContent}
            scaffoldMode={scaffoldMode}
            showHeading={false}
          />
        </PageContainer>
      </Section>
    </RouteTransition>
  );
}
