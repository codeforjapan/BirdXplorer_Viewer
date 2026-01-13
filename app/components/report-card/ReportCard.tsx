import { BaseCard } from "~/components/BaseCard/BaseCard";
import { PlayButtonIcon } from "~/components/icons";
import type { ReportItem } from "~/data/reports";

export type ReportCardProps = {
  item: ReportItem;
};

export const ReportCard = ({ item }: ReportCardProps) => {
  return (
    <BaseCard
      body={
        <a href={item.href}>
          <p className="text-body-l line-clamp-6 text-gray-3 hover:underline">
            {item.description}
          </p>
        </a>
      }
      key={item.href}
      title={
        <span className="flex items-center gap-2 p-2 text-white">
          <PlayButtonIcon className="shrink-0" isActive />
          <span className="text-heading-l">{item.title}</span>
        </span>
      }
    />
  );
};
