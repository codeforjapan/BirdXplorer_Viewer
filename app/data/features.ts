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
