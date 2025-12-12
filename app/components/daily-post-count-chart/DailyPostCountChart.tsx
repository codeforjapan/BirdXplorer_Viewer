import dayjs from "dayjs";
import * as React from "react";

import type { MarkLineConfig, StatusValue } from "~/components/graph";
import {
  GraphContainer,
  GraphStatusFilter,
  GraphWrapper,
  StackedBarLineChart,
  STATUS_COLORS,
} from "~/components/graph";

import type { DailyPostCountDataItem, EventMarker } from "./data";
import {
  generateDemoEventMarkers,
  generateMockData,
  MOCK_NEWEST_DATE,
  MOCK_OLDEST_DATE,
} from "./data";

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

/**
 * 日付範囲から1年ずつ区切った期間オプションを生成
 * @param newestDate 最新日（未指定時は現在月）
 * @param oldestDate 最古日（未指定時は3期間分）
 */
const generatePeriodOptions = (
  newestDate?: string,
  oldestDate?: string
): PeriodOption[] => {
  const newest = newestDate
    ? dayjs(newestDate, "YYYY-MM").startOf("month")
    : dayjs().startOf("month");
  const oldest = oldestDate
    ? dayjs(oldestDate, "YYYY-MM").startOf("month")
    : null;

  const options: PeriodOption[] = [];
  let end = newest;

  // oldestDate が指定されている場合はそこまで、未指定なら3期間分
  const maxPeriods = oldest ? Infinity : 3;

  for (let i = 0; i < maxPeriods; i++) {
    let start = end.subtract(1, "year");

    // start が oldest より前の場合は oldest に調整して最後の期間を生成
    if (oldest && start.isBefore(oldest)) {
      start = oldest;
      const value = `${start.format("YYYY-MM")}_${end.format("YYYY-MM")}`;
      const label = `${start.format("YYYY/MM")} 〜 ${end.format("YYYY/MM")}`;
      options.push({ value, label });
      break;
    }

    const value = `${start.format("YYYY-MM")}_${end.format("YYYY-MM")}`;
    const label = `${start.format("YYYY/MM")} 〜 ${end.format("YYYY/MM")}`;
    options.push({ value, label });

    end = start;
  }

  return options;
};

export type DailyPostCountChartProps = {
  data?: DailyPostCountDataItem[];
  /** 更新日（例: "2025年10月13日更新"） */
  updatedAt?: string;
  /** 期間選択オプション（指定時は newestDate/oldestDate より優先） */
  periodOptions?: PeriodOption[];
  /** イベントマーカー（例: ["7/3 公示", "7/20 投開票"]） */
  eventMarkers?: EventMarker[];
  /** データの最新日（例: "2025-12"）期間オプション自動生成用 */
  newestDate?: string;
  /** データの最古日（例: "2022-06"）期間オプション自動生成用 */
  oldestDate?: string;
};

/**
 * ポストの日別投稿数を期間単位で表示する積み上げ棒グラフ
 * ステータス別（公開中/評価中/非公開）にフィルタリング可能
 */
export const DailyPostCountChart = ({
  data,
  updatedAt = "2025年10月13日更新",
  periodOptions,
  eventMarkers,
  newestDate = MOCK_NEWEST_DATE,
  oldestDate = MOCK_OLDEST_DATE,
}: DailyPostCountChartProps) => {
  const options = React.useMemo(
    () => periodOptions ?? generatePeriodOptions(newestDate, oldestDate),
    [periodOptions, newestDate, oldestDate]
  );
  const [period, setPeriod] = React.useState(options[0]?.value ?? "");
  const [status, setStatus] = React.useState<StatusValue>("all");

  // TODO: 期間変更時にAPIからデータを取得するロジックを実装する
  const rawData = React.useMemo(
    () => data ?? generateMockData(period),
    [data, period]
  );

  // イベントマーカー（未指定時はデモ用マーカーを生成）
  const markers = React.useMemo(
    () => eventMarkers ?? generateDemoEventMarkers(period),
    [eventMarkers, period]
  );

  const categories = React.useMemo(
    () => rawData.map((d) => dayjs(d.date).format("YY/M/D")),
    [rawData]
  );

  // イベントマーカーをMarkLineConfigに変換
  const markLines = React.useMemo<MarkLineConfig[]>(() => {
    return markers
      .map((marker) => ({
        xAxisValue: dayjs(marker.date).format("YY/M/D"),
        label: marker.label,
      }))
      .filter((m) => categories.includes(m.xAxisValue));
  }, [markers, categories]);

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
          markLines={markLines}
          minHeight={400}
          showLegend
        />
      </GraphContainer>
    </GraphWrapper>
  );
};
