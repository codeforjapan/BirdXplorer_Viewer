import { ReportIcon } from "~/components/icons";
import { PageTitle } from "~/components/PageTitle";
import { ReportCard } from "~/components/report-card/ReportCard";
import { WEB_PATHS } from "~/constants/paths";
import { REPORT_ITEMS } from "~/data/reports";

export type ReportCardSectionProps = {
  className?: string;
  maxItems?: number;
};

export const ReportCardSection = ({
  className,
  maxItems,
}: ReportCardSectionProps) => {
  const displayItems = maxItems
    ? REPORT_ITEMS.slice(0, maxItems)
    : REPORT_ITEMS;

  return (
    <section className={className}>
      <div className="flex items-center justify-between gap-4">
        <PageTitle
          icon={<ReportIcon isActive />}
          subtitle="月次レポート"
          title="Report"
        />
        <a
          className="inline-flex items-center gap-2 text-primary hover:underline"
          href={WEB_PATHS.report.index}
        >
          <span>View All</span>
        </a>
      </div>
      <div className="grid grid-cols-1 gap-8 p-4 md:grid-cols-2 md:p-6 lg:grid-cols-4">
        {displayItems.map((item) => (
          <ReportCard item={item} key={item.id} />
        ))}
      </div>
    </section>
  );
};
