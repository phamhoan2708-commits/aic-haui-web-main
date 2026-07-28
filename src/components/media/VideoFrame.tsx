import { mediaManifest, resolveMedia } from "../../content/assets";
import type { MediaManifest, MediaAsset, MediaRef } from "../../content/types";
import { MediaFrame } from "./MediaFrame";
import { useFailedMediaSource } from "./useFailedMediaSource";

type VideoFrameProps = {
  mediaRef?: MediaRef;
  manifest?: MediaManifest;
  asset?: MediaAsset;
  scaffold?: boolean;
};

export function VideoFrame({
  mediaRef,
  manifest = mediaManifest,
  asset,
  scaffold = false,
}: VideoFrameProps) {
  const media = mediaRef ? resolveMedia(mediaRef, manifest) : undefined;
  const source = media ?? asset;
  const src = source?.src;
  const alt = source?.alt ?? "";
  const { failed, handleError } = useFailedMediaSource(src);
  const unavailable = !src || failed;

  if (!mediaRef && !asset && !scaffold) return null;

  return (
    <MediaFrame
      className={`${media?.aspectRatio ?? "aspect-video"}${unavailable ? " prototype-media-slot" : ""}`}
      radiusClassName="rounded-video"
      aria-hidden={unavailable || undefined}
      data-testid={unavailable && mediaRef ? `media-slot-${mediaRef}` : undefined}
    >
      {src && !failed && (
        <video
          className="h-full w-full object-cover"
          src={src}
          poster={source?.poster}
          aria-label={alt || undefined}
          controls
          preload="metadata"
          onError={handleError}
        >
          {alt}
        </video>
      )}
    </MediaFrame>
  );
}
