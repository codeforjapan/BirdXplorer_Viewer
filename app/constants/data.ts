import type { FeatureCategory } from "~/types/feature";

export const FEATURES: FeatureCategory[] = [
  {
    id: 1,
    category: "選挙特集",
    color: "bg-green",
    detail: {
      title: "2025年 参議院選挙",
      href: "/feature/2025/sangiin",
    },
  },
  {
    id: 2,
    category: "災害特集",
    color: "bg-blue",
    detail: {
      title: "2024年 能登半島地震 能登半島地震 能登半島地震",
      href: "/feature/2024/noto-earthquake",
    },
  },
  {
    id: 3,
    category: "道路特集",
    color: "bg-green",
    detail: {
      title: "2024年 兵庫県知事選挙",
      href: "/feature/2024/hyogo-governor",
    },
  },
  {
    id: 4,
    category: "その他",
    color: "bg-gray-2",
    detail: {
      title: "2024年 XXXXXXXXX",
      href: "/feature/2024/other",
    },
  },
];
