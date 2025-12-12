import dayjs from "dayjs";
import * as React from "react";

import type { StatusValue } from "~/components/graph";
import {
  GraphContainer,
  GraphStatusFilter,
  GraphWrapper,
  StackedBarLineChart,
  STATUS_COLORS,
} from "~/components/graph";

import type { DailyPostCountDataItem } from "./data";
import { generateMockData } from "./data";

type PeriodOption = { value: string; label: string };

/** ステータスフィルター設定（一時公開を除く） */
const POST_STATUS_FILTERS: Array<{
  value: StatusValue;
  label: string;
  color?: string;
}> = [
  { value: "all", label: "全て" },
  { value: "published", label: "公開中", color: STATUS_COLORS.published },
  { value: "evaluating", label: "評価中", color: STATUS_COLORS.evaluating },
  { value: "unpublished", label: "非公開", color: STATUS_COLORS.unpublished },
];

const defaultPeriodOptions = (): PeriodOption[] => {
  const currentYear = dayjs().year();
  return [0, 1, 2].map((i) => {
    const year = currentYear - i;
    return { value: String(year), label: `${year}年` };
  });
};

export type DailyPostCountChartProps = {
  data?: DailyPostCountDataItem[];
  /** 更新日（例: "2025年10月13日更新"） */
  updatedAt?: string;
  /** 期間選択オプション（指定しない場合は直近3年分） */
  periodOptions?: PeriodOption[];
};

/**
 * ポストの日別投稿数を年単位で表示する積み上げ棒グラフ
 * ステータス別（公開中/評価中/非公開）にフィルタリング可能
 */
export const DailyPostCountChart = ({
  data,
  updatedAt = "2025年10月13日更新",
  periodOptions,
}: DailyPostCountChartProps) => {
  const options = React.useMemo(
    () => periodOptions ?? defaultPeriodOptions(),
    [periodOptions]
  );
  const [period, setPeriod] = React.useState(options[0]?.value ?? "");
  const [status, setStatus] = React.useState<StatusValue>("all");

  // TODO: 期間変更時にAPIからデータを取得するロジックを実装する
  const rawData = React.useMemo(
    () => data ?? generateMockData(period),
    [data, period]
  );

  const categories = React.useMemo(
    () => rawData.map((d) => dayjs(d.date).format("YY/M/D")),
    [rawData]
  );

  const seriesVisibility = React.useMemo(() => {
    if (status === "all") {
      return { published: true, evaluating: true, unpublished: true };
    }
    return {
      published: status === "published",
      evaluating: status === "evaluating",
      unpublished: status === "unpublished",
    };
  }, [status]);

  const barSeries = React.useMemo(
    () => [
      {
        name: "公開中",
        data: rawData.map((d) => d.published),
        color: STATUS_COLORS.published,
        visible: seriesVisibility.published,
      },
      {
        name: "評価中",
        data: rawData.map((d) => d.evaluating),
        color: STATUS_COLORS.evaluating,
        visible: seriesVisibility.evaluating,
      },
      {
        name: "非公開",
        data: rawData.map((d) => d.unpublished),
        color: STATUS_COLORS.unpublished,
        visible: seriesVisibility.unpublished,
      },
    ],
    [rawData, seriesVisibility]
  );

  const footer = (
    <GraphStatusFilter
      onChange={setStatus}
      statuses={POST_STATUS_FILTERS}
      value={status}
    />
  );

  return (
    <GraphWrapper
      onPeriodChange={setPeriod}
      period={period}
      periodOptions={options}
      title="ポストの日別投稿数"
      updatedAt={updatedAt}
    >
      <GraphContainer footer={footer}>
        <StackedBarLineChart
          barSeries={barSeries}
          categories={categories}
          height="60vh"
          leftYAxis={{ name: "ポスト投稿数" }}
          minHeight={400}
          showLegend
        />
      </GraphContainer>
    </GraphWrapper>
  );
};
