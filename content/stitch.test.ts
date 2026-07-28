import { describe, expect, expectTypeOf, it, vi } from "vitest";

import { siteContent } from "./site";
import { stitchContent } from "./stitch";
import type { StitchContent } from "./stitch";
import { verifiedSiteContentVi } from "./verified";

function deepFreeze(value: unknown): void {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return;

  Object.freeze(value);
  Object.values(value).forEach(deepFreeze);
}

describe("Stitch prototype content", () => {
  it("keeps the approved demo record counts", () => {
    expect(stitchContent.people.filter((person) => person.group === "director")).toHaveLength(3);
    expect(stitchContent.research.council).toHaveLength(3);
    expect(stitchContent.people.filter((person) => person.group === "teacher-lab")).toHaveLength(3);
    expect(stitchContent.people.filter((person) => person.group === "student-leader")).toHaveLength(
      6,
    );
    expect(stitchContent.research.directions).toHaveLength(3);
    expect(stitchContent.research.metrics).toHaveLength(4);
    expect(stitchContent.research.groups).toHaveLength(7);
    expect(stitchContent.research.results).toEqual([]);
    expect(stitchContent.research.activities).toEqual([]);
    expect(stitchContent.cooperation.enterprise).toHaveLength(1);
    expect(stitchContent.cooperation.research).toHaveLength(1);
    expect(stitchContent.cooperation.international).toHaveLength(1);
    expect(stitchContent.cooperation.technologyTransfer).toHaveLength(1);
    expect(stitchContent.cooperation.partners).toHaveLength(8);
    expect(stitchContent.students.labs).toHaveLength(2);
    expect(stitchContent.students.joinSteps).toHaveLength(5);
  });

  it("keeps the current organization names, roles, emails, and media references", () => {
    expect(stitchContent.people.filter((person) => person.group === "director")).toEqual([
      expect.objectContaining({
        id: "le-thi-hoai-an",
        name: "GS. TSKH. Lê Thị Hoài An",
        role: "Giám đốc Khoa học",
        email: "lethihoaian@gmail.com",
        mediaRef: "person-le-thi-hoai-an",
      }),
      expect.objectContaining({
        id: "dang-trong-hop",
        name: "TS. Đặng Trọng Hợp",
        role: "Giám đốc Điều hành",
        email: "dangtronghop@gmail.com",
        mediaRef: "person-dang-trong-hop",
      }),
      expect.objectContaining({
        id: "nguyen-manh-cuong",
        name: "TS. Nguyễn Mạnh Cường",
        role: "Phó giám đốc - Trưởng Lab nghiên cứu Khoa học dữ liệu và dữ liệu lớn",
        email: "manhcuong.nguyen@haui.edu.vn",
        mediaRef: "person-nguyen-manh-cuong",
      }),
    ]);
    expect(
      stitchContent.people
        .filter((person) => person.group === "teacher-lab")
        .map(({ id, name, role }) => ({ id, name, role })),
    ).toEqual([
      {
        id: "luong-thi-hong-lan",
        name: "TS. Lương Thị Hồng Lan",
        role: "Trưởng Lab nghiên cứu Toán ứng dụng và tối ưu hóa",
      },
      {
        id: "pham-van-ha",
        name: "TS. Phạm Văn Hà",
        role: "Trưởng Lab nghiên cứu Điều khiển và tự động hóa",
      },
      {
        id: "do-manh-hung",
        name: "TS. Đỗ Mạnh Hùng",
        role: "Trưởng Lab nghiên cứu Công nghệ giáo dục",
      },
    ]);
    expect(
      stitchContent.people
        .filter((person) => person.group === "student-leader")
        .map(({ id, name, role }) => ({ id, name, role })),
    ).toEqual([
      { id: "dong-hung", name: "Đông Hưng", role: "Leader NLP Lab" },
      { id: "nha", name: "Nhã", role: "Leader CV Lab" },
      { id: "nien", name: "Niên", role: "Leader Robotics" },
      { id: "long-nhat", name: "Long Nhật", role: "Data Science" },
      { id: "bao", name: "Bảo", role: "AI Ethics" },
      { id: "quan", name: "Quân", role: "IoT Systems" },
    ]);
    expect(
      stitchContent.research.council.map(({ id, name, role }) => ({ id, name, role })),
    ).toEqual([
      { id: "pham-van-a", name: "GS.TS. Phạm Văn A", role: "Chủ tịch Hội đồng" },
      { id: "le-thi-b", name: "PGS.TS. Lê Thị B", role: "Ủy viên thường trực" },
      { id: "hoang-van-c", name: "TS. Hoàng Văn C", role: "Ủy viên" },
    ]);
  });

  it("keeps the current organization copy and excludes the discarded prototype label", () => {
    expect(stitchContent.pages.organization.description).toBe(
      "Trung tâm nghiên cứu có cơ cấu tổ chức gồm: Ban giám đốc, Hội đồng khoa học & tư vấn, cùng các Lab nghiên cứu.",
    );
    expect(stitchContent.pages.organization.description).not.toContain("AIC Center");
  });

  it("keeps the Stitch ordering and labels for research and student content", () => {
    expect(stitchContent.research.metrics.map(({ value, label }) => [value, label])).toEqual([
      ["50+", "BÀI BÁO QUỐC TẾ"],
      ["15", "DỰ ÁN CẤP NHÀ NƯỚC"],
      ["12", "SẢN PHẨM CHUYỂN GIAO"],
      ["07", "NHÓM NGHIÊN CỨU"],
    ]);
    expect(stitchContent.research.groups.map((group) => group.title)).toEqual([
      "Computer Vision Lab",
      "NLP Lab",
      "Robotics Lab",
      "Data Science Lab",
      "Applied AI Lab",
      "IoT & AI Lab",
      "AI Ethics Lab",
    ]);
    expect(stitchContent.students.joinSteps.map((step) => step.title)).toEqual([
      "Khám phá",
      "Ứng tuyển",
      "Phỏng vấn",
      "Gia nhập",
      "Dự án",
    ]);
    expect(siteContent.cooperation.partners.map((partner) => partner.name)).toEqual([
      "Logo 1",
      "Logo 2",
      "Logo 3",
      "Logo 4",
      "Logo 5",
      "Logo 6",
      "Logo 7",
      "Logo 8",
    ]);
  });

  it("marks every demo record as Stitch content", () => {
    const collections: Array<[string, readonly { source: "stitch" }[]]> = [
      ["people", stitchContent.people],
      ["council", stitchContent.research.council],
      ["directions", stitchContent.research.directions],
      ["metrics", stitchContent.research.metrics],
      ["results", stitchContent.research.results],
      ["groups", stitchContent.research.groups],
      ["activities", stitchContent.research.activities],
      ["enterprise cooperation", stitchContent.cooperation.enterprise],
      ["research cooperation", stitchContent.cooperation.research],
      ["international cooperation", stitchContent.cooperation.international],
      ["technology transfer", stitchContent.cooperation.technologyTransfer],
      ["partners", stitchContent.cooperation.partners],
      ["labs", stitchContent.students.labs],
      ["join steps", stitchContent.students.joinSteps],
    ];

    for (const [name, records] of collections) {
      expect(
        records.every((record) => record.source === "stitch"),
        name,
      ).toBe(true);
    }
  });

  it("requires the Stitch source literal in every Stitch-specific record type", () => {
    expectTypeOf<StitchContent["people"][number]["source"]>().toEqualTypeOf<"stitch">();
    expectTypeOf<
      StitchContent["research"]["directions"][number]["source"]
    >().toEqualTypeOf<"stitch">();
    expectTypeOf<
      StitchContent["cooperation"]["partners"][number]["source"]
    >().toEqualTypeOf<"stitch">();
    expectTypeOf<StitchContent["students"]["labs"][number]["source"]>().toEqualTypeOf<"stitch">();
  });

  it("composes verified core content with demo collections without mutating either source", () => {
    expect(siteContent.identity).toEqual(verifiedSiteContentVi.identity);
    expect(siteContent.about).toEqual(verifiedSiteContentVi.about);
    expect(siteContent.contact).toEqual(verifiedSiteContentVi.contact);
    expect(siteContent.people).toEqual(stitchContent.people);
    expect(siteContent.research.groups).toEqual(stitchContent.research.groups);
    expect(siteContent.students.labs.map((lab) => lab.name)).toEqual([
      "AIC Foundry Lab",
      "AIC Innovation Lab",
    ]);

    expect(siteContent).not.toBe(verifiedSiteContentVi);
    expect(siteContent.people).not.toBe(stitchContent.people);
    expect(siteContent.research).not.toBe(stitchContent.research);
    expect(siteContent.students).not.toBe(stitchContent.students);
  });

  it("does not mutate frozen source objects while composing runtime content", async () => {
    vi.resetModules();
    const [{ stitchContent: stitchSource }, { verifiedSiteContentVi: verifiedSource }] =
      await Promise.all([import("./stitch"), import("./verified")]);
    const stitchSnapshot = structuredClone(stitchSource);
    const verifiedSnapshot = structuredClone(verifiedSource);

    deepFreeze(stitchSource);
    deepFreeze(verifiedSource);
    await import("./site");

    expect(stitchSource).toEqual(stitchSnapshot);
    expect(verifiedSource).toEqual(verifiedSnapshot);
  });
});
