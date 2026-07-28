import { describe, expect, it } from "vitest";

import { labelsEn, labelsVi } from "./labels";
import { stitchContent } from "./stitch";
import { stitchContentEn } from "./stitchEn";

describe("heading capitalization contract", () => {
  it("uses sentence case for Vietnamese headings", () => {
    expect([
      labelsVi.homeNewsLabels.title,
      labelsVi.organizationSectionLabels.directors,
      labelsVi.organizationSectionLabels.council,
      labelsVi.organizationSectionLabels.teacherLeaders,
      labelsVi.organizationSectionLabels.studentLeaders,
      labelsVi.researchSectionLabels.directions,
      labelsVi.researchSectionLabels.groups,
      labelsVi.cooperationSectionLabels.fields,
      labelsVi.cooperationSectionLabels.partners,
      labelsVi.cooperationSectionLabels.closingTitle,
      labelsVi.studentSectionLabels.researchSpace,
      labelsVi.studentSectionLabels.timeline,
    ]).toEqual([
      "Tin tức & sự kiện",
      "Ban giám đốc",
      "Hội đồng khoa học",
      "Trưởng nhóm nghiên cứu (giảng viên)",
      "Trưởng nhóm nghiên cứu (sinh viên)",
      "Định hướng nghiên cứu",
      "Các nhóm nghiên cứu (Labs)",
      "Lĩnh vực hợp tác",
      "Đối tác chiến lược",
      "Cùng kiến tạo tương lai",
      "Không gian nghiên cứu",
      "Lộ trình tham gia",
    ]);

    expect(stitchContent.pages.cooperation.title).toBe("Mở rộng giới hạn cùng AI");
    expect(stitchContent.research.directions.map(({ title }) => title)).toEqual([
      "Thị giác máy tính",
      "Xử lý ngôn ngữ tự nhiên",
      "Robotics & tự động hóa",
    ]);
    expect(stitchContent.cooperation.international[0]?.title).toBe("Hợp tác quốc tế");
    expect(stitchContent.students.joinSteps.map(({ title }) => title)).toEqual([
      "Khám phá",
      "Ứng tuyển",
      "Phỏng vấn",
      "Gia nhập",
      "Dự án",
    ]);
  });

  it("preserves the official center name and English headings", () => {
    expect(stitchContent.hero.title).toBe("Trung tâm Nghiên cứu và Ứng dụng Trí tuệ Nhân tạo");
    expect(labelsEn.homeNewsLabels.title).toBe("News & Events");
    expect(labelsEn.cooperationSectionLabels.closingTitle).toBe("Co-creating the Future");
    expect(stitchContentEn.pages.cooperation.title).toBe("Expanding Boundaries with AI");
  });
});
