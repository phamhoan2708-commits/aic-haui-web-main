import { useLanguage } from "../contexts/language";

export type AboutSectionLabels = {
  homeHeading: string;
  introHeading: string;
  visionHeading: string;
  missionHeading: string;
  videoHeading: string;
  parentUnitHeading: string;
};

export type ResearchSectionLabels = {
  directions: string;
  groups: string;
  cooperationCta: string;
  membersSuffix: string;
};

const vi = {
  layoutLabels: {
    skipToContent: "Chuyển đến nội dung",
    mainNavigation: "Điều hướng chính",
    footerNavigation: "Điều hướng cuối trang",
    mobileNavigation: "Menu di động",
    openMenu: "Mở menu",
    closeMenu: "Đóng menu",
    languageSelection: "Chọn ngôn ngữ",
    vietnameseLanguage: "Tiếng Việt",
    englishLanguage: "Tiếng Anh",
  },
  heroLabels: {
    phrases: ["Thị giác máy tính", "Xử lý ngôn ngữ tự nhiên", "Robot học", "Khoa học dữ liệu"],
  },
  homeNewsLabels: {
    title: "Tin tức & sự kiện",
    description: "Cập nhật những hoạt động nghiên cứu, hội thảo và tin tức mới nhất từ trung tâm.",
    readMore: "Xem chi tiết",
    items: [
      {
        id: "1",
        date: "12 Th08, 2026",
        title: "AIC công bố 3 bài báo khoa học tại hội nghị quốc tế",
        category: "Nghiên cứu",
      },
      {
        id: "2",
        date: "05 Th08, 2026",
        title: "Tuyển sinh thành viên Gen mới tham gia các nhóm nghiên cứu",
        category: "Tuyển sinh",
      },
      {
        id: "3",
        date: "28 Th07, 2026",
        title: "Seminar: Ứng dụng AI trong Xử lý ngôn ngữ tự nhiên",
        category: "Sự kiện",
      },
    ],
  },
  personCardLabels: {
    biography: "Tiểu sử",
    portrait: (name: string) => `Ảnh chân dung ${name}`,
  },
  aboutSectionLabels: {
    homeHeading: "Về chúng tôi",
    introHeading: "Giới thiệu",
    visionHeading: "Tầm nhìn",
    missionHeading: "Sứ mệnh",
    videoHeading: "Video giới thiệu",
    parentUnitHeading: "Đơn vị trực thuộc",
    foundedDate: "Ngày thành lập: 12/05/2024",
  } satisfies AboutSectionLabels & { foundedDate: string },
  organizationSectionLabels: {
    directors: "Ban giám đốc",
    council: "Hội đồng khoa học",
    teacherLeaders: "Trưởng nhóm nghiên cứu (giảng viên)",
    studentLeaders: "Trưởng nhóm nghiên cứu (sinh viên)",
  },
  researchSectionLabels: {
    directions: "Định hướng nghiên cứu",
    groups: "Các nhóm nghiên cứu (Labs)",
    cooperationCta: "Đề xuất hợp tác nghiên cứu",
    membersSuffix: "thành viên",
  } satisfies ResearchSectionLabels,
  cooperationSectionLabels: {
    fields: "Lĩnh vực hợp tác",
    partners: "Đối tác chiến lược",
    heroCta: "Khám phá cơ hội",
    learnMore: "Tìm hiểu",
    closingTitle: "Cùng kiến tạo tương lai",
    closingDescription:
      "Trở thành đối tác của AIC để cùng nhau giải quyết những thách thức công nghệ phức tạp nhất và dẫn đầu xu hướng AI.",
    closingButton: "Hợp tác với AIC",
  },
  sharedCtaLabels: {
    cooperationContact: "Liên hệ hợp tác",
  },
  studentSectionLabels: {
    researchSpace: "Không gian nghiên cứu",
    researchSpaceDescription:
      "Khám phá các phòng thí nghiệm chuyên sâu được thiết kế để tối ưu hóa sự sáng tạo và năng suất nghiên cứu của sinh viên.",
    timeline: "Lộ trình tham gia",
    timelineDescription:
      "Quy trình tuyển chọn minh bạch và lộ trình phát triển rõ ràng dành cho nghiên cứu sinh thực tập.",
    heroCta: "Tham gia với chúng tôi",
    closingTitle: "Sẵn sàng kiến tạo tương lai AI?",
    closingButton: "Tham gia với chúng tôi",
  },
  contactSectionLabels: {
    heroTitle: "Liên hệ với chúng tôi",
    heroDescription:
      "Trung tâm Nghiên cứu và Ứng dụng Trí tuệ Nhân tạo (AIC) luôn sẵn sàng kết nối, hợp tác và chia sẻ không gian nghiên cứu chuyên sâu.",
    mapTitle: "Bản đồ vị trí AIC",
  },
  navigationLabels: {
    news: "Tin tức",
    about: "Về chúng tôi",
    organization: "Tổ chức",
    research: "Nghiên cứu",
    cooperation: "Hợp tác",
    students: "Dành cho sinh viên",
    contact: "Liên hệ",
  },
  footerLabels: {
    office: "Văn phòng",
    laboratory: "Phòng thí nghiệm",
    email: "Email",
    phone: "Điện thoại",
    followUs: "Theo dõi chúng tôi",
    copyright: "Bản quyền",
  },
};

