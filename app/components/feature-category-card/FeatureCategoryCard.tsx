import { BaseCard } from "~/components/BaseCard/BaseCard";
import { PlayButtonIcon } from "~/components/icons";
import type { FeatureCategory } from "~/data/features";

export type FeatureCategoryCardProps = {
  category: FeatureCategory;
  maxItems?: number;
};

/**
 * Feature Category Cardコンポーネント
 * - 特集カテゴリを表示するカード
 * - maxItemsで表示するアイテム数を制限できる（未指定時は全て表示）
 */
export const FeatureCategoryCard = ({
  category,
  maxItems,
}: FeatureCategoryCardProps) => {
  const displayItems = maxItems
    ? category.items.slice(0, maxItems)
    : category.items;

  return (
    <BaseCard
      body={
        <ul className="space-y-2">
          {displayItems.map((item) => (
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
      title={<span className="text-white">{category.title}</span>}
      titleBgColor={category.color}
    />
  );
};
