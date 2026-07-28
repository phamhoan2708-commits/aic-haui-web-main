import { mediaManifest, resolveMedia } from "../../content/assets";
import type { MediaManifest, MediaAsset, MediaRef } from "../../content/types";
import { cn } from "../../lib/cn";
import { MediaFrame } from "./MediaFrame";
import { useFailedMediaSource } from "./useFailedMediaSource";

type HeroMediaProps = {
  mediaRef?: MediaRef;
  manifest?: MediaManifest;
  asset?: MediaAsset;
  background?: boolean;
  reducedMotion?: boolean;
};

export function HeroMedia({
  mediaRef,
  manifest = mediaManifest,
  asset,
  background = false,
  reducedMotion = false,
}: HeroMediaProps) {
  const media = mediaRef ? resolveMedia(mediaRef, manifest) : undefined;
  const source = media
    ? {
        kind: media.kind,
        src: media.src,
        alt: media.alt,
        poster: media.poster,
      }
    : asset
      ? {
          kind: asset.type ?? "image",
          src: asset.src,
          alt: asset.alt,
          poster: asset.poster,
        }
      : undefined;
  const src = source?.src;
  const { failed, handleError } = useFailedMediaSource(src);
  const unavailable = !src || failed;

  return (
    <MediaFrame
      className={cn(
        unavailable && "prototype-media-slot",
        background
          ? "absolute inset-0 z-0 h-full w-full border-0 shadow-none [&_video]:brightness-[.72] [&_video]:contrast-125 [&_video]:saturate-110"
          : `hero-visual ${media?.aspectRatio ?? "aspect-[4/3]"} lg:aspect-[16/11]`,
      )}
      radiusClassName={background ? "rounded-none" : "rounded-hero"}
      aria-hidden={background || unavailable || undefined}
      data-testid={
        unavailable ? (background ? "hero-media-fallback" : `media-slot-${mediaRef}`) : undefined
      }
    >
      {src && !failed && source.kind === "video" ? (
        <video
          className="h-full w-full object-cover"
          src={src}
          poster={source.poster}
          aria-label={background ? undefined : source.alt}
          aria-hidden={background || undefined}
          autoPlay={!reducedMotion}
          muted
          loop
          playsInline
          preload="metadata"
          onError={handleError}
        />
      ) : src && !failed ? (
        <img
          className="h-full w-full object-cover"
          src={src}
          alt={background ? "" : source.alt}
          onError={handleError}
        />
      ) : null}
    </MediaFrame>
  );
}