const en = {
  layoutLabels: {
    skipToContent: "Skip to content",
    mainNavigation: "Main navigation",
    footerNavigation: "Footer navigation",
    mobileNavigation: "Mobile menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    languageSelection: "Language selection",
    vietnameseLanguage: "Vietnamese language",
    englishLanguage: "English language",
  },
  heroLabels: {
    phrases: ["Computer Vision", "Natural Language Processing", "Robotics", "Data Science"],
  },
  homeNewsLabels: {
    title: "News & Events",
    description: "Updates on research activities, seminars, and the latest news from the center.",
    readMore: "Read more",
    items: [
      {
        id: "1",
        date: "Aug 12, 2026",
        title: "AIC publishes 3 scientific papers at an international conference",
        category: "Research",
      },
      {
        id: "2",
        date: "Aug 05, 2026",
        title: "Recruiting new Gen members to join research groups",
        category: "Recruitment",
      },
      {
        id: "3",
        date: "Jul 28, 2026",
        title: "Seminar: AI Applications in Natural Language Processing",
        category: "Events",
      },
    ],
  },
  personCardLabels: {
    biography: "Biography",
    portrait: (name: string) => `Portrait of ${name}`,
  },
  aboutSectionLabels: {
    homeHeading: "About Us",
    introHeading: "Introduction",
    visionHeading: "Vision",
    missionHeading: "Mission",
    videoHeading: "Introduction Video",
    parentUnitHeading: "Parent Unit",
    foundedDate: "Founded: May 12, 2024",
  } satisfies AboutSectionLabels & { foundedDate: string },
  organizationSectionLabels: {
    directors: "Board of Directors",
    council: "Scientific Council",
    teacherLeaders: "Research Group Leaders (Lecturers)",
    studentLeaders: "Research Group Leaders (Students)",
  },
  researchSectionLabels: {
    directions: "Research Directions",
    groups: "Research Groups (Labs)",
    cooperationCta: "Propose research cooperation",
    membersSuffix: "members",
  } satisfies ResearchSectionLabels,
  cooperationSectionLabels: {
    fields: "Cooperation Fields",
    partners: "Strategic Partners",
    heroCta: "Explore opportunities",
    learnMore: "Learn more",
    closingTitle: "Co-creating the Future",
    closingDescription:
      "Become a partner of AIC to solve the most complex technology challenges together and lead the AI trend.",
    closingButton: "Partner with AIC",
  },
  sharedCtaLabels: {
    cooperationContact: "Contact for Cooperation",
  },
  studentSectionLabels: {
    researchSpace: "Research Space",
    researchSpaceDescription:
      "Explore specialized laboratories designed to optimize creativity and student research productivity.",
    timeline: "Participation Timeline",
    timelineDescription:
      "Transparent selection process and clear development roadmap for student researchers.",
    heroCta: "Join us",
    closingTitle: "Ready to shape the AI future?",
    closingButton: "Join us now",
  },
  contactSectionLabels: {
    heroTitle: "Contact Us",
    heroDescription:
      "The Artificial Intelligence Research and Application Center (AIC) is always ready to connect, cooperate, and share in-depth research spaces.",
    mapTitle: "Map of the AIC location",
  },
  navigationLabels: {
    news: "News",
    about: "About Us",
    organization: "Organization",
    research: "Research",
    cooperation: "Cooperation",
    students: "Students",
    contact: "Contact",
  },
  footerLabels: {
    office: "Office",
    laboratory: "Laboratory",
    email: "Email",
    phone: "Phone",
    followUs: "Follow us",
    copyright: "Copyright",
  },
};

export const labelsVi = vi;
export const labelsEn = en;

export type AccessibilityLabels = {
  mainNavigation: string;
  footerNavigation: string;
  mobileNavigation: string;
  openMenu: string;
  closeMenu: string;
  languageSelection: string;
  vietnameseLanguage: string;
  englishLanguage: string;
};

export type FooterLabels = {
  office: string;
  laboratory: string;
  email: string;
  phone: string;
  followUs: string;
  copyright: string;
};

// Backwards-compatible Vietnamese defaults for non-React consumers and tests.
export const aboutSectionLabels = vi.aboutSectionLabels;
export const organizationSectionLabels = vi.organizationSectionLabels;
export const researchSectionLabels = vi.researchSectionLabels;
export const cooperationSectionLabels = vi.cooperationSectionLabels;
export const sharedCtaLabels = vi.sharedCtaLabels;
export const studentSectionLabels = vi.studentSectionLabels;
export const contactSectionLabels = vi.contactSectionLabels;

export function useLabels() {
  const { language } = useLanguage();
  return language === "en" ? en : vi;
}

export function useAccessibilityLabels() {
  const { language } = useLanguage();
  return language === "en" ? en.layoutLabels : vi.layoutLabels;
}

export function useFooterLabels() {
  const { language } = useLanguage();
  return language === "en" ? en.footerLabels : vi.footerLabels;
}
