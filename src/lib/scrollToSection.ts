const DESKTOP_HEADER_OFFSET = 120;
const MOBILE_HEADER_OFFSET = 64;

function getHeaderOffset() {
  return window.matchMedia("(min-width: 1024px)").matches
    ? DESKTOP_HEADER_OFFSET
    : MOBILE_HEADER_OFFSET;
}

export function scrollToSection(sectionId: string, behavior: ScrollBehavior = "smooth") {
  const element = document.getElementById(sectionId);
  if (!element) {
    window.scrollTo({ top: 0, behavior });
    window.history.replaceState(window.history.state ?? null, "", "/");
    return;
  }

  const top = element.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  window.scrollTo({ top, behavior });
  window.history.replaceState(window.history.state ?? null, "", `/#${sectionId}`);
}
