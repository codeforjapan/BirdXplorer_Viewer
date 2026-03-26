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
      <div className="overflow-x-auto md:overflow-x-visible">
        <div className="flex gap-4 py-4 md:grid md:grid-cols-2 md:gap-8 md:p-6 lg:grid-cols-4">
          {displayItems.map((item) => (
            <div className="w-[280px] shrink-0 md:w-auto" key={item.id}>
              <ReportCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
