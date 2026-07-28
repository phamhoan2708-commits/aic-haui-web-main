import { landingSections, type LandingSectionId } from "../../app/landingSections";
import { useAccessibilityLabels, useLabels } from "../../content/labels";
import { NavPill } from "../ui/NavPill";

export function DesktopNav({ activeSection }: { activeSection?: LandingSectionId }) {
  const { navigationLabels } = useLabels();
  const a11y = useAccessibilityLabels();

  return (
    <nav aria-label={a11y.mainNavigation} className="hidden items-center gap-0.5 lg:flex">
      {landingSections.map((section) => (
        <NavPill key={section.id} sectionId={section.id} active={activeSection === section.id}>
          {navigationLabels[section.key]}
        </NavPill>
      ))}
    </nav>
  );
}
