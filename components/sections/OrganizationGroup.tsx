import type { ContentState, Person } from "../../content/types";
import { PersonGrid, type OrganizationPersonVariant } from "../cards/PersonCard";
import { PersonCardSkeleton } from "../scaffold/ScaffoldBlocks";
import { SectionHeading } from "../ui/SectionHeading";

const gridClasses: Record<OrganizationPersonVariant, string> = {
  director: "grid-cols-1",
  teacher: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  student: "grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-6",
};

export function OrganizationGroup({
  title,
  state,
  variant,
  className: customClassName,
}: {
  title: string;
  state: ContentState<Person>;
  variant: OrganizationPersonVariant;
  className?: string;
}) {
  if (state.status === "empty") return null;

  return (
    <div data-organization-variant={variant} className={customClassName}>
      {title && <SectionHeading title={title} className="mb-7 border-b border-aic-line pb-4" />}
      {state.status === "scaffold" ? (
        <PersonCardSkeleton count={state.expectedCount} variant={variant} />
      ) : (
        <PersonGrid
          people={state.items}
          variant={variant}
          className={gridClasses[variant]}
          testId={`organization-${variant}-grid`}
        />
      )}
    </div>
  );
}
