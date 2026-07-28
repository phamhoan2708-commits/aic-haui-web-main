import type { ContactItem } from "../../content/types";
import { cn } from "../../lib/cn";
import { Card } from "../ui/Card";
import { bodyCopyTypography, cardHeadingTypography } from "../ui/typography";

type ContactHeadingLevel = 2 | 3;

export function ContactCard({
  item,
  headingLevel = 3,
}: {
  item: ContactItem;
  headingLevel?: ContactHeadingLevel;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const content = (
    <>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-aic-gold-dark">
        {item.label}
      </p>
      <Heading className={cn("mt-3 font-display text-aic-navy", cardHeadingTypography)}>
        {item.primary}
      </Heading>
      {item.secondary && (
        <p className={cn("mt-2 text-aic-muted", bodyCopyTypography)}>{item.secondary}</p>
      )}
    </>
  );
  return item.href ? (
    <a
      href={item.href}
      data-contact-card={item.id}
      className="rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aic-blue"
    >
      <Card>{content}</Card>
    </a>
  ) : (
    <Card data-contact-card={item.id}>{content}</Card>
  );
}
export function ContactGrid({
  items,
  className = "",
  headingLevel = 3,
}: {
  items: ContactItem[];
  className?: string;
  headingLevel?: ContactHeadingLevel;
}) {
  return (
    <div className={`grid gap-4 ${className}`.trim()}>
      {items.map((item) => (
        <ContactCard key={item.id} item={item} headingLevel={headingLevel} />
      ))}
    </div>
  );
}
