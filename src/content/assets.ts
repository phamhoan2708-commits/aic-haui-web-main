import type { MediaManifest, MediaManifestRecord, MediaRef } from "./types";

const portraitRefs = [
  "person-le-thi-hoai-an",
  "person-dang-trong-hop",
  "person-nguyen-manh-cuong",
  "person-luong-thi-hong-lan",
  "person-pham-van-ha",
  "person-do-manh-hung",
  "person-dong-hung",
  "person-nha",
  "person-nien",
  "person-long-nhat",
  "person-bao",
  "person-quan",
] as const;

const researchGroupRefs = [
  "research-group-computer-vision-lab",
  "research-group-nlp-lab",
  "research-group-robotics-lab",
  "research-group-data-science-lab",
  "research-group-applied-ai-lab",
  "research-group-iot-ai-lab",
  "research-group-ai-ethics-lab",
] as const;

const officialPeopleAssets = {
  "person-le-thi-hoai-an": "/media/official/people/le-thi-hoai-an.webp",
  "person-dang-trong-hop": "/media/official/people/dang-trong-hop.webp",
  "person-nguyen-manh-cuong": "/media/official/people/nguyen-manh-cuong.webp",
  "person-luong-thi-hong-lan": "/media/official/people/luong-thi-hong-lan.webp",
  "person-pham-van-ha": "/media/official/people/pham-van-ha.webp",
  "person-do-manh-hung": "/media/official/people/do-manh-hung.webp",
} as const;

function imageSlot(id: string, aspectRatio = "aspect-[4/3]"): MediaManifestRecord {
  return { id, kind: "image", aspectRatio, alt: "" };
}

export const mediaManifest = {
  "brand.aic.logo": {
    id: "brand.aic.logo",
    kind: "image",
    aspectRatio: "aspect-square",
    src: "/media/official/aic-logo.jpg",
    alt: "Logo AIC",
  },
  "home.hero": {
    id: "home.hero",
    kind: "video",
    aspectRatio: "aspect-video",
    src: "/media/hero-video.webm",
    alt: "",
  },
  "about.intro-video": {
    id: "about.intro-video",
    kind: "video",
    aspectRatio: "aspect-video",
    alt: "",
  },
  ...Object.fromEntries(portraitRefs.map((id) => [id, imageSlot(id, "aspect-[4/5]")])),
  ...Object.fromEntries(
    Object.entries(officialPeopleAssets).map(([id, src]) => [
      id,
      { ...imageSlot(id, "aspect-square"), src, alt: "Ảnh chân dung thành viên AIC" },
    ]),
  ),
  "research-computer-vision": {
    ...imageSlot("research-computer-vision"),
    src: "/media/research/computer-vision.webp",
    alt: "Hệ thống thị giác máy tính nhận diện phương tiện và người đi bộ",
  },
  "research-natural-language": {
    ...imageSlot("research-natural-language"),
    src: "/media/research/natural-language-processing.webp",
    alt: "Minh họa xử lý ngôn ngữ tự nhiên đa ngôn ngữ",
  },
  "research-robotics": {
    ...imageSlot("research-robotics"),
    src: "/media/research/robotics-automation.webp",
    alt: "Cánh tay robot tự động hóa trong môi trường công nghiệp",
  },
  ...Object.fromEntries(researchGroupRefs.map((id) => [id, imageSlot(id)])),
  "students.foundry": {
    ...imageSlot("students.foundry"),
    src: "/media/students/aic-foundry-lab.webp",
    alt: "AIC Foundry Lab với chip AI và các mô hình học máy",
  },
  "students.innovation": {
    ...imageSlot("students.innovation"),
    src: "/media/students/aic-innovation-lab.webp",
    alt: "AIC Innovation Lab với ý tưởng và công nghệ AI",
  },
  "cooperation.hero": imageSlot("cooperation.hero"),
  "students.hero": imageSlot("students.hero"),
  ...Object.fromEntries(
    Array.from({ length: 8 }, (_, index) => {
      const id = `partner.logo-${index + 1}`;
      return [id, imageSlot(id, "aspect-[3/2]")];
    }),
  ),
  "contact.map": {
    id: "contact.map",
    kind: "map",
    aspectRatio: "aspect-video",
    alt: "Bản đồ Trường Đại học Công nghiệp Hà Nội",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4198.604558332043!2d105.73253187574224!3d21.053730980601824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345457e292d5bf%3A0x20ac91c94d74439a!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2hp4buHcCBIw6AgTuG7mWk!5e1!3m2!1svi!2s!4v1784371246244!5m2!1svi!2s",
  },
} satisfies MediaManifest;

export function resolveMedia(
  mediaRef: MediaRef,
  manifest: MediaManifest = mediaManifest,
): MediaManifestRecord | undefined {
  return manifest[mediaRef];
}

export type { MediaManifest } from "./types";

export const officialAssets = {
  logo: {
    src: mediaManifest["brand.aic.logo"].src,
    alt: mediaManifest["brand.aic.logo"].alt,
  },
} as const;
