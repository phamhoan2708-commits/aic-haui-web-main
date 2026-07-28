import type { MediaAsset } from "../../content/types";
import { cn } from "../../lib/cn";
import { MediaFrame } from "./MediaFrame";
import { useFailedMediaSource } from "./useFailedMediaSource";

export function LogoFrame({
  asset,
  className,
  imageClassName,
  width,
  height,
  loading = "lazy",
  radiusClassName = "rounded-card",
}: {
  asset?: MediaAsset;
  className?: string;
  imageClassName?: string;
  width?: number;
  height?: number;
  loading?: "eager" | "lazy";
  radiusClassName?: string;
}) {
  const src = asset?.src;
  const { failed, handleError } = useFailedMediaSource(src);

  if (!asset) return null;

  return (
    <MediaFrame
      data-logo-source={failed ? "slot" : "real"}
      className={cn(
        "flex aspect-[3/2] items-center justify-center bg-white p-5",
        failed && "prototype-media-slot",
        className,
      )}
      radiusClassName={radiusClassName}
      aria-hidden={failed || undefined}
    >
      {!failed && (
        <img
          className={cn("max-h-full max-w-full object-contain", radiusClassName, imageClassName)}
          src={src}
          alt={asset.alt}
          width={width}
          height={height}
          loading={loading}
          onError={handleError}
        />
      )}
    </MediaFrame>
  );
}
