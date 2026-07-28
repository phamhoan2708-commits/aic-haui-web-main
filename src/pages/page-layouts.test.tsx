import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { emptySiteContent } from "../content/empty";
import { resolveMedia } from "../content/assets";
import { siteContent } from "../content/site";
import { verifiedSiteContentVi } from "../content/verified";
import {
  contactSectionLabels,
  cooperationSectionLabels,
  researchSectionLabels,
} from "../content/labels";
import type { CouncilMember, Person, SiteContent } from "../content/types";
import { CouncilPanel } from "../components/cards/CouncilPanel";
import { OrganizationGroup } from "../components/sections/OrganizationGroup";
import { ContactPage } from "./ContactPage";
import { CooperationPage } from "./CooperationPage";
import { HomePage } from "./HomePage";
import { OrganizationPage } from "./OrganizationPage";
import { ResearchPage } from "./ResearchPage";
import { StudentsPage } from "./StudentsPage";

const approvedStudentLabels = {
  researchSpace: "Không gian nghiên cứu",
  heroCta: "Tham gia với chúng tôi",
  closingTitle: "Sẵn sàng kiến tạo tương lai AI?",
  closingButton: "Tham gia với chúng tôi",
} as const;

const approvedContactLabels = {
  heroDescription:
    "Trung tâm Nghiên cứu và Ứng dụng Trí tuệ Nhân tạo (AIC) luôn sẵn sàng kết nối, hợp tác và chia sẻ không gian nghiên cứu chuyên sâu.",
} as const;

describe("page CTA layout", () => {
  it.each([
    [<StudentsPage />, approvedStudentLabels.closingTitle],
    [<CooperationPage />, cooperationSectionLabels.closingTitle],
  ])("keeps the %s CTA inside the standard page container", (page, title) => {
    const { container } = render(page, {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });
    const heading = screen.getAllByRole("heading", { name: title }).at(-1);
    const pageContainer = heading?.closest(".max-w-7xl");

    expect(pageContainer).toBeInTheDocument();
    expect(container.querySelector("main")).not.toBeInTheDocument();
  });
});

