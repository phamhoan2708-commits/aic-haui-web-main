import type { ReactNode } from "react";
import { FlaskConical, Rocket, type LucideIcon } from "lucide-react";

import type { JoinStep, Lab, PageCopy } from "../../content/types";
import { ImageFrame } from "../media/ImageFrame";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { PageContainer } from "../ui/PageContainer";
import { bodyCopyTypography, cardHeadingTypography } from "../ui/typography";
import { cn } from "../../lib/cn";

const studentLabIcons: Readonly<Record<string, LucideIcon | undefined>> = {
  foundry: FlaskConical,
  innovation: Rocket,
};

export function StudentHero({
  copy,
  ctaHref,
  ctaLabel,
  scaffold,
}: {
  copy: PageCopy;
  ctaHref?: string;
  ctaLabel: string;
  scaffold?: ReactNode;
}) {
  const hasMedia = Boolean(scaffold || copy.mediaRef);

  return (
    <header className="relative border-b border-aic-line bg-hero-wash py-16 text-white md:py-24 overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
      >
        <source src="/media/hero-video.webm" type="video/webm" />
      </video>

      {/* Overlay - Darker gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-aic-navy/70 via-aic-navy/40 to-aic-navy/60 z-1"></div>

      <PageContainer
        data-testid="students-hero"
        className={`relative z-10 ${hasMedia ? "grid items-center gap-10 md:grid-cols-2" : ""}`}
      >
        <div className="drop-shadow-lg">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-white md:text-6xl">
            {copy.title}
          </h1>
          {copy.description && (
            <p className={cn("mt-5 max-w-2xl font-medium text-white", bodyCopyTypography)}>
              {copy.description}
            </p>
          )}
          {ctaHref && (
            <Button href={ctaHref} className="mt-7 shadow-lg hover:scale-105 transition-transform">
              {ctaLabel}
            </Button>
          )}
        </div>
        {hasMedia && (scaffold ?? <ImageFrame mediaRef={copy.mediaRef} className="rounded-hero" />)}
      </PageContainer>
    </header>
  );
}

export function LabCard({ lab }: { lab: Lab }) {
  const Icon = studentLabIcons[lab.id];
  const isFoundry = lab.id === "foundry";
  const isInnovation = lab.id === "innovation";

  return (
    <Card
      data-student-lab={lab.id}
      className={cn(
        "group !rounded-2xl border-2 shadow-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-soft motion-reduce:transform-none motion-reduce:transition-none",
        isFoundry &&
          "border-aic-gold bg-gradient-to-br from-aic-warm via-white to-white hover:border-aic-gold-dark",
        isInnovation &&
          "border-aic-teal/50 bg-gradient-to-br from-aic-teal/10 via-white to-white hover:border-aic-teal",
        !isFoundry && !isInnovation && "border-aic-blue/45 bg-aic-mist hover:border-aic-blue",
      )}
    >
      <ImageFrame mediaRef={lab.mediaRef} asset={lab.image} className="mb-6 rounded-card" />
      <div className="flex items-center gap-3">
        {Icon && (
          <span
            data-testid={`student-lab-icon-${lab.id}`}
            aria-hidden="true"
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-xl shadow-sm transition-transform duration-300 group-hover:rotate-6 motion-reduce:!rotate-0",
              isFoundry
                ? "bg-aic-gold text-aic-navy"
                : isInnovation
                  ? "bg-aic-teal text-white"
                  : "bg-aic-blue text-white",
            )}
          >
            <Icon size={22} strokeWidth={1.8} />
          </span>
        )}
        <h3 className="font-display font-bold text-aic-navy">{lab.name}</h3>
      </div>
      {lab.positioning && (
        <p className={cn("mt-3 text-aic-muted", bodyCopyTypography)}>{lab.positioning}</p>
      )}
      {lab.benefits && lab.benefits.length > 0 && (
        <ul className="mt-5 grid gap-3 text-sm text-aic-muted">
          {lab.benefits.map((benefit) => (
            <li key={benefit} data-lab-benefit className="flex gap-3">
              <span
                aria-hidden="true"
                className={cn(
                  "mt-2 size-1.5 shrink-0 rounded-full",
                  isInnovation ? "bg-aic-teal" : "bg-aic-blue",
                )}
              />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function LabComparison({ labs }: { labs: Lab[] }) {
  return (
    <div data-testid="student-lab-grid" className="grid gap-5 md:grid-cols-2">
      {labs.map((lab) => (
        <LabCard key={lab.id} lab={lab} />
      ))}
    </div>
  );
}

export function JoinProcess({ steps }: { steps: JoinStep[] }) {
  if (!steps.length) return null;
  return (
    <ol data-testid="student-timeline" className="grid gap-4 md:grid-cols-5">
      {steps.map((step, index) => (
        <li
          key={step.id}
          className="rounded-card border border-aic-blue/30 bg-white p-5 shadow-card transition-shadow hover:shadow-soft"
        >
          <span className="grid size-10 place-items-center rounded-full bg-aic-blue font-bold text-white">
            {index + 1}
          </span>
          <h3 className={cn("mt-4 text-aic-navy", cardHeadingTypography)}>{step.title}</h3>
          <p className={cn("mt-2 text-aic-muted", bodyCopyTypography)}>{step.description}</p>
        </li>
      ))}
    </ol>
  );
}

export function StudentCTA({
  href,
  title,
  buttonLabel,
}: {
  href?: string;
  title: string;
  buttonLabel: string;
}) {
  if (!href) return null;
  return (
    <div className="rounded-media bg-aic-navy p-8 text-center text-white md:p-12">
      <h2 className="font-display text-3xl font-bold">{title}</h2>
      <Button href={href} variant="secondary" className="mt-6">
        {buttonLabel}
      </Button>
    </div>
  );
}
