import { useEffect, useRef, useState, ReactNode } from "react";
import { cn } from "../../lib/cn";

interface RevealProps {
  children: ReactNode;
  className?: string;
}

export function Reveal({ children, className }: RevealProps) {
  const [isVisible, setIsVisible] = useState(
    () =>
      (typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) ||
      typeof IntersectionObserver === "undefined",
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px", // Trigger right before it comes up 50px
      },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-y-0 blur-none" : "opacity-0 translate-y-12 blur-[2px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
