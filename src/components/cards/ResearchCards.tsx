import { Bot, Brain, Cpu, Database, MonitorPlay, Scale, Users, Wifi } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { ResearchItem } from "../../content/types";
import { cn } from "../../lib/cn";
import { ImageFrame } from "../media/ImageFrame";
import { Card } from "../ui/Card";
import { SkeletonBlock } from "../ui/SkeletonBlock";
import { bodyCopyTypography } from "../ui/typography";

const researchLabIcons: Readonly<Record<string, LucideIcon>> = {
  "computer-vision-lab": MonitorPlay,
  "nlp-lab": Brain,
  "robotics-lab": Bot,
  "data-science-lab": Database,
  "applied-ai-lab": Cpu,
  "iot-ai-lab": Wifi,
  "ai-ethics-lab": Scale,
};

function CardCopy({
  item,
  ctaHref,
  icon: Icon,
  tone = "light",
}: {
  item: ResearchItem;
  ctaHref?: string;
  icon?: LucideIcon;
  tone?: "light" | "dark";
}) {
  const isDark = tone === "dark";
  return (
    <>
      {Icon ? (
        <div className="mb-4 flex items-center gap-3">
          <span
            data-testid={`research-lab-icon-${item.id}`}
            aria-hidden="true"
            className="grid size-11 shrink-0 place-items-center rounded-xl bg-aic-blue text-white shadow-sm"
          >
            <Icon size={22} strokeWidth={1.8} />
          </span>
          <h3 className={cn("font-display font-bold", isDark ? "text-white" : "text-aic-navy")}>
            {item.title}
          </h3>
        </div>
      ) : (
        <h3 className={cn("font-display font-bold", isDark ? "text-white" : "text-aic-navy")}>
          {item.title}
        </h3>
      )}
      <p className={cn("mt-3", isDark ? "text-white/70" : "text-aic-muted", bodyCopyTypography)}>
        {item.description}
      </p>
      {item.tags && item.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "rounded-full px-3 py-1 font-mono text-[11px] tracking-tight",
                isDark ? "bg-white/10 text-aic-gold" : "bg-aic-mist text-aic-blue",
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {item.cta && ctaHref && (
        <a
          className={cn(
            "mt-5 inline-block text-sm font-bold",
            isDark ? "text-aic-gold" : "text-aic-blue",
          )}
          href={ctaHref}
        >
          {item.cta}
        </a>
      )}
    </>
  );
}

export function ResearchDirectionCard({ item, ctaHref }: { item: ResearchItem; ctaHref?: string }) {
  return (
    <Card
      data-research-card="direction"
      className="overflow-hidden !rounded-2xl border border-white/10 bg-aic-navy/70 p-0 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-aic-gold/50 hover:shadow-[0_24px_60px_rgba(0,0,0,0.45)] md:p-0"
    >
      {(item.mediaRef || item.image) && (
        <ImageFrame
          mediaRef={item.mediaRef}
          asset={item.image}
          className="aspect-[4/5] rounded-b-none border-0"
        />
      )}
      <div className="p-6">
        <CardCopy item={item} ctaHref={ctaHref} tone="dark" />
      </div>
    </Card>
  );
}

export type ResearchLabVariant = "featured" | "accent" | "compact";
export type ResearchGroupLayoutEntry<Id extends string = string> = Readonly<{
  id: Id;
  variant: ResearchLabVariant;
}>;
export type ResearchGroupLayout = readonly ResearchGroupLayoutEntry[];

export function ResearchGroupCard({
  item,
  variant = "compact",
  memberSuffix,
}: {
  item: ResearchItem;
  variant?: ResearchLabVariant;
  memberSuffix: string;
}) {
  const Icon = researchLabIcons[item.id] ?? Users;

  return (
    <Card
      data-research-card="lab"
      data-research-variant={variant}
      className="group flex h-full flex-col !rounded-2xl border border-aic-line bg-white p-6 shadow-nested transition-all duration-300 hover:-translate-y-1 hover:border-aic-blue/40 hover:shadow-nested-hover md:p-6"
    >
      {(item.mediaRef || item.image) && (
        <div className="mb-5 overflow-hidden rounded-xl aspect-[4/3]">
          <ImageFrame
            mediaRef={item.mediaRef}
            asset={item.image}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <CardCopy item={item} icon={Icon} />
      {item.memberCount !== undefined && (
        <p className="mt-auto pt-6 font-mono text-xs font-medium text-aic-blue">
          {String(item.memberCount).padStart(2, "0")} · {memberSuffix}
        </p>
      )}
      {item.leader && (
        <p className="mt-auto border-t border-aic-line pt-5 text-xs font-semibold text-aic-ink">
          {item.leader}
        </p>
      )}
    </Card>
  );
}

export function ResearchResultCard({ item }: { item: ResearchItem }) {
  return <ResearchDirectionCard item={item} />;
}

export function ResearchGrid({
  items,
  variant = "direction",
  groupLayout = [],
  directionCtaHref,
  memberSuffix = "",
}: {
  items: ResearchItem[];
  variant?: "direction" | "group" | "result";
  groupLayout?: ResearchGroupLayout;
  directionCtaHref?: string;
  memberSuffix?: string;
}) {
  const isLabGrid = variant === "group";
  const itemsById = new Map(items.map((item) => [item.id, item]));
  const knownIds = new Set(groupLayout.map((entry) => entry.id));
  const labItems = [
    ...groupLayout.flatMap((entry) => {
      const item = itemsById.get(entry.id);
      return item ? [{ item, variant: entry.variant }] : [];
    }),
    ...items
      .filter((item) => !knownIds.has(item.id))
      .map((item) => ({ item, variant: "compact" as const })),
  ];

  return (
    <div
      data-testid={isLabGrid ? "research-lab-grid" : "research-direction-grid"}
      className={cn(
        "grid grid-cols-1 gap-5",
        isLabGrid ? "md:grid-cols-2 md:auto-rows-fr" : "md:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {isLabGrid
        ? labItems.map(({ item, variant: labVariant }) => (
            <ResearchGroupCard
              key={item.id}
              item={item}
              variant={labVariant}
              memberSuffix={memberSuffix}
            />
          ))
        : items.map((item) => (
            <ResearchDirectionCard key={item.id} item={item} ctaHref={directionCtaHref} />
          ))}
    </div>
  );
}

function shells(count: number) {
  return Array.from({ length: count }, (_, index) => index);
}

export function ResearchDirectionScaffold({ count = 3 }: { count?: number }) {
  return (
    <div
      data-testid="research-direction-scaffold"
      className="grid grid-cols-1 gap-5 md:grid-cols-3"
    >
      {shells(count).map((index) => (
        <Card
          key={index}
          className="overflow-hidden !rounded-2xl border border-white/10 bg-aic-navy/70 p-0 md:p-0"
          aria-hidden="true"
        >
          <SkeletonBlock className="aspect-[4/5] rounded-none bg-white/10" />
          <div className="space-y-3 p-6">
            <SkeletonBlock className="h-5 w-3/4 bg-white/10" />
            <SkeletonBlock className="h-3 w-full bg-white/10" />
            <SkeletonBlock className="h-3 w-5/6 bg-white/10" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function ResearchLabScaffold({ layout }: { layout: ResearchGroupLayout }) {
  return (
    <div
      data-testid="research-lab-scaffold"
      className="grid grid-cols-1 gap-5 md:auto-rows-fr md:grid-cols-2"
    >
      {layout.map(({ id, variant }) => {
        return (
          <Card
            key={id}
            data-layout-id={id}
            data-research-variant={variant}
            className="!rounded-2xl space-y-4 p-6 shadow-nested md:p-6"
            aria-hidden="true"
          >
            <SkeletonBlock className="h-5 w-2/3" />
            <SkeletonBlock className="h-3 w-full" />
            <SkeletonBlock className="h-3 w-4/5" />
          </Card>
        );
      })}
    </div>
  );
}
