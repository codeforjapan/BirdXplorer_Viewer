/* eslint-disable react-refresh/only-export-components */
import { Stack } from "@mantine/core";
import { useState } from "react";
import { Outlet, useLocation } from "react-router";

import { ReportIcon } from "~/components/icons";
import { PeriodSelector } from "~/components/period-selector/PeriodSelector";
import { ReportCard } from "~/components/report-card/ReportCard";
import { WEB_PATHS } from "~/constants/paths";
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

// カスタム期間オプション（月次レポート用）
const REPORT_PERIOD_OPTIONS = [
  { value: "1year", label: "直近1年" },
  { value: "2025", label: "2025年" },
  { value: "2024", label: "2024年" },
  { value: "all", label: "全期間" },
];

// 期間に応じた表示アイテムの取得
const getDisplayItems = (period: string) => {
  const now = new Date();

  switch (period) {
    case "1year": {
      // 直近12ヶ月のデータ
      const oneYearAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
      return REPORT_ITEMS.filter((item) => item.date >= oneYearAgo);
    }
    case "2025":
      return REPORT_ITEMS.filter((item) => item.date.getFullYear() === 2025);
    case "2024":
      return REPORT_ITEMS.filter((item) => item.date.getFullYear() === 2024);
    case "all":
      return REPORT_ITEMS;
    default:
      return REPORT_ITEMS;
  }
};

export default function Report() {
  const [period, setPeriod] = useState("1year");
  const location = useLocation();
  const isIndexPage = location.pathname === WEB_PATHS.report.index;

  // 詳細ページの場合はOutletをレンダリング
  if (!isIndexPage) {
    return <Outlet />;
  }

  const displayItems = getDisplayItems(period);

  return (
    <Stack gap="lg">
      <div className="flex justify-start md:justify-end">
        <PeriodSelector
          onChange={setPeriod}
          periodOptions={REPORT_PERIOD_OPTIONS}
          value={period}
        />
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {displayItems.map((item) => (
          <ReportCard item={item} key={item.id} />
        ))}
      </div>
    </Stack>
  );
}
