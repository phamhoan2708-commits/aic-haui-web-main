import type { MediaAsset } from "../../content/types";
import { ImageFrame } from "./ImageFrame";

export function LabImage({ asset }: { asset?: MediaAsset }) {
  return <ImageFrame asset={asset} className="aspect-[4/3] rounded-card" />;
}
