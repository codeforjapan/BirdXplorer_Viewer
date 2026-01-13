import { FeatureCategoryCard } from "~/components/feature-category-card/FeatureCategoryCard";
import { FeatureIcon } from "~/components/icons";
import { PageTitle } from "~/components/PageTitle";
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
        {FEATURE_CATEGORIES.map((category) => (
          <FeatureCategoryCard
            category={category}
            key={category.title}
            maxItems={1}
          />
        ))}
      </div>
    </section>
  );
};
