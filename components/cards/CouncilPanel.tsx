import type { ContentState, CouncilMember } from "../../content/types";
import { SkeletonBlock } from "../ui/SkeletonBlock";
import { Surface } from "../ui/Surface";
import { cardHeadingTypography } from "../ui/typography";
import { cn } from "../../lib/cn";

function CouncilPanelSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="divide-y divide-aic-line" data-scaffold="council">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-4 py-4"
          aria-hidden="true"
        >
          <div className="w-2/3 space-y-2">
            <SkeletonBlock className="h-4 w-3/4" />
            <SkeletonBlock className="h-3 w-1/2" />
          </div>
          <SkeletonBlock className="h-7 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function CouncilPanel({
  title,
  state,
}: {
  title: string;
  state: ContentState<CouncilMember>;
}) {
  if (state.status === "empty") return null;

  return (
    <Surface className="h-full p-5 md:p-6" data-organization-variant="council">
      <h2 className="border-b border-aic-line pb-4 font-display text-2xl font-bold text-aic-navy">
        {title}
      </h2>
      {state.status === "scaffold" ? (
        <CouncilPanelSkeleton count={state.expectedCount} />
      ) : (
        <div className="divide-y divide-aic-line">
          {state.items.map((member) => (
            <article
              key={member.id}
              className="flex items-center justify-between gap-4 py-4"
              data-council-member
            >
              <div className="min-w-0">
                <h3 className={cn("font-display text-aic-navy", cardHeadingTypography)}>
                  {member.name}
                </h3>
                <p className="mt-1 text-xs text-aic-blue">{member.role}</p>
              </div>
              <span className="shrink-0 rounded-full bg-aic-mist px-3 py-1 text-xs font-semibold text-aic-blue">
                {member.affiliation}
              </span>
            </article>
          ))}
        </div>
      )}
    </Surface>
  );
}
