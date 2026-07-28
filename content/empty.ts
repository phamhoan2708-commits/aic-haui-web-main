import type { SiteContent } from "./types";

export const emptySiteContent: SiteContent = {
  identity: {
    shortName: "AIC",
    fullName: "Trung tâm Nghiên cứu và Ứng dụng Trí tuệ Nhân tạo",
  },
  hero: { title: "Trung tâm Nghiên cứu và Ứng dụng Trí tuệ Nhân tạo" },
  pages: {
    about: { title: "Về chúng tôi" },
    organization: { title: "Tổ chức" },
    research: { title: "Nghiên cứu" },
    cooperation: { title: "Hợp tác" },
    students: { title: "Dành cho sinh viên" },
    contact: { title: "Liên hệ" },
  },
  about: {},
  people: [],
  research: { directions: [], results: [], groups: [], activities: [] },
  cooperation: {
    enterprise: [],
    research: [],
    international: [],
    technologyTransfer: [],
    partners: [],
  },
  students: { labs: [], joinSteps: [] },
  contact: { items: [] },
  footer: {},
};
