import { useLanguage } from "../../contexts/language";
import { useAccessibilityLabels } from "../../content/labels";
import { cn } from "../../lib/cn";

export function LanguageSwitcher({ overlay }: { overlay: boolean }) {
  const { language, setLanguage } = useLanguage();
  const a11y = useAccessibilityLabels();

  return (
    <div
      className={cn(
        "relative hidden h-9 w-28 overflow-hidden border-2 lg:flex",
        overlay ? "border-white/30 bg-black/20" : "border-aic-navy/20 bg-aic-mist/50",
      )}
      style={{ clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0 100%)" }}
      role="group"
      aria-label={a11y.languageSelection}
    >
      {/* Active Indicator Background */}
      <div
        className={cn(
          "absolute top-0 bottom-0 w-1/2 transition-all duration-300 ease-in-out bg-aic-blue",
          language === "vn" ? "left-0" : "left-1/2",
        )}
        style={{
          clipPath:
            language === "vn"
              ? "polygon(10% 0, 100% 0, 90% 100%, 0 100%)"
              : "polygon(0 0, 90% 0, 100% 100%, 10% 100%)",
        }}
        aria-hidden="true"
      />

      <button
        onClick={() => setLanguage("vn")}
        aria-pressed={language === "vn"}
        aria-label={a11y.vietnameseLanguage}
        className={cn(
          "relative z-10 flex-1 text-xs font-black tracking-widest transition-colors duration-300",
          language === "vn" ? "text-white" : overlay ? "text-white/40" : "text-aic-navy/40",
        )}
      >
        <span className="relative">
          VN
          {language === "vn" && (
            <span
              className="absolute -bottom-1 left-0 w-full h-0.5 bg-aic-gold"
              aria-hidden="true"
            />
          )}
        </span>
      </button>

      <button
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        aria-label={a11y.englishLanguage}
        className={cn(
          "relative z-10 flex-1 text-xs font-black tracking-widest transition-colors duration-300",
          language === "en" ? "text-white" : overlay ? "text-white/40" : "text-aic-navy/40",
        )}
      >
        <span className="relative">
          EN
          {language === "en" && (
            <span
              className="absolute -bottom-1 left-0 w-full h-0.5 bg-aic-gold"
              aria-hidden="true"
            />
          )}
        </span>
      </button>

      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-1 h-1 bg-aic-gold/50" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-1 h-1 bg-aic-gold/50" aria-hidden="true" />
    </div>
  );
}
