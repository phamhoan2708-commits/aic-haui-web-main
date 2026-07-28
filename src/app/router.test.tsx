import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { labelsEn, labelsVi } from "../content/labels";
import { composeSiteContent, siteContent } from "../content/site";
import { stitchContentEn } from "../content/stitchEn";
import { verifiedSiteContentEn } from "../content/verified";
import { LanguageProvider } from "../contexts/LanguageProvider";
import { verifiedSiteContentVi } from "../content/verified";
import { legacyLandingSections } from "./landingSections";
import { createAppRouter } from "./router";

const expectedLegacyLandingSections = [
  { legacyPath: "/ve-chung-toi", id: "ve-chung-toi" },
  { legacyPath: "/to-chuc", id: "to-chuc" },
  { legacyPath: "/nghien-cuu", id: "nghien-cuu" },
  { legacyPath: "/hop-tac", id: "hop-tac" },
  { legacyPath: "/sinh-vien", id: "sinh-vien" },
  { legacyPath: "/lien-he", id: "lien-he" },
] as const;

describe("application routes", () => {
  it("renders one home page heading", async () => {
    render(<RouterProvider router={createAppRouter(["/"])} />);

    expect(
      await screen.findByRole("heading", { level: 1, name: siteContent.hero.title }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("keeps the exact legacy route-to-anchor mapping", () => {
    expect(legacyLandingSections.map(({ legacyPath, id }) => ({ legacyPath, id }))).toEqual(
      expectedLegacyLandingSections,
    );
  });

  it.each(expectedLegacyLandingSections)(
    "replaces legacy route $legacyPath with the $id landing anchor",
    async ({ legacyPath, id }) => {
      const appRouter = createAppRouter([legacyPath]);
      render(<RouterProvider router={appRouter} />);

      await waitFor(() => {
        expect(appRouter.state.location.pathname).toBe("/");
        expect(appRouter.state.location.hash).toBe(`#${id}`);
        expect(appRouter.state.historyAction).toBe("REPLACE");
      });
      expect(
        screen.getByRole("heading", { level: 1, name: siteContent.hero.title }),
      ).toBeInTheDocument();
    },
  );

  it("renders a not-found page", () => {
    render(<RouterProvider router={createAppRouter(["/khong-ton-tai"])} />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Không tìm thấy trang" }),
    ).toBeInTheDocument();
  });
});

describe("home page", () => {
  it("switches the complete landing page between the centralized Vietnamese and English content", async () => {
    const user = userEvent.setup();
    const englishContent = composeSiteContent(verifiedSiteContentEn, stitchContentEn);

    render(
      <LanguageProvider>
        <RouterProvider router={createAppRouter(["/"])} />
      </LanguageProvider>,
    );

    const desktopNavigation = screen.getByTestId("header-nav-tier");
    expect(
      within(desktopNavigation).getByRole("link", { name: labelsVi.navigationLabels.news }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: labelsVi.homeNewsLabels.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(siteContent.about.intro ?? "")).toBeInTheDocument();

    const brandTier = screen.getByTestId("header-brand-tier");
    await user.click(
      within(brandTier).getByRole("button", {
        name: labelsVi.layoutLabels.englishLanguage,
      }),
    );

    expect(
      within(desktopNavigation).getByRole("link", { name: labelsEn.navigationLabels.news }),
    ).toBeInTheDocument();
    expect(
      within(desktopNavigation).getByRole("link", { name: labelsEn.navigationLabels.research }),
    ).toBeInTheDocument();
    expect(
      within(desktopNavigation).getByRole("link", { name: labelsEn.navigationLabels.cooperation }),
    ).toBeInTheDocument();
    expect(
      within(desktopNavigation).getByRole("link", { name: labelsEn.navigationLabels.students }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: englishContent.pages.research.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: englishContent.pages.cooperation.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: englishContent.pages.students.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: labelsEn.aboutSectionLabels.homeHeading }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: englishContent.pages.contact.title }),
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId("home-contact")).getByText(
        verifiedSiteContentEn.contact.items[0].primary,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: stitchContentEn.hero.primaryCta })).toBeInTheDocument();

    await user.click(within(brandTier).getByRole("button", { name: "Vietnamese language" }));

    expect(
      within(desktopNavigation).getByRole("link", { name: labelsVi.navigationLabels.news }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: labelsVi.homeNewsLabels.title }),
    ).toBeInTheDocument();
  });

  it("uses the centralized hero actions with functional destination links", () => {
    render(<RouterProvider router={createAppRouter(["/"])} />);

    expect(screen.getByRole("link", { name: siteContent.hero.primaryCta })).toHaveAttribute(
      "href",
      "/#nghien-cuu",
    );
    expect(screen.getByRole("link", { name: siteContent.hero.secondaryCta })).toHaveAttribute(
      "href",
      "/#sinh-vien",
    );
  });

  it("composes every approved landing section in the required anchor order", () => {
    const { container } = render(<RouterProvider router={createAppRouter(["/"])} />);
    const sections = Array.from(container.querySelectorAll("[data-landing-section]"));
    const ids = Array.from(container.querySelectorAll("[id]")).map((element) => element.id);

    expect(sections.map((section) => section.id)).toEqual([
      "ve-chung-toi",
      "to-chuc",
      "nghien-cuu",
      "hop-tac",
      "sinh-vien",
      "lien-he",
    ]);
    for (const sectionId of ["nghien-cuu", "hop-tac", "sinh-vien"]) {
      expect(document.getElementById(sectionId)?.parentElement).not.toHaveClass("transition-all");
    }
    expect(new Set(ids).size).toBe(ids.length);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(container.querySelectorAll('[data-research-card="direction"]')).toHaveLength(3);
    expect(screen.getByTestId("research-metrics").children).toHaveLength(4);
    expect(container.querySelectorAll('[data-research-card="lab"]')).toHaveLength(7);
    const partnerLogos = screen
      .getByTestId("partner-grid")
      .querySelectorAll('[data-marquee-group="primary"] [data-logo-source]');
    const primaryPartners = screen
      .getByTestId("partner-grid")
      .querySelector('[data-marquee-group="primary"]');
    expect(partnerLogos).toHaveLength(8);
    expect(primaryPartners).toBeInTheDocument();
    for (let index = 1; index <= 8; index += 1) {
      expect(within(primaryPartners as HTMLElement).getByText(`Logo ${index}`)).toBeInTheDocument();
    }
    expect(container.querySelectorAll("[data-student-lab]")).toHaveLength(2);
    expect(screen.getByTestId("student-timeline").children).toHaveLength(5);
  });

  it("renders every current organization group and three verified contact cards", () => {
    render(<RouterProvider router={createAppRouter(["/"])} />);
    const organization = screen.getByTestId("home-organization");
    const contact = screen.getByTestId("home-contact");
    const directors = siteContent.people.filter((person) => person.group === "director");
    const teacherLeaders = siteContent.people.filter((person) => person.group === "teacher-lab");
    const studentLeaders = siteContent.people.filter((person) => person.group === "student-leader");
    const council = siteContent.research.council ?? [];

    expect(directors).toHaveLength(3);
    expect(teacherLeaders).toHaveLength(3);
    expect(studentLeaders).toHaveLength(6);
    expect(council).toHaveLength(3);
    expect(within(organization).getByTestId("organization-director-grid").children).toHaveLength(3);
    expect(within(organization).getByTestId("organization-teacher-grid").children).toHaveLength(3);
    expect(within(organization).getByTestId("organization-student-grid").children).toHaveLength(6);
    expect(organization.querySelectorAll("[data-council-member]")).toHaveLength(3);
    for (const person of [...directors, ...teacherLeaders, ...studentLeaders]) {
      expect(within(organization).getByRole("heading", { name: person.name })).toBeInTheDocument();
    }
    for (const member of council) {
      expect(within(organization).getByRole("heading", { name: member.name })).toBeInTheDocument();
    }

    expect(verifiedSiteContentVi.contact.items).toHaveLength(3);
    expect(
      within(contact).getByRole("heading", { level: 2, name: siteContent.pages.contact.title }),
    ).toBeInTheDocument();
    expect(within(contact).getAllByRole("heading", { level: 3 })).toHaveLength(3);
    for (const item of verifiedSiteContentVi.contact.items) {
      expect(within(contact).getByText(item.label)).toBeInTheDocument();
    }
  });

  it("reserves a separate frame for the introduction video with or without configured media", () => {
    render(<RouterProvider router={createAppRouter(["/"])} />);
    const videoSection = screen.getByTestId("home-video");
    const video =
      videoSection.querySelector("video") ??
      videoSection.querySelector('[data-testid="media-slot-about.intro-video"]');

    expect(video).not.toBeNull();
    expect(videoSection).toContainElement(video);
    expect(screen.getByTestId("home-about")).not.toContainElement(video);
    expect(video).not.toHaveTextContent(/placeholder|đang cập nhật/i);
  });

  it("uses the approved two-column About composition with a stacked principles panel", () => {
    render(<RouterProvider router={createAppRouter(["/"])} />);
    const about = screen.getByTestId("home-about");
    const layout = within(about).getByTestId("about-layout");
    const vision = within(about).getByText(siteContent.about.vision ?? "");
    const principlesGrid = within(about).getByTestId("about-principles");
    const intro = within(about).getByText(siteContent.about.intro ?? "");

    expect(layout).toHaveClass("lg:grid-cols-[.9fr_1.1fr]");
    expect(intro.parentElement?.parentElement).toBe(layout);
    expect(principlesGrid).toHaveClass("grid-cols-1");
    expect(principlesGrid).not.toHaveClass("md:grid-cols-2", "lg:-mt-16");
    expect(vision.closest("article")?.nextElementSibling).toHaveTextContent(
      siteContent.about.mission ?? "",
    );
    expect(about.querySelector(".neutral-visual")).not.toBeInTheDocument();
  });

  it("keeps the official AIC brand without the discarded prototype name", () => {
    render(<RouterProvider router={createAppRouter(["/"])} />);

    expect(screen.getByRole("img", { name: "Logo AIC" })).toBeInTheDocument();
    expect(screen.queryByText("AIC Center")).not.toBeInTheDocument();
  });
});

describe("home landing sections", () => {
  it("exposes anchor targets for about, organization, and contact", () => {
    render(<RouterProvider router={createAppRouter(["/"])} />);

    expect(document.getElementById("ve-chung-toi")).toBeInTheDocument();
    expect(document.getElementById("to-chuc")).toBeInTheDocument();
    expect(document.getElementById("lien-he")).toBeInTheDocument();
  });

  it("keeps contact cards on the home landing section", () => {
    render(<RouterProvider router={createAppRouter(["/"])} />);
    const contact = screen.getByTestId("home-contact");

    for (const item of verifiedSiteContentVi.contact.items) {
      expect(within(contact).getByText(item.label)).toBeInTheDocument();
    }
  });
});
