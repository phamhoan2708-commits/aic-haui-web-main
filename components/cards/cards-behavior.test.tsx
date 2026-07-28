import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import postcss from "postcss";
import { describe, expect, it } from "vitest";

import type { Lab, MediaManifest, Partner, ResearchItem } from "../../content/types";
import globalsCss from "../../styles/globals.css?raw";
import { HomeNews } from "../sections/HomeNews";
import { PartnerGrid } from "./CooperationCards";
import { PersonCard } from "./PersonCard";
import { ResearchDirectionCard, ResearchGroupCard } from "./ResearchCards";
import { JoinProcess, LabCard } from "./StudentCards";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "../../contexts/LanguageProvider";
import { LanguageSwitcher } from "../navigation/LanguageSwitcher";
import { CouncilPanel } from "./CouncilPanel";
import { ContactCard } from "./ContactCards";

const partners = (count: number): Partner[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `partner-${index}`,
    name: `Partner ${index}`,
    logo: { src: `/partner-${index}.svg`, alt: `Partner ${index}` },
  }));

const mixedPartners = (realSourceCount: number): Partner[] =>
  Array.from({ length: 8 }, (_, index) => ({
    id: `mixed-${index}`,
    name: `Mixed ${index}`,
    ...(index < realSourceCount
      ? { logo: { src: `/mixed-${index}.svg`, alt: `Mixed ${index}` } }
      : { mediaRef: `source-less-${index}` }),
  }));

