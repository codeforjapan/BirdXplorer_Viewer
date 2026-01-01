/* eslint-disable react-refresh/only-export-components */
import { Stack } from "@mantine/core";
import { useState } from "react";

import { ReportIcon } from "~/components/icons";
import { PeriodSelector } from "~/components/period-selector/PeriodSelector";
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

// カスタム期間オプション（月次レポート用）
const REPORT_PERIOD_OPTIONS = [
  { value: "1year", label: "直近1年" },
  { value: "2025", label: "2025年" },
  { value: "2024", label: "2024年" },
  { value: "all", label: "全期間" },
];

// タイトルから年を抽出
const extractYear = (title: string): number => {
  const match = /(\d{4})年/.exec(title);
  return match?.[1] ? parseInt(match[1], 10) : 0;
};

// 期間に応じた表示アイテムの取得
const getDisplayItems = (period: string) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 0-indexed なので +1

  switch (period) {
    case "1year": {
      // 直近12ヶ月のデータ
      const oneYearAgo = new Date(now);
      oneYearAgo.setMonth(now.getMonth() - 11); // 11ヶ月前（今月含めて12ヶ月）
      const startYear = oneYearAgo.getFullYear();
      const startMonth = oneYearAgo.getMonth() + 1;

      return REPORT_ITEMS.filter((item) => {
        const year = extractYear(item.title);
        const monthMatch = /(\d+)月/.exec(item.title);
        const month = monthMatch?.[1] ? parseInt(monthMatch[1], 10) : 0;

        if (year > currentYear || year < startYear) return false;
        if (year === currentYear && month > currentMonth) return false;
        if (year === startYear && month < startMonth) return false;
        return true;
      });
    }
    case "2025":
      return REPORT_ITEMS.filter((item) => extractYear(item.title) === 2025);
    case "2024":
      return REPORT_ITEMS.filter((item) => extractYear(item.title) === 2024);
    case "all":
      return REPORT_ITEMS;
    default:
      return REPORT_ITEMS;
  }
};

export default function Report() {
  const [period, setPeriod] = useState("1year");

  const displayItems = getDisplayItems(period);

  return (
    <Stack gap="lg">
      <div className="flex justify-end">
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