describe("verified core with Stitch demo content", () => {
  it("uses an h2 introduction without StudentHero when embedded", () => {
    const { container, getByTestId } = render(<StudentsPage embedded />, {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: siteContent.pages.students.title }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("students-hero")).not.toBeInTheDocument();
    expect(container.querySelector(".route-transition")).not.toBeInTheDocument();
    expect(container.querySelectorAll("[data-student-lab]")).toHaveLength(2);
    expect(getByTestId("student-timeline").children).toHaveLength(5);
    expect(screen.getByRole("link", { name: approvedStudentLabels.closingButton })).toHaveAttribute(
      "href",
      "mailto:aic-sict@haui.edu.vn",
    );
  });

  it("renders the approved student page content in source order", () => {
    const { container } = render(<StudentsPage />, {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    expect(
      screen.getByRole("heading", { level: 1, name: "Ươm mầm tài năng AI" }),
    ).toBeInTheDocument();
    expect(screen.getByText(siteContent.pages.students.description ?? "")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: approvedStudentLabels.researchSpace }),
    ).toBeInTheDocument();
    expect(container.querySelectorAll("[data-student-lab]")).toHaveLength(2);
    for (const lab of siteContent.students.labs) {
      const heading = screen.getByRole("heading", { name: lab.name });
      const card = heading.closest("[data-student-lab]");

      expect(lab.source).toBe("stitch");
      expect(card).toHaveTextContent(lab.positioning ?? "");
      expect(card?.querySelectorAll("[data-lab-benefit]")).toHaveLength(2);
      for (const benefit of lab.benefits ?? []) expect(card).toHaveTextContent(benefit);
      expect(screen.getByTestId(`media-slot-${lab.mediaRef}`)).toBeInTheDocument();
    }

    const timeline = screen.getByTestId("student-timeline");
    expect(timeline.tagName).toBe("OL");
    expect(timeline.children).toHaveLength(5);
    expect(Array.from(timeline.children).every((step) => step.tagName === "LI")).toBe(true);
    expect(
      Array.from(timeline.children).map((step) => step.querySelector("h3")?.textContent),
    ).toEqual(siteContent.students.joinSteps.map((step) => step.title));
    expect(siteContent.students.joinSteps.every((step) => step.source === "stitch")).toBe(true);
    expect(screen.queryByRole("heading", { name: "Thực tập nghiên cứu" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Tuyển cộng tác viên" })).not.toBeInTheDocument();
  });

  it("uses semantic student media, functional CTAs, and md responsive grids", () => {
    const students = render(<StudentsPage />, {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });
    const hero = students.getByTestId("students-hero");
    const heroCta = hero.querySelector("a");
    const researchSpace = students.container.querySelector("#research-space");
    const labGrid = students.getByTestId("student-lab-grid");
    const timeline = students.getByTestId("student-timeline");

    expect(hero).toHaveClass("md:grid-cols-2");
    expect(hero.className).not.toContain("sm:grid-cols-2");
    const heroMedia = students.getByTestId("media-slot-students.hero");
    expect(heroMedia).toHaveClass("aspect-[4/3]");
    expect(heroMedia.className).not.toContain("lg:aspect-");
    expect(heroCta).toHaveAttribute("href", "#research-space");
    expect(researchSpace).toBeInTheDocument();
    expect(labGrid).toHaveClass("md:grid-cols-2");
    expect(timeline).toHaveClass("md:grid-cols-5");
    expect(labGrid.className).not.toContain("sm:grid-cols-2");
    expect(timeline.className).not.toContain("sm:grid-cols-5");
    const closingHeading = screen.getByRole("heading", {
      name: approvedStudentLabels.closingTitle,
    });
    expect(closingHeading.parentElement?.querySelector("a")).toHaveAttribute(
      "href",
      "mailto:aic-sict@haui.edu.vn",
    );
    students.unmount();
  });

  it("renders full-width student hero copy without a blank media column when no media ref exists", () => {
    const contentWithoutStudentMedia: SiteContent = {
      ...siteContent,
      pages: {
        ...siteContent.pages,
        students: { ...siteContent.pages.students, mediaRef: undefined },
      },
    };
    const { getByTestId } = render(
      <StudentsPage content={contentWithoutStudentMedia} scaffoldMode={false} />,
      { wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter> },
    );
    const hero = getByTestId("students-hero");

    expect(hero.children).toHaveLength(1);
    expect(hero.className).not.toContain("md:grid-cols-2");
    expect(hero.className).not.toContain("grid");
  });

  it("renders three verified contact cards beside the current embedded map", () => {
    const { container } = render(<ContactPage />, {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    expect(screen.getByRole("heading", { name: "Phòng 1201, Tòa nhà A1" })).toBeInTheDocument();
    const emailLink = screen.getByText("aic-sict@haui.edu.vn").closest("a");
    const map = screen.getByTitle(contactSectionLabels.mapTitle);
    const band = map.parentElement?.parentElement;

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: siteContent.pages.contact.title,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(approvedContactLabels.heroDescription)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Phòng 1504, Tòa nhà A1" })).toBeInTheDocument();
    expect(container.querySelectorAll("[data-contact-card]")).toHaveLength(3);
    expect(
      screen.getAllByText(verifiedSiteContentVi.contact.items[0].secondary ?? ""),
    ).toHaveLength(2);
    expect(emailLink).toHaveAttribute("href", "mailto:aic-sict@haui.edu.vn");
    expect(band).toHaveClass("md:grid-cols-[.75fr_1.5fr]");
    expect(band?.className).not.toContain("sm:grid-cols");
    expect(map).toHaveAttribute("src", siteContent.contact.mapUrl);
    expect(container.querySelector("form")).not.toBeInTheDocument();
    expect(container.textContent).not.toMatch(/\b0\d{9,10}\b/);
  });

  it("keeps contact records sourced from verified content", () => {
    expect(siteContent.contact.items).toEqual(verifiedSiteContentVi.contact.items);
    expect(siteContent.contact.email).toBe(verifiedSiteContentVi.contact.email);
  });

  it("uses an injected verified contact map URL instead of the neutral semantic slot", () => {
    const mapUrl = "https://maps.example.test/embed/aic";
    const contentWithMap: SiteContent = {
      ...siteContent,
      contact: { ...verifiedSiteContentVi.contact, mapUrl },
    };
    render(<ContactPage content={contentWithMap} scaffoldMode={false} />, {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    const iframe = screen.getByTitle(contactSectionLabels.mapTitle);
    expect(iframe).toHaveAttribute("src", mapUrl);
    expect(screen.queryByTestId("media-slot-contact.map")).not.toBeInTheDocument();
  });

  it("hides empty student bands and mirrors the approved layout in scaffold mode", () => {
    const empty = render(<StudentsPage content={emptySiteContent} scaffoldMode={false} />, {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });
    expect(empty.container.querySelector("section")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: approvedStudentLabels.heroCta }),
    ).not.toBeInTheDocument();
    empty.unmount();

    const scaffold = render(<StudentsPage content={emptySiteContent} scaffoldMode />, {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });
    expect(scaffold.container.querySelector('[data-scaffold="media"]')).toBeInTheDocument();
    expect(scaffold.getByTestId("student-labs-scaffold").children).toHaveLength(2);
    expect(scaffold.getByTestId("student-timeline-scaffold").children).toHaveLength(5);
    expect(screen.queryByText(/đang cập nhật/i)).not.toBeInTheDocument();
  });
});

describe("organization layout variants", () => {
  const renderOrganization = () =>
    render(<OrganizationPage />, {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

  const organizationContent = ({
    people = [],
    council = [],
  }: {
    people?: Person[];
    council?: CouncilMember[];
  } = {}): SiteContent => ({
    ...siteContent,
    people,
    research: { ...siteContent.research, council },
  });

  it("renders the four sourced organization groups with their distinct item counts", () => {
    const { container } = renderOrganization();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: siteContent.pages.organization.title,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(siteContent.pages.organization.description ?? "")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ban giám đốc" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Hội đồng khoa học" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Trưởng nhóm nghiên cứu (giảng viên)" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Trưởng nhóm nghiên cứu (sinh viên)" }),
    ).toBeInTheDocument();

    expect(container.querySelectorAll('[data-person-variant="director"]')).toHaveLength(3);
    expect(container.querySelectorAll("[data-council-member]")).toHaveLength(3);
    expect(container.querySelectorAll('[data-person-variant="teacher"]')).toHaveLength(3);
    expect(container.querySelectorAll('[data-person-variant="student"]')).toHaveLength(6);
  });

  it("uses current portrait media and renders mail links for every staff member with email", () => {
    renderOrganization();

    const peopleWithPortraits = siteContent.people;
    for (const person of peopleWithPortraits) {
      expect(person.mediaRef).toBeTruthy();
      const card = screen
        .getByRole("heading", { name: person.name })
        .closest("[data-person-variant]") as HTMLElement;
      const media = resolveMedia(person.mediaRef!);

      if (media?.src) {
        expect(card.querySelector("img")).toHaveAttribute("src", media.src);
      } else {
        expect(within(card).getByTestId(`media-slot-${person.mediaRef}`)).toBeInTheDocument();
      }
    }

    const emailLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.startsWith("mailto:"));
    expect(emailLinks.map((link) => link.getAttribute("href"))).toEqual(
      siteContent.people.filter((person) => person.email).map((person) => `mailto:${person.email}`),
    );
  });

  it("keeps the current organization group breakpoints and compact teacher stack", () => {
    const { getByTestId } = renderOrganization();

    expect(getByTestId("organization-director-grid")).toHaveClass("grid-cols-1", "lg:grid-cols-3");
    expect(getByTestId("organization-band")).toHaveClass("md:grid-cols-2");
    expect(getByTestId("organization-teacher-grid")).toHaveClass("grid-cols-1", "gap-y-4");
    expect(getByTestId("organization-student-grid")).toHaveClass(
      "grid-cols-2",
      "md:grid-cols-3",
      "lg:grid-cols-6",
    );
    const teacherCards = getByTestId("organization-teacher-grid").querySelectorAll(
      '[data-person-variant="teacher"]',
    );
    for (const teacherCard of teacherCards) {
      expect(teacherCard).not.toHaveClass("md:col-span-2");
    }

    for (const grid of [
      getByTestId("organization-director-grid"),
      getByTestId("organization-band"),
      getByTestId("organization-teacher-grid"),
      getByTestId("organization-student-grid"),
    ]) {
      expect(grid.className).not.toContain("sm:grid-cols-2");
    }
  });

  it("gates organization headings and council shells through content state", () => {
    const emptyGroup = render(
      <OrganizationGroup title="Nhóm trống" state={{ status: "empty" }} variant="teacher" />,
    );
    expect(screen.queryByRole("heading", { name: "Nhóm trống" })).not.toBeInTheDocument();
    emptyGroup.unmount();

    const scaffoldGroup = render(
      <OrganizationGroup
        title="Nhóm đang cập nhật"
        state={{ status: "scaffold", expectedCount: 2 }}
        variant="teacher"
      />,
    );
    expect(screen.getByRole("heading", { name: "Nhóm đang cập nhật" })).toBeInTheDocument();
    expect(scaffoldGroup.container.querySelector('[data-scaffold="people"]')).toBeInTheDocument();
    scaffoldGroup.unmount();

    const emptyCouncil = render(
      <CouncilPanel title="Hội đồng trống" state={{ status: "empty" }} />,
    );
    expect(screen.queryByRole("heading", { name: "Hội đồng trống" })).not.toBeInTheDocument();
    emptyCouncil.unmount();

    const scaffoldCouncil = render(
      <CouncilPanel
        title="Hội đồng đang cập nhật"
        state={{ status: "scaffold", expectedCount: 3 }}
      />,
    );
    expect(screen.getByRole("heading", { name: "Hội đồng đang cập nhật" })).toBeInTheDocument();
    expect(
      scaffoldCouncil.container.querySelector('[data-scaffold="council"]')?.children,
    ).toHaveLength(3);
  });

  it("renders ready people and council members directly from state.items", () => {
    const statePerson = siteContent.people.find((person) => person.group === "teacher-lab")!;
    const people = render(
      <OrganizationGroup
        title="Nguồn nhân sự"
        state={{ status: "ready", items: [statePerson] }}
        variant="teacher"
      />,
    );
    expect(screen.getByRole("heading", { name: statePerson.name })).toBeInTheDocument();
    people.unmount();

    const stateMember = siteContent.research.council![0];
    render(
      <CouncilPanel title="Nguồn hội đồng" state={{ status: "ready", items: [stateMember] }} />,
    );
    expect(screen.getByRole("heading", { name: stateMember.name })).toBeInTheDocument();
  });

  it("keeps the page shell but removes every organization group when content is empty", () => {
    const { container } = render(
      <OrganizationPage content={organizationContent()} scaffoldMode={false} />,
      { wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter> },
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: siteContent.pages.organization.title,
      }),
    ).toBeInTheDocument();
    expect(container.querySelector("[data-organization-variant]")).not.toBeInTheDocument();
    expect(container.querySelector('[data-testid="organization-band"]')).not.toBeInTheDocument();
  });

  it.each([
    [
      "teacher only",
      organizationContent({
        people: siteContent.people.filter((person) => person.group === "teacher-lab"),
      }),
      "Trưởng nhóm nghiên cứu (giảng viên)",
      "Hội đồng khoa học",
    ],
    [
      "council only",
      organizationContent({ council: siteContent.research.council }),
      "Hội đồng khoa học",
      "Trưởng nhóm nghiên cứu (giảng viên)",
    ],
  ])("uses a one-column organization band for %s content", (_, content, visible, hidden) => {
    const { getByTestId } = render(<OrganizationPage content={content} scaffoldMode={false} />, {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    expect(screen.getByRole("heading", { name: visible })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: hidden })).not.toBeInTheDocument();
    expect(getByTestId("organization-band")).toHaveClass("grid-cols-1");
    expect(getByTestId("organization-band")).not.toHaveClass("md:grid-cols-2");
  });

  it("mirrors ready organization grids in scaffold mode", () => {
    const { getByTestId } = render(
      <OrganizationPage content={organizationContent()} scaffoldMode />,
      { wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter> },
    );

    const directors = getByTestId("organization-director-scaffold");
    const teachers = getByTestId("organization-teacher-scaffold");
    const students = getByTestId("organization-student-scaffold");

    expect(directors).toHaveClass("lg:grid-cols-3");
    expect(directors.children).toHaveLength(3);
    expect(teachers).toHaveClass("md:grid-cols-2");
    expect(teachers.children).toHaveLength(3);
    expect(teachers.lastElementChild).toHaveClass("md:col-span-2");
    expect(students).toHaveClass("grid-cols-2", "md:grid-cols-3", "lg:grid-cols-6");
    expect(students.children).toHaveLength(6);
  });

  it("marks the Home organization preview as an explicit director grid", () => {
    const { container } = render(<HomePage />, {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    const grid = container.querySelector(
      '[data-testid="home-organization"] [data-person-grid-variant="director"]',
    );

    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass("grid-cols-1", "lg:grid-cols-3");
    expect(grid?.className).not.toContain("md:grid-cols-2");
    expect(grid?.className).not.toContain("sm:grid-cols-2");
  });

  it("renders the Home contact preview as responsive verified cards beside the semantic map", () => {
    const { container, getByTestId } = render(<HomePage />, {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });
    const band = getByTestId("home-contact-band");
    const cards = band.querySelectorAll("[data-contact-card]");
    const cardGrid = cards[0]?.parentElement;
    const map = within(band).getByTitle(contactSectionLabels.mapTitle);

    expect(cards).toHaveLength(3);
    expect(Array.from(cards).map((card) => card.getAttribute("data-contact-card"))).toEqual(
      verifiedSiteContentVi.contact.items.map((item) => item.id),
    );
    expect(cardGrid).toHaveClass("md:grid-cols-3", "lg:grid-cols-1");
    expect(cardGrid?.className).not.toContain("sm:grid-cols");
    expect(band).toHaveClass("lg:grid-cols-[.75fr_1.5fr]");
    expect(band.className).not.toContain("sm:grid-cols");
    expect(map.parentElement).toHaveClass("rounded-video");
    expect(map).toHaveAttribute("src", resolveMedia("contact.map")?.embedUrl);
    expect(container.querySelector('iframe[src=""]')).not.toBeInTheDocument();
  });
});

describe("research page layout", () => {
  const renderResearch = (content = siteContent, scaffoldMode?: boolean) =>
    render(<ResearchPage content={content} scaffoldMode={scaffoldMode} />, {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

  const researchContent = ({
    directions = siteContent.research.directions,
    metrics = siteContent.research.metrics ?? [],
    groups = siteContent.research.groups,
  } = {}): SiteContent => ({
    ...siteContent,
    research: { ...siteContent.research, directions, metrics, groups },
  });

  it("uses an h2 introduction and no page hero when embedded", () => {
    const { container, getByTestId } = render(<ResearchPage embedded />, {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: siteContent.pages.research.title }),
    ).toBeInTheDocument();
    expect(container.querySelector(".route-transition")).not.toBeInTheDocument();
    expect(container.querySelectorAll('[data-research-card="direction"]')).toHaveLength(3);
    expect(getByTestId("research-metrics").children).toHaveLength(4);
    expect(container.querySelectorAll('[data-research-card="lab"]')).toHaveLength(7);
    expect(document.getElementById("research-groups")).toBeInTheDocument();
  });

  it("renders the centered hero followed by directions, metrics, and labs", () => {
    const { getByTestId } = renderResearch();
    const hero = screen.getByRole("heading", { level: 1, name: siteContent.pages.research.title });
    const directions = getByTestId("research-directions");
    const metrics = getByTestId("research-metrics");
    const labs = getByTestId("research-labs");

    expect(hero.parentElement?.parentElement).toHaveClass("text-center");
    expect(
      directions.compareDocumentPosition(metrics) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(metrics.compareDocumentPosition(labs) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(getByTestId("research-metric-band").tagName).toBe("DIV");
    expect(screen.queryByRole("heading", { name: "Kết quả nghiên cứu" })).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: researchSectionLabels.cooperationCta }),
    ).toBeInTheDocument();
  });

  it("renders the exact sourced direction, metric, and lab records", () => {
    const { container, getByTestId } = renderResearch();

    expect(container.querySelectorAll('[data-research-card="direction"]')).toHaveLength(3);
    expect(getByTestId("research-metrics").children).toHaveLength(4);
    expect(container.querySelectorAll('[data-research-card="lab"]')).toHaveLength(7);
    expect(
      Array.from(getByTestId("research-metrics").children).map((metric) => metric.textContent),
    ).toEqual(siteContent.research.metrics?.map(({ value, label }) => `${value}${label}`));
  });

  it("renders an optional research direction CTA as a functional in-page link", () => {
    const cta = "Xem hướng nghiên cứu";
    const direction = { ...siteContent.research.directions[0], cta };
    renderResearch(researchContent({ directions: [direction] }));

    expect(screen.getByRole("link", { name: cta })).toHaveAttribute("href", "#research-groups");
    expect(document.getElementById("research-groups")).toBeInTheDocument();
  });

  it.each([
    ["empty", false],
    ["scaffold", true],
  ])("hides direction CTA links when research groups are %s", (_, scaffoldMode) => {
    const cta = "Xem hướng nghiên cứu";
    const direction = { ...siteContent.research.directions[0], cta };
    renderResearch(researchContent({ directions: [direction], groups: [] }), scaffoldMode);

    expect(screen.queryByRole("link", { name: cta })).not.toBeInTheDocument();
    expect(document.getElementById("research-groups")).not.toBeInTheDocument();
  });

  it("uses the current compact lab presentation and resolves every sourced media slot", () => {
    const { container } = renderResearch();

    expect(container.querySelectorAll('[data-research-variant="compact"]')).toHaveLength(7);
    expect(container.querySelector('[data-research-variant="featured"]')).not.toBeInTheDocument();
    expect(container.querySelector('[data-research-variant="accent"]')).not.toBeInTheDocument();

    for (const item of [...siteContent.research.directions, ...siteContent.research.groups]) {
      if (item.mediaRef) {
        expect(screen.getByTestId(`media-slot-${item.mediaRef}`)).toBeInTheDocument();
      }
    }
  });

  it("keeps lab presentation variants independent from content records", () => {
    const groups = [...siteContent.research.groups]
      .reverse()
      .map((item) => ({ ...item, variant: item.id === "nlp-lab" ? "featured" : undefined }));
    renderResearch(researchContent({ groups }));

    expect(
      screen.getByRole("heading", { name: "Computer Vision Lab" }).closest("[data-research-card]"),
    ).toHaveAttribute("data-research-variant", "compact");
    expect(
      screen.getByRole("heading", { name: "Applied AI Lab" }).closest("[data-research-card]"),
    ).toHaveAttribute("data-research-variant", "compact");
    expect(
      screen.getByRole("heading", { name: "NLP Lab" }).closest("[data-research-card]"),
    ).toHaveAttribute("data-research-variant", "compact");
    expect(
      screen
        .getAllByRole("heading", { level: 3 })
        .filter((heading) => heading.closest('[data-research-card="lab"]'))
        .map((heading) => heading.textContent),
    ).toEqual(siteContent.research.groups.map((group) => group.title));
  });

  it("renders every sourced lab member count with the centralized suffix", () => {
    renderResearch();

    for (const group of siteContent.research.groups) {
      if (group.memberCount !== undefined) {
        expect(
          screen.getByRole("heading", { name: group.title }).closest("[data-research-card]"),
        ).toHaveTextContent(`${group.memberCount} ${researchSectionLabels.membersSuffix}`);
      }
    }
  });

  it("preserves configured research image alt text", () => {
    const alt = "Mô hình thị giác máy tính trong phòng nghiên cứu";
    const direction = {
      ...siteContent.research.directions[0],
      mediaRef: undefined,
      image: { src: "/media/research/computer-vision.jpg", alt },
    };
    renderResearch(researchContent({ directions: [direction] }));

    expect(screen.getByRole("img", { name: alt })).toHaveAttribute(
      "src",
      "/media/research/computer-vision.jpg",
    );
  });

  it("uses only md-or-larger responsive columns", () => {
    const { getByTestId } = renderResearch();
    const directions = getByTestId("research-direction-grid");
    const metrics = getByTestId("research-metrics");
    const labs = getByTestId("research-lab-grid");

    expect(directions).toHaveClass("grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3");
    expect(metrics).toHaveClass("grid-cols-2", "md:grid-cols-4");
    expect(labs).toHaveClass("grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3");
    for (const grid of [directions, metrics, labs]) {
      expect(grid.className).not.toContain("sm:grid-cols");
    }
  });

  it("hides empty research bands without blank section headings", () => {
    const { container } = renderResearch(
      researchContent({ directions: [], metrics: [], groups: [] }),
      false,
    );

    expect(container.querySelector('[data-testid="research-directions"]')).not.toBeInTheDocument();
    expect(container.querySelector('[data-testid="research-metrics"]')).not.toBeInTheDocument();
    expect(container.querySelector('[data-testid="research-labs"]')).not.toBeInTheDocument();
    expect(container.querySelectorAll("h2")).toHaveLength(1);
    expect(
      screen.getByRole("heading", { level: 2, name: researchSectionLabels.cooperationCta }),
    ).toBeInTheDocument();
  });

  it("mirrors the 3/4/7 ready layouts in scaffold mode without placeholder copy", () => {
    const { container, getByTestId } = renderResearch(
      researchContent({ directions: [], metrics: [], groups: [] }),
      true,
    );

    const directions = getByTestId("research-direction-scaffold");
    const metrics = getByTestId("research-metric-scaffold");
    const labs = getByTestId("research-lab-scaffold");
    expect(directions.children).toHaveLength(3);
    expect(metrics.children).toHaveLength(4);
    expect(labs.children).toHaveLength(7);
    expect(Array.from(labs.children).map((item) => item.getAttribute("data-layout-id"))).toEqual(
      siteContent.research.groups.map((group) => group.id),
    );
    expect(directions).toHaveClass("grid-cols-1", "md:grid-cols-3");
    expect(metrics).toHaveClass("grid-cols-2", "md:grid-cols-4");
    expect(labs).toHaveClass("grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3");
    expect(labs.querySelectorAll('[data-research-variant="compact"]')).toHaveLength(7);
    expect(labs.querySelector('[data-research-variant="featured"]')).not.toBeInTheDocument();
    expect(labs.querySelector('[data-research-variant="accent"]')).not.toBeInTheDocument();
    expect(container).not.toHaveTextContent(/placeholder|demo|đang cập nhật/i);
  });
});

describe("cooperation page layout", () => {
  const renderCooperation = (content = siteContent, scaffoldMode?: boolean) =>
    render(<CooperationPage content={content} scaffoldMode={scaffoldMode} />, {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

  it("uses an h2 introduction without the page-level hero when embedded", () => {
    const { container, getByTestId } = render(<CooperationPage embedded />, {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: siteContent.pages.cooperation.title }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("cooperation-hero")).not.toBeInTheDocument();
    expect(screen.queryByTestId("cooperation-hero-media")).not.toBeInTheDocument();
    expect(container.querySelector(".route-transition")).not.toBeInTheDocument();
    expect(container.querySelectorAll("[data-cooperation-card]")).toHaveLength(3);
    expect(
      getByTestId("partner-grid").querySelectorAll(
        '[data-marquee-group="primary"] [data-logo-source]',
      ),
    ).toHaveLength(8);
    expect(
      screen.getByRole("link", { name: cooperationSectionLabels.closingButton }),
    ).toHaveAttribute("href", "mailto:aic-sict@haui.edu.vn");
  });

  it("renders the sourced sections in screenshot order with exact record counts", () => {
    const { container, getByTestId } = renderCooperation();
    const hero = getByTestId("cooperation-hero");
    const fields = getByTestId("cooperation-fields");
    const international = getByTestId("cooperation-international");
    const partners = getByTestId("cooperation-partners");
    const closing = getByTestId("cooperation-closing");

    expect(
      screen.getByRole("heading", { level: 1, name: "Mở rộng giới hạn cùng AI" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: cooperationSectionLabels.fields }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: cooperationSectionLabels.partners }),
    ).toBeInTheDocument();
    expect(container.querySelectorAll("[data-cooperation-card]")).toHaveLength(3);
    expect(
      getByTestId("partner-grid").querySelectorAll(
        '[data-marquee-group="primary"] [data-logo-source]',
      ),
    ).toHaveLength(8);
    expect(getByTestId("partner-grid")).toHaveAttribute("data-layout", "marquee");
    expect(fields.querySelector("svg")).not.toBeInTheDocument();

    for (const [before, after] of [
      [hero, fields],
      [fields, international],
      [international, partners],
      [partners, closing],
    ]) {
      expect(before.compareDocumentPosition(after) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
  });

  it("uses a semantic 4:3 hero slot and functional in-page action", () => {
    const { container, getByTestId } = renderCooperation();
    const hero = getByTestId("cooperation-hero");
    const media = screen.getByTestId("media-slot-cooperation.hero");

    expect(hero.querySelector(".grid")).toHaveClass("grid-cols-1", "md:grid-cols-2");
    expect(media).toHaveClass("aspect-[4/3]");
    expect(screen.getByRole("link", { name: cooperationSectionLabels.heroCta })).toHaveAttribute(
      "href",
      "#cooperation-fields",
    );
    expect(container.querySelector("#cooperation-fields")).toBeInTheDocument();
  });

  it.each([
    ["empty", false],
    ["scaffold", true],
  ])("hides the hero action when cooperation types are %s", (_, scaffoldMode) => {
    const { container } = renderCooperation(emptySiteContent, scaffoldMode);

    expect(
      screen.queryByRole("link", { name: cooperationSectionLabels.heroCta }),
    ).not.toBeInTheDocument();
    expect(container.querySelector("#cooperation-fields")).not.toBeInTheDocument();
  });

  it("renders the international content as one full-width navy banner", () => {
    const { getByTestId } = renderCooperation();
    const banner = getByTestId("cooperation-international-banner");
    const international = siteContent.cooperation.international[0];

    expect(banner).toHaveClass("w-full", "bg-aic-navy");
    expect(
      screen.getByRole("heading", { level: 2, name: international.title }),
    ).toBeInTheDocument();
    expect(banner).toHaveTextContent(international.description);
  });

  it("renders the standalone closing panel from centralized copy with verified mailto", () => {
    const { getByTestId } = renderCooperation();
    const closing = getByTestId("cooperation-closing");

    expect(
      screen.getByRole("heading", { level: 2, name: cooperationSectionLabels.closingTitle }),
    ).toBeInTheDocument();
    expect(closing).toHaveTextContent(cooperationSectionLabels.closingDescription);
    expect(
      screen.getByRole("link", { name: cooperationSectionLabels.closingButton }),
    ).toHaveAttribute("href", "mailto:aic-sict@haui.edu.vn");
  });

  it("uses the current field grid and marquee partner layout", () => {
    const { getByTestId } = renderCooperation();
    const fields = getByTestId("cooperation-field-grid");
    const partners = getByTestId("partner-grid");

    expect(fields).toHaveClass("grid-cols-1", "md:grid-cols-3");
    expect(partners).toHaveAttribute("data-layout", "marquee");
    expect(partners).toHaveAttribute("data-reduced-motion-layout", "static");
    expect(partners).toHaveClass("partner-marquee");
    expect(fields.className).not.toContain("sm:grid-cols");
    expect(partners.className).not.toContain("sm:grid-cols");
  });

  it("hides every full section when cooperation content is empty", () => {
    const { container } = renderCooperation(emptySiteContent, false);

    expect(
      screen.getByRole("heading", { level: 1, name: emptySiteContent.pages.cooperation.title }),
    ).toBeInTheDocument();
    expect(container.querySelector("section")).not.toBeInTheDocument();
    expect(container.querySelector("[data-cooperation-card]")).not.toBeInTheDocument();
    expect(container.querySelector("[data-testid='partner-grid']")).not.toBeInTheDocument();
  });

  it("mirrors the 3-card, banner, and 8-logo layout in scaffold mode without placeholder copy", () => {
    const { container, getByTestId } = renderCooperation(emptySiteContent, true);
    const types = getByTestId("cooperation-types-scaffold");
    const banner = getByTestId("cooperation-banner-scaffold");
    const partners = getByTestId("cooperation-partner-scaffold");

    expect(
      getByTestId("cooperation-hero").querySelector('[data-scaffold="media"]'),
    ).toBeInTheDocument();
    expect(types.children).toHaveLength(3);
    expect(types).toHaveClass("grid-cols-1", "md:grid-cols-3");
    expect(banner).toHaveClass("w-full", "bg-aic-navy");
    expect(partners.children).toHaveLength(8);
    expect(partners).toHaveClass("grid-cols-2", "md:grid-cols-4");
    expect(container).not.toHaveTextContent(/placeholder|demo|đang cập nhật/i);
  });
});
