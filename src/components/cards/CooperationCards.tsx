import { mediaManifest } from "../../content/assets";
import type { CooperationItem, MediaManifest, Partner } from "../../content/types";
import { useLabels } from "../../content/labels";
import { cn } from "../../lib/cn";
import { PartnerLogo } from "../media/PartnerLogo";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { bodyCopyTypography } from "../ui/typography";

export function CooperationTypeCard({ item }: { item: CooperationItem }) {
  const { cooperationSectionLabels } = useLabels();
  return (
    <Card
      data-cooperation-card
      className="border-aic-tech/35 border-l-4 border-l-aic-tech bg-white shadow-card transition-all hover:-translate-y-1 hover:border-aic-tech/65 hover:shadow-soft"
    >
      <h3 className="font-display font-bold text-aic-navy">{item.title}</h3>
      <p className={cn("mt-3 text-aic-muted", bodyCopyTypography)}>{item.description}</p>
      {item.cta && (
        <Button href={item.cta} variant="ghost" className="mt-5">
          {cooperationSectionLabels.learnMore}
        </Button>
      )}
    </Card>
  );
}

export function InternationalCooperationBanner({ item }: { item: CooperationItem }) {
  return (
    <div
      data-testid="cooperation-international-banner"
      className="w-full rounded-card bg-aic-navy p-7 text-white shadow-soft md:p-9"
    >
      <h2 className="font-display text-2xl font-bold">{item.title}</h2>
      <p className={cn("mt-3 max-w-4xl text-white/85", bodyCopyTypography)}>{item.description}</p>
    </div>
  );
}

export function PartnerGrid({
  partners,
  manifest = mediaManifest,
}: {
  partners: Partner[];
  manifest?: MediaManifest;
}) {
  if (!partners.length) return null;

  // Ensure enough items for an infinite marquee
  const displayPartners =
    partners.length < 5
      ? Array(Math.ceil(5 / partners.length))
          .fill(partners)
          .flat()
      : partners;

  return (
    <div
      data-testid="partner-grid"
      data-layout="marquee"
      data-reduced-motion-layout="static"
      className="partner-marquee group overflow-hidden motion-reduce:[mask-image:none]"
    >
      <div className="partner-track flex w-max gap-0 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">
        <div data-marquee-group="primary" className="partner-primary flex shrink-0 gap-4 pr-4">
          {displayPartners.map((partner, index) => (
            <PartnerLogo
              key={`${partner.id}-${index}`}
              partner={partner}
              manifest={manifest}
              className="w-44 shrink-0 motion-reduce:w-full"
            />
          ))}
        </div>
        <div
          data-marquee-group="duplicate"
          data-marquee-duplicate
          className="partner-duplicate flex shrink-0 gap-4 pr-4"
          aria-hidden="true"
        >
          {displayPartners.map((partner, index) => (
            <PartnerLogo
              key={`${partner.id}-duplicate-${index}`}
              partner={partner}
              manifest={manifest}
              className="w-44 shrink-0"
              tabIndex={-1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export function CooperationCTA({
  href,
  title,
  buttonLabel,
  description,
  headingLevel = 3,
  tone = "navy",
}: {
  href?: string;
  title: string;
  buttonLabel: string;
  description?: string;
  headingLevel?: 2 | 3;
  tone?: "navy" | "light";
}) {
  if (!href) return null;
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <div
      className={cn(
        "rounded-media p-8 text-center md:p-12",
        tone === "light"
          ? "border border-aic-line bg-white text-aic-navy shadow-soft"
          : "bg-aic-navy text-white",
      )}
    >
      <Heading className="font-display text-3xl font-bold">{title}</Heading>
      {description && (
        <p
          className={cn(
            "mx-auto mt-4 max-w-2xl",
            tone === "light" ? "text-aic-muted" : "text-white/80",
          )}
        >
          {description}
        </p>
      )}
      <Button href={href} variant="secondary" className="mt-6">
        {buttonLabel}
      </Button>
    </div>
  );
}
