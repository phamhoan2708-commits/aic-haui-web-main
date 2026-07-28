import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { LanguageSwitcher } from "../components/navigation/LanguageSwitcher";
import { LanguageProvider } from "./LanguageProvider";

afterEach(() => {
  document.documentElement.lang = "";
});

describe("LanguageProvider document language", () => {
  it("synchronizes the html language and restores the previous value on unmount", async () => {
    const user = userEvent.setup();
    document.documentElement.lang = "fr";
    const { unmount } = render(
      <LanguageProvider>
        <LanguageSwitcher overlay={false} />
      </LanguageProvider>,
    );

    expect(document.documentElement).toHaveAttribute("lang", "vi");
    expect(screen.getByRole("button", { name: "Tiếng Anh" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Tiếng Anh" }));

    expect(document.documentElement).toHaveAttribute("lang", "en");
    expect(screen.getByRole("button", { name: "Vietnamese language" })).toBeInTheDocument();

    unmount();
    expect(document.documentElement).toHaveAttribute("lang", "fr");
  });
});
