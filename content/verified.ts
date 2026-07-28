import type { SiteContent } from "./types";

const email = "aic-sict@haui.edu.vn";
const campusAddressVi =
  "Đại học Công nghiệp Hà Nội, số 298, Đường Cầu Diễn, Phường Tây Tựu, Thành phố Hà Nội.";

const campusAddressEn =
  "Hanoi University of Industry, 298 Cau Dien Street, Tay Tuu Ward, Hanoi City.";

export const verifiedSiteContentVi: SiteContent = {
  identity: {
    shortName: "AIC",
    fullName: "Trung tâm Nghiên cứu và Ứng dụng Trí tuệ Nhân tạo",
  },
  hero: {
    eyebrow: "AIC · HaUI · SICT",
    title: "Trung tâm Nghiên cứu và Ứng dụng Trí tuệ Nhân tạo",
    description:
      "Đơn vị trực thuộc Trường Công nghệ Thông tin và Truyền thông, Đại học Công nghiệp Hà Nội.",
    primaryCta: "Khám phá trung tâm",
    secondaryCta: "Dành cho sinh viên",
  },
  pages: {
    about: { title: "Về chúng tôi" },
    organization: { title: "Tổ chức" },
    research: { title: "Nghiên cứu" },
    cooperation: { title: "Hợp tác" },
    students: { title: "Dành cho sinh viên" },
    contact: { title: "Liên hệ" },
  },
  about: {
    intro:
      "Trung tâm Nghiên cứu và Ứng dụng Trí tuệ Nhân tạo là đơn vị trực thuộc Trường Công nghệ Thông tin và Truyền thông - Đại học Công nghiệp Hà Nội.",
    vision:
      "Trở thành đơn vị nghiên cứu mở, kết nối các nhà khoa học trong nước và quốc tế nhằm thúc đẩy nghiên cứu, đổi mới sáng tạo và ứng dụng Trí tuệ nhân tạo, Công nghệ thông tin.",
    mission:
      "Thúc đẩy nghiên cứu, đổi mới sáng tạo và ứng dụng Trí tuệ nhân tạo - Công nghệ thông tin; kết nối nhà trường, doanh nghiệp và cộng đồng để tạo ra các giải pháp có giá trị cho xã hội.",
    parentUnit: "Trường Công nghệ Thông tin và Truyền thông - Đại học Công nghiệp Hà Nội.",
  },
  people: [],
  research: { directions: [], results: [], groups: [], activities: [] },
  cooperation: {
    enterprise: [],
    research: [],
    international: [],
    technologyTransfer: [],
    partners: [],
    contactHref: `mailto:${email}`,
  },
  students: {
    labs: [
      { id: "foundry", name: "AIC Foundry Lab" },
      { id: "innovation", name: "AIC Innovation Lab" },
    ],
    joinSteps: [],
    contactHref: `mailto:${email}`,
  },
  contact: {
    email,
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.473788451502!2d105.73253187530172!3d21.053730980601816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345457e292d5bf%3A0x20ac91c94d74439a!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2hp4buHcCBIw6AgTuG7mWk!5e0!3m2!1svi!2s!4v1784200316092!5m2!1svi!2s",
    items: [
      {
        id: "office",
        label: "Văn phòng",
        primary: "Phòng 1201, Tòa nhà A1",
        secondary: campusAddressVi,
      },
      {
        id: "laboratory",
        label: "Phòng thí nghiệm",
        primary: "Phòng 1504, Tòa nhà A1",
        secondary: campusAddressVi,
      },
      { id: "email", label: "Email", primary: email, href: `mailto:${email}` },
    ],
  },
  footer: {},
};

export const verifiedSiteContentEn: SiteContent = {
  identity: {
    shortName: "AIC",
    fullName: "Artificial Intelligence Center",
  },
  hero: {
    eyebrow: "AIC · HaUI · SICT",
    title: "Artificial Intelligence Center",
    description:
      "A unit under the School of Information and Communication Technology, Hanoi University of Industry.",
    primaryCta: "Explore center",
    secondaryCta: "For students",
  },
  pages: {
    about: { title: "About us" },
    organization: { title: "Organization" },
    research: { title: "Research" },
    cooperation: { title: "Cooperation" },
    students: { title: "For students" },
    contact: { title: "Contact" },
  },
  about: {
    intro:
      "The Artificial Intelligence Center is a unit under the School of Information and Communication Technology - Hanoi University of Industry.",
    vision:
      "To become an open research unit, connecting domestic and international scientists to promote research, innovation and application of Artificial Intelligence and Information Technology.",
    mission:
      "Promoting research, innovation and application of Artificial Intelligence - Information Technology; connecting the university, enterprises and the community to create valuable solutions for society.",
    parentUnit:
      "School of Information and Communication Technology - Hanoi University of Industry.",
  },
  people: [],
  research: { directions: [], results: [], groups: [], activities: [] },
  cooperation: {
    enterprise: [],
    research: [],
    international: [],
    technologyTransfer: [],
    partners: [],
    contactHref: `mailto:${email}`,
  },
  students: {
    labs: [
      { id: "foundry", name: "AIC Foundry Lab" },
      { id: "innovation", name: "AIC Innovation Lab" },
    ],
    joinSteps: [],
    contactHref: `mailto:${email}`,
  },
  contact: {
    email,
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.473788451502!2d105.73253187530172!3d21.053730980601816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345457e292d5bf%3A0x20ac91c94d74439a!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2hp4buHcCBIw6AgTuG7mWk!5e0!3m2!1svi!2s!4v1784200316092!5m2!1svi!2s",
    items: [
      {
        id: "office",
        label: "Office",
        primary: "Room 1201, Building A1",
        secondary: campusAddressEn,
      },
      {
        id: "laboratory",
        label: "Laboratory",
        primary: "Room 1504, Building A1",
        secondary: campusAddressEn,
      },
      { id: "email", label: "Email", primary: email, href: `mailto:${email}` },
    ],
  },
  footer: {},
};
