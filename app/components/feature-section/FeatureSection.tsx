import { BaseCard } from "~/components/BaseCard/BaseCard";
import { FeatureIcon, PlayButtonIcon } from "~/components/icons";
import { PageTitle } from "~/components/PageTitle";
import { WEB_PATHS } from "~/constants/paths";
import { FEATURES } from "~/data/features";

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
      <div className="overflow-x-auto md:overflow-x-visible">
        <div className="flex gap-4 py-4 md:grid md:grid-cols-2 md:gap-8 md:p-6 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div className="w-[280px] shrink-0 md:w-auto" key={feature.id}>
              <BaseCard
                body={
                  <ul className="space-y-2">
                    <li className="text-heading-m-compact flex items-start gap-2 text-white">
                      <PlayButtonIcon className="shrink-0" isActive />
                      <span>{feature.detail.title}</span>
                    </li>
                  </ul>
                }
                href={feature.detail.href}
                title={<span className="text-white">{feature.category}</span>}
                titleBgColor={feature.color}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
