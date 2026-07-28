import type { MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { landingHref, landingSections, type LandingSectionId } from "../../app/landingSections";
import { useSiteContent } from "../../content/site";
import { useLabels, useAccessibilityLabels, useFooterLabels } from "../../content/labels";
import { isPrimaryUnmodifiedClick } from "../../lib/primaryClick";
import { scrollToSection } from "../../lib/scrollToSection";
import { cn } from "../../lib/cn";
import { PageContainer } from "../ui/PageContainer";
import { bodyCopyTypography } from "../ui/typography";

export function Footer() {
  const siteContent = useSiteContent();
  const { navigationLabels } = useLabels();
  const a11y = useAccessibilityLabels();
  const footerLabels = useFooterLabels();
  const { pathname } = useLocation();
  const handleLandingClick =
    (sectionId: LandingSectionId) => (event: MouseEvent<HTMLAnchorElement>) => {
      if (!isPrimaryUnmodifiedClick(event) || pathname !== "/") return;

      event.preventDefault();
      scrollToSection(sectionId);
    };

  return (
    <footer className="bg-aic-navy py-12 text-white md:py-16">
      <PageContainer className="grid gap-12 md:grid-cols-[1fr_1.5fr_1.5fr]">
        {/* Brand & Description */}
        <div>
          <p className="text-2xl font-bold text-aic-gold">{siteContent.identity.shortName}</p>
          {siteContent.footer.description && (
            <p className={cn("mt-4 max-w-sm text-white/70", bodyCopyTypography)}>
              {siteContent.footer.description}
            </p>
          )}
        </div>

        {/* Navigation Links */}
        <nav aria-label={a11y.footerNavigation} className="grid grid-cols-2 gap-3">
          {landingSections.map((section) => (
            <Link
              key={section.id}
              to={landingHref(section.id)}
              onClick={handleLandingClick(section.id)}
              className="rounded-lg px-2 py-2 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aic-gold transition-colors"
            >
              {navigationLabels[section.key]}
            </Link>
          ))}
        </nav>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-aic-gold">
            {footerLabels.followUs}
          </h3>
          <div className="space-y-3 text-sm">
            {siteContent.contact.items.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                {item.id === "office" && (
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-aic-gold" />
                )}
                {item.id === "laboratory" && (
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-aic-gold" />
                )}
                {item.id === "email" && (
                  <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-aic-gold" />
                )}
                {item.id === "phone" && (
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-aic-gold" />
                )}
                <div className="flex-1">
                  <p className="text-xs font-semibold text-white/60">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-white/80 hover:text-aic-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aic-gold rounded px-1"
                    >
                      {item.primary}
                    </a>
                  ) : (
                    <p className="text-white/80">{item.primary}</p>
                  )}
                  {item.secondary && <p className="text-xs text-white/60 mt-1">{item.secondary}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>

      {/* Copyright */}
      {siteContent.footer.copyright && (
        <PageContainer className="mt-10 border-t border-white/10 pt-6 text-xs text-white/60">
          {siteContent.footer.copyright}
        </PageContainer>
      )}
    </footer>
  );
}
