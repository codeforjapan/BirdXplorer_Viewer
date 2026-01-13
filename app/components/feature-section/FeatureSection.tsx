import { FeatureCategoryCard } from "~/components/feature-category-card/FeatureCategoryCard";
import { FeatureIcon } from "~/components/icons";
import { PageTitle } from "~/components/PageTitle";
import { FEATURES } from "~/constants/data";
import { WEB_PATHS } from "~/constants/paths";
import { FEATURE_CATEGORIES } from "~/data/features";

export type FeatureSectionProps = {
  className?: string;
};

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
    </section>
  );
};
