import type { MediaAsset } from "../../content/types";
import { cn } from "../../lib/cn";
import { MediaFrame } from "./MediaFrame";
import { useFailedMediaSource } from "./useFailedMediaSource";

export function PartnerLogoFrame({
  asset,
  label,
  className,
}: {
  asset?: MediaAsset;
  label: string;
  className?: string;
}) {
  const src = asset?.src;
  const { failed, handleError } = useFailedMediaSource(src);
  const hasImage = Boolean(src && !failed);

  return (
    <MediaFrame
      data-logo-source={hasImage ? "real" : "slot"}
      className={cn(
        "flex aspect-[3/2] items-center justify-center border-aic-line bg-white p-5 shadow-none",
        className,
      )}
      radiusClassName="rounded-card"
    >
      {hasImage ? (
        <img
          className="max-h-full max-w-full object-contain grayscale transition duration-300 hover:grayscale-0 motion-reduce:transition-none"
          src={src}
          alt={asset?.alt || label}
          loading="lazy"
          onError={handleError}
        />
      ) : (
        <span className="text-sm font-medium text-aic-muted">{label}</span>
      )}
    </MediaFrame>
  );
}
