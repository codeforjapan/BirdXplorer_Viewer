export type FeatureItem = {
  title: string;
  href: string;
};

export type FeatureCategory = {
  title: string;
  color: string;
  items: FeatureItem[];
};

export const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    title: "選挙特集",
    color: "bg-green",
    items: [
      {
        title: "2025年 参議院選挙",
        href: "/feature/2025-sangiin",
      },
    ],
  },
  {
    title: "災害特集",
    color: "bg-blue",
    items: [
      {
        title: "2024年 能登半島地震 能登半島地震 能登半島地震",
        href: "/feature/2024-noto-earthquake",
      },
    ],
  },
  {
    title: "道路特集",
    color: "bg-green",
    items: [
      {
        title: "2024年 兵庫県知事選挙",
        href: "/feature/2024-hyogo-governor",
      },
    ],
  },
  {
    title: "その他",
    color: "bg-gray-2",
    items: [
      {
        title: "2024年 XXXXXXXXX",
        href: "/feature/2024-other",
      },
    ],
  },
];

type FeatureDetail = {
  title: string;
  href: string;
  description?: string;
};

export type Feature = {
  id: number;
  category: string;
  color: string;
  detail: FeatureDetail;
  startDate?: string;
  endDate?: string;
  kouchouAiPath?: string;
};

export const FEATURES: Feature[] = [
  {
    id: 1,
    category: "第51回 衆議院選挙 2026年",
    color: "bg-green",
    detail: {
      title: "衆議院選挙 2026年",
      href: "/feature/2026/shugiin",
      description:
        "高市政権の選挙戦略に関する意見が多様で、自民党内の候補者公認や選挙活動の透明性、政治的発言の信憑性が議論されています。また、報道の信頼性や透明性、国民民主党や自民党への批判、政治的発言の透明性、消費税政策の透明性向上が求められています。中道政治の実現や選挙における法令遵守、移民政策の公平性、衆議院選挙制度の理解促進、オンラインプラットフォームでの不正行為への警戒も重要なテーマとして浮上しています。",
    },
    startDate: "2026-01-19",
    endDate: "2026-02-14",
    kouchouAiPath: "/kouchou-ai/shugiin/96adb751-6703-4ee2-9fec-eef5326d8660/index.html",
  },
];
