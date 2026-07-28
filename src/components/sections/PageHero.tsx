import type { ReactNode } from "react";
import type { PageCopy } from "../../content/types";
import { cn } from "../../lib/cn";
import { PageContainer } from "../ui/PageContainer";
import { bodyCopyTypography } from "../ui/typography";

export function PageHero({ copy, media }: { copy: PageCopy; media?: ReactNode }) {
  return (
    <header className="relative border-b border-aic-line bg-hero-wash py-16 text-white md:py-24 overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover brightness-[.72] contrast-125 saturate-110"
      >
        <source src="/media/hero-video.webm" type="video/webm" />
      </video>

      {/* Uniform scrim prevents uneven brightness behind copy. */}
      <div className="absolute inset-0 z-1 bg-aic-navy/62"></div>

      <PageContainer
        className={`relative z-10 ${media ? "grid items-center gap-10 lg:grid-cols-2" : "text-center"}`}
      >
        <div className="drop-shadow-[0_2px_10px_rgba(0,0,0,.65)]">
          <h1 className="font-display text-[length:var(--type-major-size)] font-bold leading-[var(--type-major-line)] tracking-tight text-white">
            {copy.title}
          </h1>
          {copy.description && (
            <p
              className={cn(
                "mt-5 font-medium text-white",
                bodyCopyTypography,
                media ? "max-w-2xl" : "mx-auto max-w-3xl",
              )}
            >
              {copy.description}
            </p>
          )}
        </div>
        {media}
      </PageContainer>
    </header>
  );
}
