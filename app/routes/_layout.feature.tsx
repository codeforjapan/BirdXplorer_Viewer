/* eslint-disable react-refresh/only-export-components */
import { BaseCard } from "~/components/BaseCard/BaseCard";
import { FeatureIcon, PlayButtonIcon } from "~/components/icons";

import type { LayoutHandle } from "./_layout";
import type { Route } from "./+types/_layout.feature";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "特集 - BirdXplorer" },
    {
      name: "description",
      content: "BirdXplorerの特集ページ一覧",
    },
    {
      name: "robots",
      content: "noindex, nofollow",
    },
  ];
};

export const handle: LayoutHandle = {
  breadcrumb: [{ label: "TOP", href: "/" }, { label: "Feature" }],
  pageTitle: {
    icon: <FeatureIcon isActive />,
    title: "Feature",
    subtitle: "特集",
  },
};

type FeatureItem = {
  title: string;
  href: string;
};

type FeatureCategory = {
  title: string;
  color: string;
  items: FeatureItem[];
};

const featureCategories: FeatureCategory[] = [
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

export default function Feature() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
      {featureCategories.map((category) => (
        <BaseCard
          body={
            <ul className="space-y-2">
              {category.items.map((item) => (
                <li key={item.href}>
                  <a
                    className="text-heading-m-compact flex items-start gap-2 text-white hover:underline"
                    href={item.href}
                  >
                    <PlayButtonIcon className="shrink-0" isActive />
                    <span>{item.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          }
          key={category.title}
          title={<span className="text-white">{category.title}</span>}
          titleBgColor={category.color}
        />
      ))}
    </div>
  );
}
