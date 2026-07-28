import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "../../lib/cn";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-2 text-sm", className)}>
      <ol className="flex items-center gap-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {item.href ? (
              <Link
                to={item.href}
                className="text-aic-blue hover:text-aic-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aic-blue rounded px-1"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-aic-navy font-semibold" aria-current="page">
                {item.label}
              </span>
            )}
            {index < items.length - 1 && (
              <ChevronRight className="h-4 w-4 text-aic-muted" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
