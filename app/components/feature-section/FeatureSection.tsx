import { BaseCard } from "~/components/BaseCard/BaseCard";
import { FeatureIcon, PlayButtonIcon } from "~/components/icons";
import { PageTitle } from "~/components/PageTitle";
import { WEB_PATHS } from "~/constants/paths";

export type FeatureSectionProps = {
  className?: string;
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

/**
 * Feature Sectionコンポーネント
 * - トップページに特集カードを表示
 * - View Allリンクで特集一覧ページへ遷移
 * - 各カードをクリックすると該当の特集ページ（Twitter）へ遷移
 */
export const FeatureSection = ({ className }: FeatureSectionProps) => {
  return (
    <section className={className}>
      <div className="flex items-center justify-between gap-4">
        <PageTitle
          icon={<FeatureIcon isActive />}
          subtitle="特集"
          title="Feature"
        />
        <a
          className="inline-flex items-center gap-2 text-primary hover:underline"
          href={WEB_PATHS.feature.index}
        >
          <span>View All</span>
        </a>
      </div>
      <div className="grid grid-cols-1 gap-8 p-4 md:grid-cols-2 md:p-6 lg:grid-cols-4">
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
    </section>
  );
};
