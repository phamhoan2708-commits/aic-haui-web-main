import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { siteContent } from "../content/site";
import { ContactPage } from "./ContactPage";
import { LanguageProvider } from "../contexts/LanguageProvider";
import { LanguageSwitcher } from "../components/navigation/LanguageSwitcher";
import { labelsEn, labelsVi } from "../content/labels";

describe("ContactPage", () => {
  it("renders the current three contact cards and embedded map without a form", () => {
    const { container } = render(<ContactPage />, {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: siteContent.pages.contact.title,
      }),
    ).toBeInTheDocument();
    expect(container.querySelectorAll("[data-contact-card]")).toHaveLength(3);
    for (const item of siteContent.contact.items) {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    }
    expect(screen.getByTitle(labelsVi.contactSectionLabels.mapTitle)).toHaveAttribute(
      "src",
      siteContent.contact.mapUrl,
    );
    expect(container.querySelector("form")).not.toBeInTheDocument();
  });

  it("uses an explicitly injected approved map URL", () => {
    const mapUrl = "https://maps.example.test/embed/aic";
    const content = {
      ...siteContent,
      contact: { ...siteContent.contact, mapUrl },
    };
    render(<ContactPage content={content} />, {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    expect(screen.getByTitle(labelsVi.contactSectionLabels.mapTitle)).toHaveAttribute(
      "src",
      mapUrl,
    );
  });

  it("localizes the contact map title when the language changes", async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <LanguageSwitcher overlay={false} />
        <MemoryRouter>
          <ContactPage />
        </MemoryRouter>
      </LanguageProvider>,
    );

    expect(screen.getByTitle(labelsVi.contactSectionLabels.mapTitle)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Tiếng Anh" }));
    expect(screen.getByTitle(labelsEn.contactSectionLabels.mapTitle)).toBeInTheDocument();
  });
});
