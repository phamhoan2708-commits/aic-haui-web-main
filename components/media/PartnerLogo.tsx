import { mediaManifest, resolveMedia } from "../../content/assets";
import type { MediaAsset, MediaManifest, Partner } from "../../content/types";
import { PartnerLogoFrame } from "./PartnerLogoFrame";

function resolvePartnerLogoAsset(
  partner: Partner,
  manifest: MediaManifest = mediaManifest,
): MediaAsset | undefined {
  if (partner.logo?.src) return partner.logo;
  if (!partner.mediaRef) return undefined;

  const media = resolveMedia(partner.mediaRef, manifest);
  if (!media?.src || media.kind !== "image") return undefined;
  return { src: media.src, alt: media.alt || partner.name };
}

export function PartnerLogo({
  partner,
  manifest = mediaManifest,
  className,
  tabIndex,
}: {
  partner: Partner;
  manifest?: MediaManifest;
  className?: string;
  tabIndex?: number;
}) {
  const frame = (
    <PartnerLogoFrame
      asset={resolvePartnerLogoAsset(partner, manifest)}
      label={partner.name}
      className={className}
    />
  );

  if (!partner.url) return frame;
  return (
    <a
      href={partner.url}
      aria-label={partner.name}
      tabIndex={tabIndex}
      className="rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aic-blue"
    >
      {frame}
    </a>
  );
}
