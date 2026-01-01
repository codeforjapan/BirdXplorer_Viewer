/* eslint-disable react-refresh/only-export-components */
import { ReportIcon } from "~/components/icons";
import { ReportCard } from "~/components/report-card/ReportCard";
import { REPORT_ITEMS } from "~/data/reports";

import type { LayoutHandle } from "./_layout";
import type { Route } from "./+types/_layout.report";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "月次レポート - BirdXplorer" },
    {
      name: "description",
      content: "BirdXplorerの月次レポート一覧",
    },
    {
      name: "robots",
      content: "noindex, nofollow",
    },
  ];
};

export const handle: LayoutHandle = {
  breadcrumb: [{ label: "TOP", href: "/" }, { label: "Report" }],
  pageTitle: {
    icon: <ReportIcon isActive />,
    title: "Report",
    subtitle: "月次レポート",
  },
};

export default function Report() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
      {REPORT_ITEMS.map((item) => (
        <ReportCard item={item} key={item.id} />
      ))}
    </div>
  );
}
