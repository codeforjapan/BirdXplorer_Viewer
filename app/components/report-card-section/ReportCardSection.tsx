import { ReportIcon } from "~/components/icons";
import { PageTitle } from "~/components/PageTitle";
import { ReportCard } from "~/components/report-card/ReportCard";
import { WEB_PATHS } from "~/constants/paths";

export type ReportCardSectionProps = {
  className?: string;
};

type ReportItem = {
  id: string;
  title: string;
  description: string;
  href: string;
};

const reportItems: ReportItem[] = [
  {
    id: "1",
    title: "2025年 9月レポート",
    description:
      "奈良市の持続可能な発展を目指す意見が多岐にわたって集まっています。都市開発や交通インフラの革新、地域活性化、教育と地域社会の連携、観光振興、地域資源の活用、市民参加とAI活用による市政改革、高齢化社会への対応、防災力強化、環境保全、医療・教育の連携強化...",
    href: WEB_PATHS.report.show.replace(":id", "1"),
  },
  {
    id: "2",
    title: "2025年 8月レポート",
    description:
      "奈良市の持続可能な発展を目指した様々な提案が集まりました。インフラ整備、地域社会の活性化、観光資源の保護、市民参加によるまちづくり、デジタル技術活用、防災対策、医療・教育分野での協力強化などがあげられています...",
    href: WEB_PATHS.report.show.replace(":id", "2"),
  },
  {
    id: "3",
    title: "2025年 7月レポート",
    description:
      "奈良市において持続的な成長を実現するための意見が幅広く提出されました。交通網の整備、地域経済の活性化、観光の促進、環境対応、AIやICTの活用による行政効率化が注目されています...",
    href: WEB_PATHS.report.show.replace(":id", "3"),
  },
  {
    id: "4",
    title: "2025年 6月レポート",
    description:
      "持続可能な奈良市の未来にむけたアイディアが集まりました。都市づくりの新戦略、若者や高齢者が活躍できる街づくり、災害対策の強化、観光振興策、市民との協働体制強化などが挙げられています...",
    href: WEB_PATHS.report.show.replace(":id", "4"),
  },
];

export const ReportCardSection = ({ className }: ReportCardSectionProps) => {
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
        {reportItems.map((item) => (
          <ReportCard item={item} key={item.id} />
        ))}
      </div>
    </section>
  );
};
