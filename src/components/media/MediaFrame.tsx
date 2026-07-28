import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export function MediaFrame({
  children,
  className,
  radiusClassName = "rounded-media",
  ...props
}: HTMLAttributes<HTMLDivElement> & { children?: ReactNode; radiusClassName?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border border-white/40 bg-neutral-visual shadow-soft",
        radiusClassName,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
