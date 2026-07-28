import type {
  CooperationItem,
  CouncilMember,
  JoinStep,
  Lab,
  Metric,
  Partner,
  Person,
  ResearchItem,
  SiteContent,
} from "./types";

type StitchRecord<T> = Omit<T, "source"> & { source: "stitch" };
type StitchPerson = StitchRecord<Person>;
type StitchResearchItem = StitchRecord<ResearchItem>;
type StitchMetric = StitchRecord<Metric>;
type StitchCouncilMember = StitchRecord<CouncilMember>;
type StitchCooperationItem = StitchRecord<CooperationItem>;
type StitchPartner = StitchRecord<Partner>;
type StitchLab = StitchRecord<Lab>;
type StitchJoinStep = StitchRecord<JoinStep>;

export type StitchContent = {
  hero: SiteContent["hero"];
  pages: SiteContent["pages"];
  people: StitchPerson[];
  research: {
    directions: StitchResearchItem[];
    metrics: StitchMetric[];
    council: StitchCouncilMember[];
    results: StitchResearchItem[];
    groups: StitchResearchItem[];
    activities: StitchResearchItem[];
  };
  cooperation: {
    enterprise: StitchCooperationItem[];
    research: StitchCooperationItem[];
    international: StitchCooperationItem[];
    technologyTransfer: StitchCooperationItem[];
    partners: StitchPartner[];
  };
  students: {
    labs: StitchLab[];
    joinSteps: StitchJoinStep[];
  };
  contact?: Pick<SiteContent["contact"], "email" | "mapUrl">;
  footer: SiteContent["footer"];
};

