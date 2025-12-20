import { BaseCard } from "~/components/BaseCard/BaseCard";
import { PlayButtonIcon } from "~/components/icons";

export type ReportCardProps = {
  item: ReportItem;
};

type ReportItem = {
  id: string;
  title: string;
  description: string;
  href: string;
};

export const ReportCard = ({ item }: ReportCardProps) => {
  return (
    <BaseCard
      body={
        <p className="text-body-l line-clamp-6 text-gray-3">
          {item.description}
        </p>
      }
      key={item.href}
      title={
        <span className="flex items-center gap-2 p-2 text-white hover:underline">
          <PlayButtonIcon className="shrink-0" isActive />
          <span className="text-heading-l">{item.title}</span>
        </span>
      }
    />
  );
};
