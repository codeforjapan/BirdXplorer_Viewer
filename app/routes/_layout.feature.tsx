/* eslint-disable react-refresh/only-export-components */
import { FeatureCategoryCard } from "~/components/feature-category-card/FeatureCategoryCard";
import { FeatureIcon } from "~/components/icons";
import { FEATURE_CATEGORIES } from "~/data/features";

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
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
      {FEATURE_CATEGORIES.map((category) => (
        <FeatureCategoryCard category={category} key={category.title} />
      ))}
    </div>
  );
}
