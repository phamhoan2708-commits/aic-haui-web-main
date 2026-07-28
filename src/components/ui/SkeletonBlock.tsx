import { cn } from "../../lib/cn";

export function SkeletonBlock({ className, count = 1 }: { className?: string; count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          data-scaffold-block
          aria-hidden="true"
          className={cn(
            "animate-pulse rounded-2xl bg-aic-mist motion-reduce:animate-none",
            className,
          )}
        />
      ))}
    </>
  );
}
