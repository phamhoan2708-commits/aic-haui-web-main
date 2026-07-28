import type { StitchContent } from "./stitch";

export const stitchContentEn: StitchContent = {
  hero: {
    eyebrow: "AIC · HaUI · SICT",
    title: "Artificial Intelligence Research and Application Center",
    description:
      "Innovating and taking off in the digital era. Fostering human-centric AI research at HaUI.",
    primaryCta: "Explore Research",
    secondaryCta: "Join a Lab",
    mediaRef: "home.hero",
  },
  pages: {
    about: {
      title: "About Us",
      description:
        "Discover the vision, mission, and development direction of the Artificial Intelligence Research and Application Center.",
    },
    organization: {
      title: "Organization",
      description:
        "The research center is organized into a Board of Directors, a Scientific & Advisory Council, and research Labs.",
    },
    research: {
      title: "Scientific Research",
      description:
        "Explore cutting-edge research directions and breakthrough achievements at the Artificial Intelligence Research and Application Center (AIC), contributing to the development of AI technology in Vietnam and globally.",
    },
    cooperation: {
      title: "Expanding Boundaries with AI",
      description:
        "AIC builds a multi-disciplinary strategic partnership network, connecting academic research with practical applications, fostering innovation in artificial intelligence.",
      mediaRef: "cooperation.hero",
    },
    students: {
      title: "Nurturing AI Talents",
      description:
        "A professional research environment for excellent students, where breakthrough ideas take flight with resources and dedicated guidance from leading experts.",
      mediaRef: "students.hero",
    },
    contact: {
      title: "Contact",
      description:
        "The Artificial Intelligence Research and Application Center (AIC) is always ready to connect, cooperate, and share in-depth research spaces.",
    },
  },
  people: [
    {
      id: "le-thi-hoai-an",
      name: "Prof. Dr. Le Thi Hoai An",
      role: "Scientific Director",
      group: "director",
      email: "lethihoaian@gmail.com",
      mediaRef: "person-le-thi-hoai-an",
      source: "stitch",
    },
    {
      id: "dang-trong-hop",
      name: "Dr. Dang Trong Hop",
      role: "Executive Director",
      group: "director",
      email: "dangtronghop@gmail.com",
      mediaRef: "person-dang-trong-hop",
      source: "stitch",
    },
    {
      id: "nguyen-manh-cuong",
      name: "Dr. Nguyen Manh Cuong",
      role: "Vice Director — Head of the Data Science and Big Data Research Lab",
      group: "director",
      email: "manhcuong.nguyen@haui.edu.vn",
      mediaRef: "person-nguyen-manh-cuong",
      source: "stitch",
    },
    {
      id: "luong-thi-hong-lan",
      name: "Dr. Luong Thi Hong Lan",
      role: "Head of the Applied Mathematics and Optimization Research Lab",
      group: "teacher-lab",
      email: "lanhbk@haui.edu.vn",
      tags: ["Applied Mathematics", "Optimization"],
      mediaRef: "person-luong-thi-hong-lan",
      source: "stitch",
    },
    {
      id: "pham-van-ha",
      name: "Dr. Pham Van Ha",
      role: "Head of the Control and Automation Research Lab",
      group: "teacher-lab",
      email: "phamvanha@gmail.com",
      tags: ["Control", "Automation"],
      mediaRef: "person-pham-van-ha",
      source: "stitch",
    },
    {
      id: "do-manh-hung",
      name: "Dr. Do Manh Hung",
      role: "Head of the Educational Technology Research Lab",
      group: "teacher-lab",
      email: "hungdm_cntt@haui.edu.vn",
      tags: ["Educational Technology"],
      mediaRef: "person-do-manh-hung",
      source: "stitch",
    },
    {
      id: "dong-hung",
      name: "Dong Hung",
      role: "NLP Lab Leader",
      group: "student-leader",
      mediaRef: "person-dong-hung",
      source: "stitch",
    },
    {
      id: "nha",
      name: "Nha",
      role: "CV Lab Leader",
      group: "student-leader",
      mediaRef: "person-nha",
      source: "stitch",
    },
    {
      id: "nien",
      name: "Nien",
      role: "Robotics Leader",
      group: "student-leader",
      mediaRef: "person-nien",
      source: "stitch",
    },
    {
      id: "long-nhat",
      name: "Long Nhat",
      role: "Data Science",
      group: "student-leader",
      mediaRef: "person-long-nhat",
      source: "stitch",
    },
    {
      id: "bao",
      name: "Bao",
      role: "AI Ethics",
      group: "student-leader",
      mediaRef: "person-bao",
      source: "stitch",
    },
    {
      id: "quan",
      name: "Quan",
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
        name: "Prof. Dr. Pham Van A",
        role: "Council Chairman",
        affiliation: "HaUI",
        source: "stitch",
      },
      {
        id: "le-thi-b",
        name: "Assoc. Prof. Dr. Le Thi B",
        role: "Permanent Member",
        affiliation: "VNU",
        source: "stitch",
      },
      {
        id: "hoang-van-c",
        name: "Dr. Hoang Van C",
        role: "Member",
        affiliation: "Industry",
        source: "stitch",
      },
    ],
    directions: [
      {
        id: "computer-vision",
        title: "Computer Vision",
        description:
          "Researching deep learning algorithms and models to understand and process images, videos, with applications in facial recognition, and autonomous driving.",
        mediaRef: "research-computer-vision",
        source: "stitch",
      },
      {
        id: "natural-language-processing",
        title: "Natural Language Processing",
        description:
          "Developing AI systems capable of understanding, translating, and generating human language, focusing on Vietnamese and diverse languages.",
        mediaRef: "research-natural-language",
        source: "stitch",
      },
      {
        id: "robotics-automation",
        title: "Robotics & Automation",
        description:
          "Integrating AI into robotic systems to enhance autonomy, learning, and safe interaction with the environment in industry and daily life.",
        mediaRef: "research-robotics",
        source: "stitch",
      },
    ],
    metrics: [
      { id: "international-papers", value: "50+", label: "INTERNATIONAL PAPERS", source: "stitch" },
      { id: "state-projects", value: "15", label: "STATE-LEVEL PROJECTS", source: "stitch" },
      { id: "transferred-products", value: "12", label: "TRANSFERRED PRODUCTS", source: "stitch" },
      { id: "research-groups", value: "07", label: "RESEARCH GROUPS", source: "stitch" },
    ],
    groups: [
      {
        id: "computer-vision-lab",
        title: "Computer Vision Lab",
        description:
          "In-depth research on video analysis, action recognition, and smart healthcare using computer vision. The group focuses on solving highly applicable problems in Vietnam.",
        tags: ["Deep Learning", "Medical AI", "Video Analysis"],
        leader: "Assoc. Prof. Dr. Nguyen Van A",
        source: "stitch",
      },
      {
        id: "nlp-lab",
        title: "NLP Lab",
        description:
          "Natural language processing, focusing on large language models (LLMs) for Vietnamese.",
        memberCount: 6,
        source: "stitch",
      },
      {
        id: "robotics-lab",
        title: "Robotics Lab",
        description:
          "Autonomous robot control, embedded systems, and AI for peripheral devices (Edge AI).",
        memberCount: 8,
        source: "stitch",
      },
      {
        id: "data-science-lab",
        title: "Data Science Lab",
        description:
          "Big data mining, predictive analytics, and applied machine learning in economics and healthcare.",
        memberCount: 5,
        source: "stitch",
      },
      {
        id: "applied-ai-lab",
        title: "Applied AI Lab",
        description:
          "Researching the application of AI to solve practical problems for businesses and society.",
        source: "stitch",
      },
      {
        id: "iot-ai-lab",
        title: "IoT & AI Lab",
        description: "Internet of Things, smart sensors, and real-time data analysis.",
        memberCount: 4,
        source: "stitch",
      },
      {
        id: "ai-ethics-lab",
        title: "AI Ethics Lab",
        description:
          "Researching transparency, fairness, and ethics in Artificial Intelligence systems.",
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
        title: "Enterprise",
        description:
          "Consulting and providing specialized AI solutions, optimizing operational processes, and enhancing core competitiveness for businesses.",
        source: "stitch",
      },
    ],
    research: [
      {
        id: "research",
        title: "Research",
        description:
          "Coordinating the implementation of in-depth scientific research projects, publishing high-quality academic works in prestigious forums.",
        source: "stitch",
      },
    ],
    technologyTransfer: [
      {
        id: "technology-transfer",
        title: "Technology Transfer",
        description:
          "Commercializing research products, bringing AI technology from the lab into practical applications to solve real-world problems.",
        source: "stitch",
      },
    ],
    international: [
      {
        id: "international",
        title: "International Cooperation",
        description:
          "Expanding relations with leading research institutes, universities, and technology organizations worldwide, exchanging experts, and promoting multinational AI projects.",
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
          "Focuses on foundational research, building core machine learning models and advanced artificial intelligence algorithms. The place for students passionate about mathematics and machine learning theory.",
        benefits: [
          "High-performance computing infrastructure",
          "Direct guidance from research experts",
        ],
        mediaRef: "students.foundry",
        source: "stitch",
      },
      {
        id: "innovation",
        name: "AIC Innovation Lab",
        positioning:
          "Geared towards practical applications, technology transfer, and developing AI products to solve real-world problems. A creative startup environment right in the heart of the center.",
        benefits: [
          "Real-world projects with corporate partners",
          "Agile teamwork skill development",
        ],
        mediaRef: "students.innovation",
        source: "stitch",
      },
    ],
    joinSteps: [
      {
        id: "discover",
        title: "Discover",
        description: "Learn about research directions and project requirements.",
        source: "stitch",
      },
      {
        id: "apply",
        title: "Apply",
        description: "Submit online application with latest CV and transcript.",
        source: "stitch",
      },
      {
        id: "interview",
        title: "Interview",
        description: "Professional exchange with principal researchers.",
        source: "stitch",
      },
      {
        id: "onboard",
        title: "Onboard",
        description: "Complete procedures and participate in onboarding.",
        source: "stitch",
      },
      {
        id: "project",
        title: "Project",
        description: "Begin contributing to real-world research projects.",
        source: "stitch",
      },
    ],
  },
  footer: {
    description:
      "Artificial Intelligence Research and Application Center - Where knowledge and innovation connect.",
    copyright:
      "© 2024 AIC - Artificial Intelligence Research and Application Center. All rights reserved.",
  },
};
