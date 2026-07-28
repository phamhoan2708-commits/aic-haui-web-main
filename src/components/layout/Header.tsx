import { Link } from "react-router-dom";

import { officialAssets } from "../../content/assets";
import { useSiteContent } from "../../content/site";
import { useActiveSection } from "../../hooks/useActiveSection";
import { DesktopNav } from "../navigation/DesktopNav";
import { LanguageSwitcher } from "../navigation/LanguageSwitcher";
import { MobileNav } from "../navigation/MobileNav";
import { LogoFrame } from "../media/LogoFrame";
import { PageContainer } from "../ui/PageContainer";

export function Header() {
  const siteContent = useSiteContent();
  const activeSection = useActiveSection();

  const brand = (
    <Link
      to="/"
      className="flex shrink-0 items-center gap-2.5 rounded-xl font-display text-xl font-extrabold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-aic-navy"
    >
      <LogoFrame
        asset={officialAssets.logo}
        width={44}
        height={44}
        loading="eager"
        radiusClassName="rounded-[10px]"
        className="size-9 shrink-0 aspect-square border-0 bg-transparent p-0 shadow-soft"
        imageClassName="size-full object-cover"
      />
      <span>{siteContent.identity.shortName}</span>
    </Link>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-40 w-full border-b border-aic-line/80 bg-white shadow-soft">
      <div data-testid="header-brand-tier" className="h-16 bg-aic-navy lg:h-[72px]">
        <PageContainer className="grid h-full grid-cols-[1fr_auto] items-center gap-6">
          {brand}
          <div className="flex items-center justify-self-end">
            <LanguageSwitcher overlay />
            <MobileNav activeSection={activeSection} />
          </div>
        </PageContainer>
      </div>
      <div data-testid="header-nav-tier" className="hidden h-12 bg-white lg:block">
        <PageContainer className="flex h-full items-center justify-center">
          <DesktopNav activeSection={activeSection} />
        </PageContainer>
      </div>
    </header>
  );
}
