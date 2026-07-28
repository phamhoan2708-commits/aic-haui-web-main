import { mediaManifest, resolveMedia } from "../../content/assets";
import type { MediaManifest, MediaRef } from "../../content/types";
import { MediaFrame } from "./MediaFrame";
import { useFailedMediaSource } from "./useFailedMediaSource";

type MapFrameProps = {
  mediaRef?: MediaRef;
  manifest?: MediaManifest;
  url?: string;
  title?: string;
};

export function MapFrame({ mediaRef, manifest = mediaManifest, url, title }: MapFrameProps) {
  const media = mediaRef ? resolveMedia(mediaRef, manifest) : undefined;
  const embedUrl = media ? media.embedUrl : url;
  const imageSrc = media?.src;
  const accessibleTitle = title ?? media?.alt ?? "";
  const { failed, handleError } = useFailedMediaSource(imageSrc);
  const hasImage = Boolean(imageSrc && !failed);
  const unavailable = !embedUrl && !hasImage;

  if (!mediaRef && !url) return null;

  return (
    <MediaFrame
      className={`${media?.aspectRatio ?? "aspect-video"} min-h-72${unavailable ? " prototype-media-slot" : ""}`}
      radiusClassName="rounded-video"
      aria-hidden={unavailable || undefined}
      data-testid={unavailable && mediaRef ? `media-slot-${mediaRef}` : undefined}
    >
      {embedUrl ? (
        <iframe
          className="h-full w-full border-0"
          src={embedUrl}
          title={accessibleTitle}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : hasImage ? (
        <img
          className="h-full w-full object-cover"
          src={imageSrc}
          alt={accessibleTitle}
          loading="lazy"
          onError={handleError}
        />
      ) : null}
    </MediaFrame>
  );
}
