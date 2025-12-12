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

import type { DailyNotesCreationDataItem, EventMarker } from "./data";
import { generateMockData, getDefaultEventMarkers } from "./data";

/** ステータスフィルター設定（一時公開を除く） */
const STATUS_FILTERS: Array<{
  value: StatusValue;
  label: string;
  color?: string;
}> = [
  { value: "all", label: "全て" },
  { value: "published", label: "公開中", color: STATUS_COLORS.published },
  { value: "evaluating", label: "評価中", color: STATUS_COLORS.evaluating },
  { value: "unpublished", label: "非公開", color: STATUS_COLORS.unpublished },
];

export type DailyNotesCreationChartProps = {
  data?: DailyNotesCreationDataItem[];
  /** 更新日（例: "2025年10月13日更新"） */
  updatedAt?: string;
  /** イベントマーカー（例: ["7/3 公示", "7/20 投開票"]） */
  eventMarkers?: EventMarker[];
};

/**
 * コミュニティノートの日別作成数を表示する積み上げ棒グラフ
 * ステータス別（公開中/評価中/非公開）にフィルタリング可能
 */
export const DailyNotesCreationChart = ({
  data,
  updatedAt = "2025年10月13日更新",
  eventMarkers,
}: DailyNotesCreationChartProps) => {
  const [status, setStatus] = React.useState<StatusValue>("all");

  // TODO: APIからデータを取得するロジックを実装する
  const rawData = React.useMemo(() => data ?? generateMockData(), [data]);

  // イベントマーカー（未指定時はデモ用のデフォルトマーカーを使用）
  const markers = React.useMemo(
    () => eventMarkers ?? getDefaultEventMarkers(),
    [eventMarkers]
  );

  const categories = React.useMemo(
    () => rawData.map((d) => dayjs(d.date).format("M/D")),
    [rawData]
  );

  // イベントマーカーをMarkLineConfigに変換
  const markLines = React.useMemo<MarkLineConfig[]>(() => {
    return markers
      .map((marker) => ({
        xAxisValue: dayjs(marker.date).format("M/D"),
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
      statuses={STATUS_FILTERS}
      value={status}
    />
  );

  return (
    <GraphWrapper
      title="コミュニティノートの日別作成数"
      updatedAt={updatedAt}
    >
      <GraphContainer footer={footer}>
        <StackedBarLineChart
          barSeries={barSeries}
          categories={categories}
          height="60vh"
          leftYAxis={{ name: "コミュニティノート作成数" }}
          markLines={markLines}
          minHeight={400}
          showLegend
        />
      </GraphContainer>
    </GraphWrapper>
  );
};
