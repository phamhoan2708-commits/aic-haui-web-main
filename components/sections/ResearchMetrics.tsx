import type { ContentState, Metric } from "../../content/types";
import { PageContainer } from "../ui/PageContainer";
import { SkeletonBlock } from "../ui/SkeletonBlock";

function MetricScaffold({ count }: { count: number }) {
  return (
    <div
      data-testid="research-metric-scaffold"
      className="grid grid-cols-2 gap-px overflow-hidden md:grid-cols-4"
    >
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="space-y-3 bg-aic-mist px-5 py-8 text-center" aria-hidden="true">
          <SkeletonBlock className="mx-auto h-8 w-16" />
          <SkeletonBlock className="mx-auto h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

export function ResearchMetrics({ state }: { state: ContentState<Metric> }) {
  if (state.status === "empty") return null;

  return (
    <div data-testid="research-metric-band" className="section-reveal bg-aic-navy py-16 md:py-20 lg:py-24">
      <PageContainer className="px-0 sm:px-6 lg:px-8">
        {state.status === "scaffold" ? (
          <MetricScaffold count={state.expectedCount ?? 4} />
        ) : (
          <div data-testid="research-metrics" className="grid grid-cols-2 md:grid-cols-4">
            {state.items.map((metric) => (
              <div
                key={metric.id}
                className="border-white/10 px-4 py-12 text-center even:border-l md:border-l md:first:border-l-0 md:py-16"
              >
                <p className="font-serif text-3xl font-bold text-aic-gold md:text-4xl">
                  {metric.value}
                </p>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-white/70">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </PageContainer>
    </div>
  );
}
