import type { MediaAsset, MediaRef } from "../../content/types";
import { ImageFrame } from "./ImageFrame";

export function AvatarFrame({
  asset,
  mediaRef,
  className,
  alt,
}: {
  asset?: MediaAsset;
  mediaRef?: MediaRef;
  className?: string;
  alt?: string;
}) {
  return (
    <ImageFrame
      asset={asset}
      mediaRef={mediaRef}
      alt={alt}
      className={`aspect-[4/5] rounded-card ${className ?? ""}`}
    />
  );
}
