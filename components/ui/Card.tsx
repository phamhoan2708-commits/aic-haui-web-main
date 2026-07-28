import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { Surface } from "./Surface";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <Surface
      className={cn(
        "p-5 [&_h3]:text-[length:var(--type-card-size)] [&_h3]:leading-[var(--type-card-line)] [&_h3]:font-bold transition duration-300 hover:shadow-light motion-reduce:transition-none md:p-6",
        className,
      )}
      {...props}
    />
  );
}
