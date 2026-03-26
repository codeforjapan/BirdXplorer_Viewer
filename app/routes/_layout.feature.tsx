/* eslint-disable react-refresh/only-export-components */
import { Outlet, useLocation } from "react-router";

import { BaseCard } from "~/components/BaseCard/BaseCard";
import { FeatureIcon, PlayButtonIcon } from "~/components/icons";
import { FEATURES } from "~/data/features";

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

export default function Feature() {
  const location = useLocation();
  const isIndexPage = location.pathname === "/feature";

  // 詳細ページの場合はOutletをレンダリング
  if (!isIndexPage) {
    return <Outlet />;
  }

  // 一覧ページの場合は既存のコンテンツを表示
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
      {FEATURES.map((feature) => (
        <BaseCard
          body={
            <ul className="space-y-2">
              <li>
                <a
                  className="text-heading-m-compact flex items-start gap-2 text-white hover:underline"
                  href={feature.detail.href}
                >
                  <PlayButtonIcon className="shrink-0" isActive />
                  <span>{feature.detail.title}</span>
                </a>
              </li>
            </ul>
          }
          key={feature.id}
          title={<span className="text-white">{feature.category}</span>}
          titleBgColor={feature.color}
        />
      ))}
    </div>
  );
}
