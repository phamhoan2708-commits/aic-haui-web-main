import type { Person } from "../../content/types";
import { useLabels } from "../../content/labels";
import { cn } from "../../lib/cn";
import { AvatarFrame } from "../media/AvatarFrame";
import { Card } from "../ui/Card";
import { bodyCopyTypography, cardHeadingTypography } from "../ui/typography";

export function BiographyDrawer({ person }: { person: Person }) {
  const { personCardLabels } = useLabels();
  if (!person.bio) return null;
  return (
    <details className="mt-4 border-t border-aic-line pt-3 text-sm text-aic-muted">
      <summary className="cursor-pointer font-semibold text-aic-blue">
        {personCardLabels.biography}
      </summary>
      <p className={cn("mt-2", bodyCopyTypography)}>{person.bio}</p>
    </details>
  );
}

export type PersonCardVariant = "legacy" | "director" | "teacher" | "student";
export type OrganizationPersonVariant = Exclude<PersonCardVariant, "legacy">;

function PersonPortrait({
  person,
  className,
  staffMotion = false,
}: {
  person: Person;
  className?: string;
  staffMotion?: boolean;
}) {
  const { personCardLabels } = useLabels();
  if (!person.image && !person.mediaRef) return null;

  return (
    <div
      data-person-portrait
      className={cn(
        "overflow-hidden",
        staffMotion &&
          "[&_img]:transition-transform [&_img]:duration-500 group-hover:[&_img]:scale-[1.2] motion-reduce:[&_img]:!transform-none motion-reduce:[&_img]:transition-none",
        className,
      )}
    >
      <AvatarFrame
        asset={person.image}
        mediaRef={person.mediaRef}
        alt={personCardLabels.portrait(person.name)}
        className="h-full w-full rounded-[inherit] shadow-none"
      />
    </div>
  );
}

export function PersonCard({
  person,
  variant = "legacy",
  className,
}: {
  person: Person;
  variant?: PersonCardVariant;
  className?: string;
}) {
  if (variant === "teacher") {
    return (
      <Card
        className={cn("group flex items-center gap-4 p-4 md:p-4", className)}
        data-person-variant="teacher"
      >
        <PersonPortrait
          person={person}
          staffMotion
          className="!aspect-square h-16 w-16 shrink-0 rounded-xl shadow-none"
        />
        <div className="min-w-0">
          <h3 className="font-display font-bold text-aic-navy">{person.name}</h3>
          <p className="mt-1 text-xs font-semibold text-aic-gold-dark">{person.role}</p>
          {person.email && (
            <a
              className="mt-2 block break-all text-xs font-semibold text-aic-blue hover:underline"
              href={`mailto:${person.email}`}
            >
              {person.email}
            </a>
          )}
          {person.tags && person.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {person.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-aic-mist px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-aic-blue"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    );
  }

  if (variant === "student") {
    return (
      <article className={cn("group text-center", className)} data-person-variant="student">
        <PersonPortrait
          person={person}
          className="mx-auto !aspect-square h-20 w-20 rounded-2xl shadow-none"
        />
        <h3 className={cn("mt-3 font-display text-aic-navy", cardHeadingTypography)}>
          {person.name}
        </h3>
        <p className="mt-1 text-xs leading-5 text-aic-blue">{person.role}</p>
      </article>
    );
  }

  if (variant === "legacy") {
    return (
      <Card className={cn("group overflow-hidden p-0", className)} data-person-variant="legacy">
        <PersonPortrait person={person} />
        <div className="p-5">
          <h3 className="font-display font-bold text-aic-navy">{person.name}</h3>
          <p className="mt-1 text-xs font-bold uppercase tracking-wide text-aic-gold-dark">
            {person.role}
          </p>
          {person.email && (
            <a
              className="mt-3 block text-sm text-aic-blue hover:underline"
              href={`mailto:${person.email}`}
            >
              {person.email}
            </a>
          )}
          <BiographyDrawer person={person} />
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "group overflow-hidden !rounded-2xl border-aic-line/70 bg-white p-0 text-center shadow-nested transition-all duration-300 hover:-translate-y-1 hover:shadow-nested-hover",
        className,
      )}
      data-person-variant="director"
    >
      <div className="flex justify-center rounded-2xl bg-white px-5 pt-6">
        <PersonPortrait
          person={person}
          staffMotion
          className="!aspect-square h-36 w-36 shrink-0 rounded-2xl shadow-soft [&_img]:object-contain"
        />
      </div>
      <div className="p-5 pt-4">
        <h3 className="font-display font-bold text-aic-navy">{person.name}</h3>
        <p className="mt-1 text-xs font-bold tracking-wide text-aic-gold-dark">{person.role}</p>
        {person.bio && (
          <p className={cn("mt-4 text-aic-muted", bodyCopyTypography)}>{person.bio}</p>
        )}
        {person.email && (
          <a
            className="mt-4 block break-all text-sm font-semibold text-aic-blue hover:underline"
            href={`mailto:${person.email}`}
          >
            {person.email}
          </a>
        )}
      </div>
    </Card>
  );
}

export function PersonGrid({
  people,
  variant,
  className,
  testId,
  itemClassName,
}: {
  people: Person[];
  variant?: PersonCardVariant;
  className?: string;
  testId?: string;
  itemClassName?: (person: Person, index: number) => string | undefined;
}) {
  const resolvedVariant = variant ?? "legacy";

  return (
    <div
      className={cn("grid gap-5", className ?? "sm:grid-cols-2 lg:grid-cols-3")}
      data-testid={testId}
      data-person-grid-variant={resolvedVariant}
    >
      {people.map((person, index) => (
        <PersonCard
          key={person.id}
          person={person}
          variant={resolvedVariant}
          className={itemClassName?.(person, index)}
        />
      ))}
    </div>
  );
}
