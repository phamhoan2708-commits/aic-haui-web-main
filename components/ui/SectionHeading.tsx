import { cn } from "../../lib/cn";
import { bodyCopyTypography } from "./typography";

export function SectionHeading({
  title,
  description,
  eyebrow,
  eyebrowClassName = "text-aic-gold-darker",
  accentClassName,
  align = "left",
  emphasis = "standard",
  invert = false,
  className,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  /** Text color class for the eyebrow label. Defaults to the legacy gold tone. */
  eyebrowClassName?: string;
  /** Background color class for the small accent tick shown beside the eyebrow ("color coding"). */
  accentClassName?: string;
  align?: "left" | "center";
  emphasis?: "standard" | "feature";
  /** Flips heading/description to white for use on dark (e.g. navy) section backgrounds. */
  invert?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        invert && "[&_h2]:!text-white [&_.section-description]:!text-white/75",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]",
            align === "center" && "justify-center",
            eyebrowClassName,
          )}
        >
          {accentClassName && (
            <span aria-hidden="true" className={cn("h-3.5 w-1.5 rounded-full", accentClassName)} />
          )}
          {eyebrow}
        </p>
      )}
      <h2
        className="font-display text-[length:var(--type-section-size)] font-bold leading-[var(--type-section-line)] tracking-tight text-aic-navy"
        style={
          emphasis === "feature"
            ? { fontSize: "var(--type-major-size)", lineHeight: "var(--type-major-line)" }
            : undefined
        }
      >
        {title}
      </h2>
      {description && (
        <p className={cn("section-description mt-4 text-aic-muted", bodyCopyTypography)}>
          {description}
        </p>
      )}
    </div>
  );
}
