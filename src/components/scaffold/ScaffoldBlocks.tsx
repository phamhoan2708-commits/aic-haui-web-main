import { cn } from "../../lib/cn";
import type { PersonCardVariant } from "../cards/PersonCard";
import { Card } from "../ui/Card";
import { SkeletonBlock } from "../ui/SkeletonBlock";

function shells(count: number, render: (index: number) => React.ReactNode) {
  return Array.from({ length: count }, (_, index) => render(index));
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div data-scaffold="cards" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {shells(count, (index) => (
        <Card key={index} className="space-y-4" aria-hidden="true">
          <SkeletonBlock className="h-5 w-2/3" />
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="h-3 w-4/5" />
        </Card>
      ))}
    </div>
  );
}

export function LabCardSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div
      data-scaffold="student-labs"
      data-testid="student-labs-scaffold"
      className="grid gap-5 md:grid-cols-2"
    >
      {shells(count, (index) => (
        <Card key={index} className="space-y-4" aria-hidden="true">
          <SkeletonBlock className="aspect-[4/3] w-full" />
          <SkeletonBlock className="h-5 w-2/3" />
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="h-3 w-4/5" />
        </Card>
      ))}
    </div>
  );
}

export function ContactCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div data-scaffold="contact-cards" data-testid="contact-cards-scaffold" className="grid gap-4">
      {shells(count, (index) => (
        <Card key={index} className="space-y-4" aria-hidden="true">
          <SkeletonBlock className="h-3 w-1/3" />
          <SkeletonBlock className="h-5 w-2/3" />
          <SkeletonBlock className="h-3 w-full" />
        </Card>
      ))}
    </div>
  );
}

export function CooperationTypeSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div
      data-scaffold="cooperation-types"
      data-testid="cooperation-types-scaffold"
      className="grid grid-cols-1 gap-5 md:grid-cols-3"
    >
      {shells(count, (index) => (
        <Card key={index} className="space-y-4" aria-hidden="true">
          <SkeletonBlock className="h-5 w-2/3" />
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="h-3 w-4/5" />
        </Card>
      ))}
    </div>
  );
}

export function CooperationBannerSkeleton() {
  return (
    <div
      data-scaffold="cooperation-banner"
      data-testid="cooperation-banner-scaffold"
      aria-hidden="true"
      className="w-full space-y-4 rounded-card bg-aic-navy p-7 md:p-9"
    >
      <SkeletonBlock className="h-5 w-1/3 bg-white/25" />
      <SkeletonBlock className="h-3 w-full bg-white/20" />
      <SkeletonBlock className="h-3 w-3/4 bg-white/20" />
    </div>
  );
}

export function MediaSkeleton({ className }: { className?: string }) {
  return (
    <div
      data-scaffold="media"
      aria-hidden="true"
      className={cn(
        "neutral-visual aspect-video overflow-hidden rounded-media border border-aic-line",
        className,
      )}
    />
  );
}

const personScaffoldGridClasses: Record<PersonCardVariant, string> = {
  legacy: "sm:grid-cols-2 lg:grid-cols-3",
  director: "grid-cols-1 lg:grid-cols-3",
  teacher: "grid-cols-1 md:grid-cols-2",
  student: "grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-6",
};

export function PersonCardSkeleton({
  count = 3,
  variant = "legacy",
}: {
  count?: number;
  variant?: PersonCardVariant;
}) {
  return (
    <div
      data-scaffold="people"
      data-testid={`organization-${variant}-scaffold`}
      className={cn("grid gap-5", personScaffoldGridClasses[variant])}
    >
      {shells(count, (index) => {
        const oddTeacherLast = variant === "teacher" && count % 2 === 1 && index === count - 1;

        if (variant === "student") {
          return (
            <div key={index} className="text-center" aria-hidden="true">
              <SkeletonBlock className="mx-auto size-20 rounded-2xl" />
              <SkeletonBlock className="mx-auto mt-3 h-4 w-16" />
              <SkeletonBlock className="mx-auto mt-2 h-3 w-20" />
            </div>
          );
        }

        if (variant === "teacher") {
          return (
            <Card
              key={index}
              className={cn(
                "flex items-center gap-4 p-4 md:p-4",
                oddTeacherLast && "md:col-span-2",
              )}
              aria-hidden="true"
            >
              <SkeletonBlock className="size-16 shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1 space-y-2">
                <SkeletonBlock className="h-4 w-2/3" />
                <SkeletonBlock className="h-3 w-1/2" />
                <SkeletonBlock className="h-5 w-20 rounded-full" />
              </div>
            </Card>
          );
        }

        return (
          <Card key={index} className="overflow-hidden p-0" aria-hidden="true">
            <SkeletonBlock className="aspect-[4/3] rounded-none" />
            <div className="space-y-3 p-5">
              <SkeletonBlock className="h-5 w-2/3" />
              <SkeletonBlock className="h-3 w-1/2" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export function ResearchCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div data-scaffold="research" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {shells(count, (index) => (
        <Card key={index} className="overflow-hidden p-0" aria-hidden="true">
          <SkeletonBlock className="aspect-[4/3] rounded-none" />
          <div className="space-y-3 p-5">
            <SkeletonBlock className="h-5 w-3/4" />
            <SkeletonBlock className="h-3 w-full" />
            <SkeletonBlock className="h-3 w-5/6" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function PartnerLogoSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      data-scaffold="partners"
      data-testid="cooperation-partner-scaffold"
      className="grid grid-cols-2 gap-4 md:grid-cols-4"
    >
      {shells(count, (index) => (
        <SkeletonBlock key={index} className="aspect-[3/2] border border-aic-line bg-white" />
      ))}
    </div>
  );
}

export function TimelineSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div
      data-scaffold="timeline"
      data-testid="student-timeline-scaffold"
      className="grid gap-4 md:grid-cols-5"
    >
      {shells(count, (index) => (
        <Card key={index} className="space-y-4" aria-hidden="true">
          <SkeletonBlock className="size-10 rounded-full" />
          <SkeletonBlock className="h-4 w-3/4" />
          <SkeletonBlock className="h-3 w-full" />
        </Card>
      ))}
    </div>
  );
}
