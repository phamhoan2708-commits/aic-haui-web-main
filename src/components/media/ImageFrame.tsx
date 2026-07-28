import { mediaManifest, resolveMedia } from "../../content/assets";
import type { MediaManifest, MediaAsset, MediaRef } from "../../content/types";
import { MediaFrame } from "./MediaFrame";
import { useFailedMediaSource } from "./useFailedMediaSource";

type ImageFrameProps = {
  mediaRef?: MediaRef;
  manifest?: MediaManifest;
  asset?: MediaAsset;
  className?: string;
  alt?: string;
};

export function ImageFrame({
  mediaRef,
  manifest = mediaManifest,
  asset,
  className,
  alt: altOverride,
}: ImageFrameProps) {
  const media = mediaRef ? resolveMedia(mediaRef, manifest) : undefined;
  const source = media ?? asset;
  const src = source?.src;
  const alt = altOverride ?? source?.alt ?? "";
  const aspectRatio = media?.aspectRatio ?? (mediaRef ? "aspect-[4/3]" : "");
  const { failed, handleError } = useFailedMediaSource(src);
  const unavailable = !src || failed;

  if (!mediaRef && !asset) return null;

  return (
    <MediaFrame
      className={`${aspectRatio} ${className ?? ""}${unavailable ? " prototype-media-slot" : ""}`}
      aria-hidden={unavailable || undefined}
      data-testid={unavailable && mediaRef ? `media-slot-${mediaRef}` : undefined}
    >
      {src && !failed && (
        <img
          className="h-full w-full object-cover"
          src={src}
          alt={alt}
          loading="lazy"
          onError={handleError}
        />
      )}
    </MediaFrame>
  );
}