export const stitchContent = {
  hero: {
    eyebrow: "AIC · HaUI · SICT",
    title: "Trung tâm Nghiên cứu và Ứng dụng Trí tuệ Nhân tạo",
    description:
      "Sáng tạo, cất cánh trong kỷ nguyên số. Thúc đẩy nghiên cứu AI lấy con người làm trung tâm tại HaUI.",
    primaryCta: "Khám phá Nghiên cứu",
    secondaryCta: "Tham gia Lab",
    mediaRef: "home.hero",
  },
  pages: {
    about: {
      title: "Về chúng tôi",
      description:
        "Khám phá tầm nhìn, sứ mệnh và định hướng phát triển của Trung tâm Nghiên cứu và Ứng dụng Trí tuệ Nhân tạo.",
    },
    organization: {
      title: "Tổ chức",
      description:
        "Trung tâm nghiên cứu có cơ cấu tổ chức gồm: Ban giám đốc, Hội đồng khoa học & tư vấn, cùng các Lab nghiên cứu.",
    },
    research: {
      title: "Nghiên cứu khoa học",
      description:
        "Khám phá các hướng nghiên cứu mũi nhọn và thành tựu đột phá tại Trung tâm Nghiên cứu và Ứng dụng Trí tuệ Nhân tạo (AIC), góp phần thúc đẩy sự phát triển của công nghệ AI tại Việt Nam và trên thế giới.",
    },
    cooperation: {
      title: "Mở rộng giới hạn cùng AI",
      description:
        "AIC xây dựng mạng lưới đối tác chiến lược đa ngành, kết nối nghiên cứu học thuật với ứng dụng thực tiễn, thúc đẩy đổi mới sáng tạo trong công nghệ trí tuệ nhân tạo.",
      mediaRef: "cooperation.hero",
    },
    students: {
      title: "Ươm mầm tài năng AI",
      description:
        "Môi trường nghiên cứu chuyên nghiệp dành cho sinh viên xuất sắc, nơi những ý tưởng đột phá được chắp cánh bằng nguồn lực và sự hướng dẫn tận tình từ các chuyên gia hàng đầu.",
      mediaRef: "students.hero",
    },
    contact: {
      title: "Liên hệ",
      description:
        "Trung tâm Nghiên cứu và Ứng dụng Trí tuệ Nhân tạo (AIC) luôn sẵn sàng kết nối, hợp tác và chia sẻ không gian nghiên cứu chuyên sâu.",
    },
  },
  people: [
    {
      id: "le-thi-hoai-an",
      name: "GS. TSKH. Lê Thị Hoài An",
      role: "Giám đốc Khoa học",
      group: "director",
      email: "lethihoaian@gmail.com",
      mediaRef: "person-le-thi-hoai-an",
      source: "stitch",
    },
    {
      id: "dang-trong-hop",
      name: "TS. Đặng Trọng Hợp",
      role: "Giám đốc Điều hành",
      group: "director",
      email: "dangtronghop@gmail.com",
      mediaRef: "person-dang-trong-hop",
      source: "stitch",
    },
    {
      id: "nguyen-manh-cuong",
      name: "TS. Nguyễn Mạnh Cường",
      role: "Phó giám đốc - Trưởng Lab nghiên cứu Khoa học dữ liệu và dữ liệu lớn",
      group: "director",
      email: "manhcuong.nguyen@haui.edu.vn",
      mediaRef: "person-nguyen-manh-cuong",
      source: "stitch",
    },
    {
      id: "luong-thi-hong-lan",
      name: "TS. Lương Thị Hồng Lan",
      role: "Trưởng Lab nghiên cứu Toán ứng dụng và tối ưu hóa",
      group: "teacher-lab",
      email: "lanhbk@haui.edu.vn",
      tags: ["Toán ứng dụng", "Tối ưu hóa"],
      mediaRef: "person-luong-thi-hong-lan",
      source: "stitch",
    },
    {
      id: "pham-van-ha",
      name: "TS. Phạm Văn Hà",
      role: "Trưởng Lab nghiên cứu Điều khiển và tự động hóa",
      group: "teacher-lab",
      email: "phamvanha@gmail.com",
      tags: ["Điều khiển", "Tự động hóa"],
      mediaRef: "person-pham-van-ha",
      source: "stitch",
    },
    {
      id: "do-manh-hung",
      name: "TS. Đỗ Mạnh Hùng",
      role: "Trưởng Lab nghiên cứu Công nghệ giáo dục",
      group: "teacher-lab",
      email: "hungdm_cntt@haui.edu.vn",
      tags: ["Công nghệ giáo dục"],
      mediaRef: "person-do-manh-hung",
      source: "stitch",
    },
    {
      id: "dong-hung",
      name: "Đông Hưng",
      role: "Leader NLP Lab",
      group: "student-leader",
      mediaRef: "person-dong-hung",
      source: "stitch",
    },
    {
      id: "nha",
      name: "Nhã",
      role: "Leader CV Lab",
      group: "student-leader",
      mediaRef: "person-nha",
      source: "stitch",
    },
    {
      id: "nien",
      name: "Niên",
      role: "Leader Robotics",
      group: "student-leader",
      mediaRef: "person-nien",
      source: "stitch",
    },
    {
      id: "long-nhat",
      name: "Long Nhật",
      role: "Data Science",
      group: "student-leader",
      mediaRef: "person-long-nhat",
      source: "stitch",
    },
    {
      id: "bao",
      name: "Bảo",
      role: "AI Ethics",
      group: "student-leader",
      mediaRef: "person-bao",
      source: "stitch",
    },
    {
      id: "quan",
      name: "Quân",
      role: "IoT Systems",
      group: "student-leader",
      mediaRef: "person-quan",
      source: "stitch",
    },
  ],
  research: {
    council: [
      {
        id: "pham-van-a",
        name: "GS.TS. Phạm Văn A",
        role: "Chủ tịch Hội đồng",
        affiliation: "HaUI",
        source: "stitch",
      },
      {
        id: "le-thi-b",
        name: "PGS.TS. Lê Thị B",
        role: "Ủy viên thường trực",
        affiliation: "VNU",
        source: "stitch",
      },
      {
        id: "hoang-van-c",
        name: "TS. Hoàng Văn C",
        role: "Ủy viên",
        affiliation: "Industry",
        source: "stitch",
      },
    ],
    directions: [
      {
        id: "computer-vision",
        title: "Thị giác máy tính",
        description:
          "Nghiên cứu các thuật toán và mô hình học sâu để hiểu và xử lý hình ảnh, video, ứng dụng trong nhận dạng khuôn mặt, xe tự lái.",
        mediaRef: "research-computer-vision",
        source: "stitch",
      },
      {
        id: "natural-language-processing",
        title: "Xử lý ngôn ngữ tự nhiên",
        description:
          "Phát triển các hệ thống AI có khả năng hiểu, dịch và tạo ngôn ngữ con người, tập trung vào tiếng Việt và các ngôn ngữ đa dạng.",
        mediaRef: "research-natural-language",
        source: "stitch",
      },
      {
        id: "robotics-automation",
        title: "Robotics & tự động hóa",
        description:
          "Tích hợp AI vào hệ thống robot để tăng cường khả năng tự chủ, học hỏi và tương tác an toàn với môi trường trong công nghiệp và đời sống.",
        mediaRef: "research-robotics",
        source: "stitch",
      },
    ],
    metrics: [
      { id: "international-papers", value: "50+", label: "BÀI BÁO QUỐC TẾ", source: "stitch" },
      { id: "state-projects", value: "15", label: "DỰ ÁN CẤP NHÀ NƯỚC", source: "stitch" },
      { id: "transferred-products", value: "12", label: "SẢN PHẨM CHUYỂN GIAO", source: "stitch" },
      { id: "research-groups", value: "07", label: "NHÓM NGHIÊN CỨU", source: "stitch" },
    ],
    groups: [
      {
        id: "computer-vision-lab",
        title: "Computer Vision Lab",
        description:
          "Nghiên cứu chuyên sâu về phân tích video, nhận dạng hành động và y tế thông minh sử dụng thị giác máy tính. Nhóm tập trung giải quyết các bài toán có tính ứng dụng cao tại Việt Nam.",
        tags: ["Deep Learning", "Medical AI", "Video Analysis"],
        leader: "PGS. TS. Nguyễn Văn A",
        source: "stitch",
      },
      {
        id: "nlp-lab",
        title: "NLP Lab",
        description:
          "Xử lý ngôn ngữ tự nhiên, tập trung vào mô hình ngôn ngữ lớn (LLMs) cho tiếng Việt.",
        memberCount: 6,
        source: "stitch",
      },
      {
        id: "robotics-lab",
        title: "Robotics Lab",
        description:
          "Điều khiển robot tự hành, hệ thống nhúng và AI cho thiết bị ngoại vi (Edge AI).",
        memberCount: 8,
        source: "stitch",
      },
      {
        id: "data-science-lab",
        title: "Data Science Lab",
        description:
          "Khai phá dữ liệu lớn, phân tích dự đoán và học máy ứng dụng trong kinh tế, y tế.",
        memberCount: 5,
        source: "stitch",
      },
      {
        id: "applied-ai-lab",
        title: "Applied AI Lab",
        description:
          "Nghiên cứu ứng dụng AI vào giải quyết các bài toán thực tế của doanh nghiệp và xã hội.",
        source: "stitch",
      },
      {
        id: "iot-ai-lab",
        title: "IoT & AI Lab",
        description: "Kết nối vạn vật, cảm biến thông minh và phân tích dữ liệu thời gian thực.",
        memberCount: 4,
        source: "stitch",
      },
      {
        id: "ai-ethics-lab",
        title: "AI Ethics Lab",
        description:
          "Nghiên cứu tính minh bạch, công bằng và đạo đức trong các hệ thống Trí tuệ Nhân tạo.",
        memberCount: 3,
        source: "stitch",
      },
    ],
    results: [],
    activities: [],
  },
  cooperation: {
    enterprise: [
      {
        id: "enterprise",
        title: "Doanh nghiệp",
        description:
          "Tư vấn và cung cấp các giải pháp AI chuyên biệt, tối ưu hóa quy trình vận hành và nâng cao năng lực cạnh tranh cốt lõi cho doanh nghiệp.",
        source: "stitch",
      },
    ],
    research: [
      {
        id: "research",
        title: "Nghiên cứu",
        description:
          "Phối hợp triển khai các dự án nghiên cứu khoa học chuyên sâu, công bố các công trình học thuật chất lượng cao trên các diễn đàn uy tín.",
        source: "stitch",
      },
    ],
    technologyTransfer: [
      {
        id: "technology-transfer",
        title: "Chuyển giao công nghệ",
        description:
          "Thương mại hóa các sản phẩm nghiên cứu, đưa công nghệ AI từ phòng thí nghiệm vào ứng dụng giải quyết các bài toán thực tiễn.",
        source: "stitch",
      },
    ],
    international: [
      {
        id: "international",
        title: "Hợp tác quốc tế",
        description:
          "Mở rộng quan hệ với các viện nghiên cứu, trường đại học và tổ chức công nghệ hàng đầu thế giới, trao đổi chuyên gia và thúc đẩy các dự án AI đa quốc gia.",
        source: "stitch",
      },
    ],
    partners: Array.from({ length: 8 }, (_, index) => ({
      id: `partner-${index + 1}`,
      name: `Logo ${index + 1}`,
      mediaRef: `partner.logo-${index + 1}`,
      source: "stitch",
    })),
  },
  students: {
    labs: [
      {
        id: "foundry",
        name: "AIC Foundry Lab",
        positioning:
          "Tập trung vào nghiên cứu nền tảng, xây dựng các mô hình học máy cốt lõi và thuật toán trí tuệ nhân tạo tiên tiến. Nơi dành cho những sinh viên đam mê toán học và lý thuyết máy học.",
        benefits: [
          "Cơ sở hạ tầng tính toán hiệu năng cao",
          "Hướng dẫn trực tiếp từ chuyên gia nghiên cứu",
        ],
        mediaRef: "students.foundry",
        source: "stitch",
      },
      {
        id: "innovation",
        name: "AIC Innovation Lab",
        positioning:
          "Hướng tới ứng dụng thực tiễn, chuyển giao công nghệ và phát triển các sản phẩm AI giải quyết các vấn đề thực tế. Môi trường khởi nghiệp sáng tạo ngay trong lòng trung tâm.",
        benefits: [
          "Dự án thực tế với đối tác doanh nghiệp",
          "Phát triển kỹ năng làm việc nhóm Agile",
        ],
        mediaRef: "students.innovation",
        source: "stitch",
      },
    ],
    joinSteps: [
      {
        id: "discover",
        title: "Khám phá",
        description: "Tìm hiểu về các định hướng nghiên cứu và yêu cầu dự án.",
        source: "stitch",
      },
      {
        id: "apply",
        title: "Ứng tuyển",
        description: "Nộp hồ sơ trực tuyến với CV và bảng điểm mới nhất.",
        source: "stitch",
      },
      {
        id: "interview",
        title: "Phỏng vấn",
        description: "Trao đổi chuyên môn với các nghiên cứu viên chính.",
        source: "stitch",
      },
      {
        id: "onboard",
        title: "Gia nhập",
        description: "Hoàn tất thủ tục và tham gia định hướng (onboarding).",
        source: "stitch",
      },
      {
        id: "project",
        title: "Dự án",
        description: "Bắt đầu đóng góp vào các dự án nghiên cứu thực tế.",
        source: "stitch",
      },
    ],
  },
  footer: {
    description:
      "Trung tâm Nghiên cứu và Ứng dụng Trí tuệ Nhân tạo - Nơi kết nối tri thức và đổi mới sáng tạo.",
    copyright:
      "© 2024 AIC - Artificial Intelligence Research and Application Center. All rights reserved.",
  },
} satisfies StitchContent;
