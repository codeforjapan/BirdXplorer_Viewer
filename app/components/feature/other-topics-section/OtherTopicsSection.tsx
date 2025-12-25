import { BaseCard } from "~/components/BaseCard/BaseCard";
import { PlayButtonIcon } from "~/components/icons";
import { SectionTitle } from "~/components/SectionTitle";
import { WEB_PATHS } from "~/constants/paths";

export type OtherTopicsSectionProps = {
  className?: string;
  features: FeatureCategory[];
};

type FeatureItem = {
  title: string;
  href: string;
};

type FeatureCategory = {
  id: number;
  category: string;
  color: string;
  detail: FeatureItem;
};

export const OtherTopicsSection = ({
  className,
  features,
}: OtherTopicsSectionProps) => {
  return (
    <section className={className}>
      <div className="flex items-center justify-between gap-4">
        <SectionTitle title="その他の特集" />
        <a
          className="inline-flex items-center gap-2 text-primary hover:underline"
          href={WEB_PATHS.feature.index}
        >
          <span>View All</span>
        </a>
      </div>
      <div className="grid grid-cols-1 gap-8 p-4 md:grid-cols-2 md:p-6 lg:grid-cols-4">
        {features.map((feature) => (
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
