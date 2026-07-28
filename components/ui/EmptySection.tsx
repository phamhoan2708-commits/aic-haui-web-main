import { AlertCircle } from "lucide-react";
import { cn } from "../../lib/cn";

export function EmptySection({
  title = "Content Coming Soon",
  description = "This section is currently being prepared.",
  icon: Icon = AlertCircle,
  className,
}: {
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-aic-line bg-aic-mist/30 px-6 py-12 text-center md:py-16",
        className,
      )}
    >
      <Icon className="mb-4 h-12 w-12 text-aic-muted/40" aria-hidden="true" />
      <h3 className="font-serif text-lg font-semibold text-aic-navy">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-aic-muted">{description}</p>
    </div>
  );
}