describe("card data-shape behavior", () => {
  it("localizes a staff portrait accessible name from the rendered person name", async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <LanguageSwitcher overlay={false} />
        <PersonCard
          variant="teacher"
          person={{
            id: "localized-person",
            name: "Nguyễn Minh",
            role: "Teacher",
            group: "teacher-lab",
            image: { src: "/portrait.webp", alt: "Manifest portrait" },
          }}
        />
      </LanguageProvider>,
    );

    expect(screen.getByRole("img", { name: "Ảnh chân dung Nguyễn Minh" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Tiếng Anh" }));

    expect(screen.getByRole("img", { name: "Portrait of Nguyễn Minh" })).toBeInTheDocument();
  });

  it("renders the shared heading tokens on nested news, research, person, lab, and timeline headings", () => {
    const research = render(
      <ResearchDirectionCard
        item={{ id: "research", title: "Research heading", description: "Research copy" }}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Research heading" }).closest("[data-research-card]"),
    ).toHaveClass(
      "[&_h3]:text-[length:var(--type-card-size)]",
      "[&_h3]:leading-[var(--type-card-line)]",
      "[&_h3]:font-bold",
    );
    research.unmount();

    const person = render(
      <PersonCard
        variant="director"
        person={{ id: "person", name: "Person heading", role: "Role", group: "director" }}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Person heading" }).closest("[data-person-variant]"),
    ).toHaveClass("[&_h3]:text-[length:var(--type-card-size)]");
    person.unmount();

    const lab = render(<LabCard lab={{ id: "lab", name: "Lab heading" }} />);
    expect(
      screen.getByRole("heading", { name: "Lab heading" }).closest("[data-student-lab]"),
    ).toHaveClass("[&_h3]:text-[length:var(--type-card-size)]");
    lab.unmount();

    const timeline = render(
      <JoinProcess
        steps={[{ id: "step", title: "Timeline heading", description: "Timeline copy" }]}
      />,
    );
    expect(screen.getByRole("heading", { name: "Timeline heading" })).toHaveClass(
      "text-[length:var(--type-card-size)]",
      "leading-[var(--type-card-line)]",
      "font-bold",
    );
    timeline.unmount();

    render(<HomeNews />, { wrapper: MemoryRouter });
    const newsHeading = screen.getAllByRole("heading", { level: 3 })[0];
    expect(newsHeading.closest(".group")).toHaveClass("[&_h3]:text-[length:var(--type-card-size)]");
  });

  it("uses card heading tokens for standalone student and council member names", () => {
    const student = render(
      <PersonCard
        variant="student"
        person={{
          id: "student-heading",
          name: "Student heading",
          role: "Student role",
          group: "student-leader",
        }}
      />,
    );
    expect(screen.getByRole("heading", { name: "Student heading" })).toHaveClass(
      "text-[length:var(--type-card-size)]",
      "leading-[var(--type-card-line)]",
      "font-bold",
    );
    student.unmount();

    render(
      <CouncilPanel
        title="Council"
        state={{
          status: "ready",
          items: [
            {
              id: "council-member",
              name: "Council member heading",
              role: "Role",
              affiliation: "Affiliation",
              source: "verified",
            },
          ],
        }}
      />,
    );
    expect(screen.getByRole("heading", { name: "Council member heading" })).toHaveClass(
      "text-[length:var(--type-card-size)]",
      "leading-[var(--type-card-line)]",
      "font-bold",
    );
  });

  it("keeps contact labels small while applying shared tokens to the primary heading and address prose", () => {
    render(
      <ContactCard
        item={{
          id: "office",
          label: "Office",
          primary: "Room 1201",
          secondary: "Approved campus address",
        }}
      />,
    );

    expect(screen.getByText("Office")).toHaveClass("text-xs");
    expect(screen.getByRole("heading", { name: "Room 1201" })).toHaveClass(
      "text-[length:var(--type-card-size)]",
      "leading-[var(--type-card-line)]",
      "font-bold",
    );
    expect(screen.getByText("Approved campus address")).toHaveClass(
      "text-[length:var(--type-body-size)]",
      "leading-[var(--type-body-line)]",
    );
  });

  it("keeps long research descriptions readable instead of clamping them", () => {
    const item: ResearchItem = {
      id: "long",
      title: "Nội dung dài",
      description: "Nội dung đã xác minh ".repeat(20),
    };
    render(<ResearchDirectionCard item={item} />);

    expect(
      screen.getByRole("heading", { name: "Nội dung dài" }).nextElementSibling,
    ).not.toHaveClass("line-clamp-4");
  });

  it("renders a decorative icon for a research lab without changing its approved copy", () => {
    render(
      <ResearchGroupCard
        item={{
          id: "computer-vision-lab",
          title: "Computer Vision Lab",
          description: "Approved research description",
        }}
        memberSuffix="members"
      />,
    );

    expect(screen.getByTestId("research-lab-icon-computer-vision-lab")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(screen.getByTestId("research-lab-icon-computer-vision-lab").parentElement).toHaveClass(
      "mb-4",
    );
    expect(screen.getByRole("heading", { name: "Computer Vision Lab" })).toBeInTheDocument();
    expect(screen.getByText("Approved research description")).toBeInTheDocument();
  });

  it("adds a decorative student-lab icon with a reduced-motion fallback", () => {
    render(
      <LabCard
        lab={{
          id: "foundry",
          name: "AI Foundry",
          positioning: "Approved positioning",
          benefits: ["Approved benefit"],
        }}
      />,
    );

    expect(screen.getByTestId("student-lab-icon-foundry")).toHaveAttribute("aria-hidden", "true");
    expect(
      screen.getByRole("heading", { name: "AI Foundry" }).closest("[data-student-lab]"),
    ).toHaveClass(
      "transition-transform",
      "hover:-translate-y-1",
      "motion-reduce:transform-none",
      "motion-reduce:transition-none",
    );
    expect(screen.getByText("Approved positioning")).toBeInTheDocument();
    expect(screen.getByText("Approved benefit")).toBeInTheDocument();
  });

  it("renders the innovation student-lab icon without changing its accessible heading", () => {
    render(<LabCard lab={{ id: "innovation", name: "Innovation Lab" }} />);

    expect(screen.getByTestId("student-lab-icon-innovation")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(screen.getByRole("heading", { name: "Innovation Lab" })).toBeInTheDocument();
  });

  it("keeps unknown student labs without rendering a decorative icon", () => {
    const { container } = render(
      <LabCard
        lab={{
          id: "unlisted-lab",
          name: "Unlisted Lab",
          positioning: "Approved unknown positioning",
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Unlisted Lab" })).toBeInTheDocument();
    expect(screen.getByText("Approved unknown positioning")).toBeInTheDocument();
    expect(container.querySelector('[data-testid^="student-lab-icon-"]')).toBeNull();
  });

  it("renders a lab with only its verified name and no empty copy blocks", () => {
    const lab = { id: "foundry", name: "AIC Foundry Lab" } as Lab;
    const { container } = render(<LabCard lab={lab} />);

    expect(screen.getByRole("heading", { name: "AIC Foundry Lab" })).toBeInTheDocument();
    expect(container.querySelector("p")).not.toBeInTheDocument();
  });

  it("does not reserve portrait media when a person has no approved image", () => {
    const { container } = render(
      <PersonCard
        person={{ id: "one", name: "Tên đã duyệt", role: "Vai trò", group: "director" }}
      />,
    );

    expect(container.querySelector(".bg-neutral-visual")).not.toBeInTheDocument();
  });

  it.each(["director", "teacher"] as const)(
    "clips and zooms the %s portrait while keeping card text visible",
    (variant) => {
      const person = {
        id: variant,
        name: `Approved ${variant}`,
        role: `${variant} role`,
        group: variant === "director" ? "director" : "teacher-lab",
        image: { src: `/${variant}.png`, alt: `${variant} portrait` },
      } as const;
      const { container } = render(<PersonCard person={person} variant={variant} />);
      const portrait = container.querySelector("[data-person-portrait]");

      expect(portrait).toHaveClass(
        "overflow-hidden",
        "[&_img]:transition-transform",
        "[&_img]:duration-500",
        "group-hover:[&_img]:scale-[1.2]",
        "motion-reduce:[&_img]:!transform-none",
        "motion-reduce:[&_img]:transition-none",
      );
      expect(portrait?.querySelector("img")).toHaveAttribute("src", `/${variant}.png`);
      expect(screen.getByRole("heading", { name: `Approved ${variant}` })).toBeVisible();
      expect(screen.getByText(`${variant} role`)).toBeVisible();
    },
  );

  it("does not add the staff portrait zoom treatment to student cards", () => {
    const { container } = render(
      <PersonCard
        variant="student"
        person={{
          id: "student",
          name: "Approved student",
          role: "student role",
          group: "student-leader",
          image: { src: "/student.png", alt: "student portrait" },
        }}
      />,
    );

    const portrait = container.querySelector("[data-person-portrait]");
    expect(portrait).toHaveClass("overflow-hidden");
    expect(portrait).not.toHaveClass("group-hover:[&_img]:scale-[1.2]");
  });

  it("keeps an unresolved staff portrait slot clipped without rendering a broken image", () => {
    const { container } = render(
      <PersonCard
        variant="teacher"
        person={{
          id: "unresolved-teacher",
          name: "Unresolved teacher",
          role: "Teacher role",
          group: "teacher-lab",
          mediaRef: "person-unresolved",
        }}
      />,
    );

    const portrait = container.querySelector("[data-person-portrait]");
    expect(portrait).toHaveClass("h-16", "w-16", "overflow-hidden");
    expect(screen.getByTestId("media-slot-person-unresolved")).toBeInTheDocument();
    expect(portrait?.querySelector("img")).not.toBeInTheDocument();
  });

  it("uses the neutral legacy card by default instead of inferring a variant from the group", () => {
    const { container } = render(
      <PersonCard
        person={{
          id: "advisor",
          name: "Cố vấn",
          role: "Ủy viên",
          group: "advisor",
          bio: "Tiểu sử đã duyệt",
        }}
      />,
    );

    expect(container.firstElementChild).toHaveAttribute("data-person-variant", "legacy");
    expect(container.querySelector('[data-person-variant="director"]')).not.toBeInTheDocument();
    expect(screen.getByText("Tiểu sử")).toBeInTheDocument();
  });

  it("uses the marquee contract for every non-empty partner collection", () => {
    const shortCollection = render(<PartnerGrid partners={partners(4)} />);
    expect(shortCollection.getByTestId("partner-grid")).toHaveAttribute("data-layout", "marquee");
    expect(shortCollection.getByTestId("partner-grid")).toHaveAttribute(
      "data-reduced-motion-layout",
      "static",
    );
    shortCollection.unmount();

    expect(
      render(<PartnerGrid partners={partners(5)} />).getByTestId("partner-grid"),
    ).toHaveAttribute("data-layout", "marquee");
  });

  it("keeps every source-less partner label in the primary marquee group", () => {
    const sourceLessPartners: Partner[] = Array.from({ length: 8 }, (_, index) => ({
      id: `slot-${index + 1}`,
      name: `Logo ${index + 1}`,
      mediaRef: `partner.logo-${index + 1}`,
    }));
    const sourceLessManifest = Object.fromEntries(
      sourceLessPartners.map(({ mediaRef }) => [
        mediaRef!,
        {
          id: mediaRef!,
          kind: "image" as const,
          aspectRatio: "aspect-[3/2]",
          alt: "",
        },
      ]),
    ) satisfies MediaManifest;

    const { getByTestId } = render(
      <PartnerGrid partners={sourceLessPartners} manifest={sourceLessManifest} />,
    );

    const primary = getByTestId("partner-grid").querySelector(
      '[data-marquee-group="primary"]',
    ) as HTMLElement;

    expect(getByTestId("partner-grid")).toHaveAttribute("data-layout", "marquee");
    expect(within(primary).getByText("Logo 1")).toBeInTheDocument();
    expect(within(primary).getByText("Logo 8")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("uses a static primary grid and hides the duplicate for reduced motion", () => {
    const root = postcss.parse(globalsCss);
    let basePrimaryDeclarations = "";
    let baseDuplicateDeclarations = "";
    let desktopPrimaryDeclarations = "";

    root.walkAtRules("media", (mediaRule) => {
      const isBaseReducedMotion = mediaRule.params === "(prefers-reduced-motion: reduce)";
      const isDesktopReducedMotion =
        mediaRule.params === "(prefers-reduced-motion: reduce) and (min-width: 768px)";
      if (!isBaseReducedMotion && !isDesktopReducedMotion) return;

      mediaRule.walkRules((rule) => {
        const declarations = rule.nodes.map((node) => node.toString()).join(";");
        if (rule.selector === ".partner-primary" && isBaseReducedMotion) {
          basePrimaryDeclarations += declarations;
        }
        if (rule.selector === ".partner-duplicate" && isBaseReducedMotion) {
          baseDuplicateDeclarations += declarations;
        }
        if (rule.selector === ".partner-primary" && isDesktopReducedMotion) {
          desktopPrimaryDeclarations += declarations;
        }
      });
    });

    expect(basePrimaryDeclarations).toContain("display: grid");
    expect(basePrimaryDeclarations).toContain("grid-template-columns: repeat(2, minmax(0, 1fr))");
    expect(baseDuplicateDeclarations).toContain("display: none");
    expect(desktopPrimaryDeclarations).toContain(
      "grid-template-columns: repeat(4, minmax(0, 1fr))",
    );
  });

  it("resolves manifest-backed partner media inside the marquee", () => {
    const manifest = Object.fromEntries(
      Array.from({ length: 5 }, (_, index) => {
        const id = `resolved-${index}`;
        return [
          id,
          {
            id,
            kind: "image" as const,
            aspectRatio: "aspect-[3/2]",
            alt: `Resolved ${index}`,
            src: `/resolved-${index}.svg`,
          },
        ];
      }),
    ) satisfies MediaManifest;
    const resolvedPartners: Partner[] = Object.keys(manifest).map((mediaRef, index) => ({
      id: `resolved-partner-${index}`,
      name: `Resolved ${index}`,
      mediaRef,
    }));

    const rendered = render(<PartnerGrid partners={resolvedPartners} manifest={manifest} />);

    expect(rendered.getByTestId("partner-grid")).toHaveAttribute("data-layout", "marquee");
    expect(rendered.getAllByRole("img")).toHaveLength(5);
  });

  it("keeps mixed sourced and source-less records in the marquee", () => {
    const fourReal = render(<PartnerGrid partners={mixedPartners(4)} />);
    expect(fourReal.getByTestId("partner-grid")).toHaveAttribute("data-layout", "marquee");
    fourReal.unmount();

    expect(
      render(<PartnerGrid partners={mixedPartners(5)} />).getByTestId("partner-grid"),
    ).toHaveAttribute("data-layout", "marquee");
  });

  it("uses equal loop groups and removes duplicate links from the keyboard order", () => {
    const linkedPartners = partners(5).map((partner) => ({
      ...partner,
      url: `https://example.com/${partner.id}`,
    }));
    const { container, getByTestId } = render(<PartnerGrid partners={linkedPartners} />);

    expect(getByTestId("partner-grid")).toHaveAttribute("data-layout", "marquee");
    const groups = container.querySelectorAll("[data-marquee-group]");
    expect(groups).toHaveLength(2);
    expect(groups[0]).toHaveAttribute("data-marquee-group", "primary");
    expect(groups[1]).toHaveAttribute("data-marquee-group", "duplicate");
    expect(groups[0]).toHaveClass("shrink-0", "gap-4", "pr-4");
    expect(groups[1]).toHaveClass("shrink-0", "gap-4", "pr-4");
    expect(groups[0].children).toHaveLength(5);
    expect(groups[1].children).toHaveLength(5);
    expect(groups[1]).toHaveAttribute("aria-hidden", "true");
    for (const link of groups[1].querySelectorAll("a")) {
      expect(link).toHaveAttribute("tabindex", "-1");
    }
  });

  it("pauses the marquee contract for hover and keyboard focus", async () => {
    const user = userEvent.setup();
    const linkedPartners = partners(5).map((partner) => ({
      ...partner,
      url: `https://example.com/${partner.id}`,
    }));
    const { getAllByRole, getByTestId } = render(<PartnerGrid partners={linkedPartners} />);
    const marquee = getByTestId("partner-grid");
    const track = marquee.firstElementChild;

    expect(marquee).toHaveAttribute("data-reduced-motion-layout", "static");
    expect(marquee).toHaveClass("partner-marquee");
    expect(track).toHaveClass(
      "partner-track",
      "group-hover:[animation-play-state:paused]",
      "group-focus-within:[animation-play-state:paused]",
    );

    await user.tab();
    expect(getAllByRole("link")[0]).toHaveFocus();
  });
});
