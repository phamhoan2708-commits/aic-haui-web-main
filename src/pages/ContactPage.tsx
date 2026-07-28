import { ContactGrid } from "../components/cards/ContactCards";
import { RouteTransition } from "../components/layout/RouteTransition";
import { PageHero } from "../components/sections/PageHero";
import { PageContainer } from "../components/ui/PageContainer";
import { Section } from "../components/ui/Section";
import { useSiteContent } from "../content/site";
import type { SiteContent } from "../content/types";
import { useLabels } from "../content/labels";

export function ContactPage({ content }: { content?: SiteContent; scaffoldMode?: boolean }) {
  const defaultContent = useSiteContent();
  const actualContent = content || defaultContent;
  const { contactSectionLabels } = useLabels();
  const data = actualContent.contact;

  const heroCopy = actualContent.pages.contact;

  // Link bản đồ trực tiếp
  const mapUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4198.604558332043!2d105.73253187574224!3d21.053730980601824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345457e292d5bf%3A0x20ac91c94d74439a!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2hp4buHcCBIw6AgTuG7mWk!5e1!3m2!1svi!2s!4v1784371246244!5m2!1svi!2s";

  return (
    <RouteTransition>
      <PageHero copy={heroCopy} />
      <Section className="bg-aic-mist/55">
        <PageContainer>
          <div className="grid min-w-0 gap-6 md:grid-cols-[.75fr_1.5fr] py-8">
            <div className="min-w-0">
              <ContactGrid items={data.items} headingLevel={2} />
            </div>

            <div className="min-w-0 w-full h-[500px] rounded-2xl overflow-hidden shadow-lg border-2 border-white">
              <iframe
                src={data.mapUrl || mapUrl}
                style={{ width: "100%", height: "100%", border: "none" }}
                allowFullScreen
                loading="lazy"
                title={contactSectionLabels.mapTitle}
              ></iframe>
            </div>
          </div>
        </PageContainer>
      </Section>
    </RouteTransition>
  );
}
