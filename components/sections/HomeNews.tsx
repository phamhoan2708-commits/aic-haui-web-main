import { PageContainer } from "../ui/PageContainer";
import { Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";
import { Card } from "../ui/Card";
import { Link } from "react-router-dom";
import { useLabels } from "../../content/labels";
import { cn } from "../../lib/cn";
import { cardHeadingTypography } from "../ui/typography";

export function HomeNews({ sectionId }: { sectionId?: string }) {
  const { homeNewsLabels, navigationLabels } = useLabels();

  return (
    <Section
      id={sectionId}
      data-landing-section={sectionId ? "" : undefined}
      data-testid="home-news"
      className="scroll-mt-[var(--landing-header-offset)] bg-white"
    >
      <PageContainer>
        <SectionHeading
          title={homeNewsLabels.title}
          description={homeNewsLabels.description}
          eyebrow={navigationLabels.news.toUpperCase()}
          eyebrowClassName="text-aic-blue"
          accentClassName="bg-aic-blue"
          align="center"
          className="mb-10"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {homeNewsLabels.items.map((news) => (
            <Card
              key={news.id}
              className="group flex flex-col justify-between !rounded-xl border border-aic-line/60 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div>
                <div className="mb-4 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                  <span className="text-aic-blue">{news.category}</span>
                  <span className="text-aic-muted">{news.date}</span>
                </div>
                <h3
                  className={cn(
                    "font-display text-aic-navy transition-colors group-hover:text-aic-blue",
                    cardHeadingTypography,
                  )}
                >
                  <Link to="#">{news.title}</Link>
                </h3>
              </div>
              <div className="mt-6">
                <span className="text-sm font-semibold text-aic-blue group-hover:underline">
                  {homeNewsLabels.readMore} &rarr;
                </span>
              </div>
            </Card>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}
