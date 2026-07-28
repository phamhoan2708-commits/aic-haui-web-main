import { describe, expect, it } from "vitest";

import { siteContent } from "./site";
import { stitchContent } from "./stitch";
import { verifiedSiteContentVi } from "./verified";

describe("verified AIC content", () => {
  it("publishes only the approved institutional content", () => {
    expect(siteContent.identity.shortName).toBe("AIC");
    expect(siteContent.about.intro).toContain("Trường Công nghệ Thông tin và Truyền thông");
    expect(siteContent.about.vision).toContain("kết nối các nhà khoa học");
    expect(siteContent.about.mission).toContain("kết nối nhà trường, doanh nghiệp và cộng đồng");
    expect(siteContent.contact.email).toBe("aic-sict@haui.edu.vn");
    expect(siteContent.contact.items.map((item) => item.id)).toEqual([
      "office",
      "laboratory",
      "email",
    ]);
  });

  it("keeps the verified source free of demo records", () => {
    expect(verifiedSiteContentVi.people).toEqual([]);
    expect(verifiedSiteContentVi.research.groups).toEqual([]);
    expect(verifiedSiteContentVi.cooperation.partners).toEqual([]);
    expect(verifiedSiteContentVi.students.joinSteps).toEqual([]);
  });

  it("composes source-labelled Stitch records while preserving verified lab names", () => {
    expect(siteContent.people).toEqual(stitchContent.people);
    expect(siteContent.research.groups).toEqual(stitchContent.research.groups);
    expect(siteContent.cooperation.partners).toEqual(stitchContent.cooperation.partners);
    expect(siteContent.students.joinSteps).toEqual(stitchContent.students.joinSteps);
    expect(siteContent.students.labs.map((lab) => lab.name)).toEqual([
      "AIC Foundry Lab",
      "AIC Innovation Lab",
    ]);
  });
});
