import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";

import type { MarkLineConfig, RelativePeriodValue, StatusValue } from "~/components/graph";
import {
  getDefaultPeriodValue,
  GraphContainer,
  GraphStatusFilter,
  GraphWrapper,
  RELATIVE_PERIOD_OPTIONS,
  StackedBarLineChart,
  STATUS_COLORS,
  STATUS_FILTER_OPTIONS,
} from "~/components/graph";

import type {
  DailyNotesCreationApiResponse,
  DailyNotesCreationDataItem,
  EventMarker,
} from "./data";
import { createMockResponse } from "./data";

export type DailyNotesCreationChartProps = {
  data?: DailyNotesCreationDataItem[];
  /** 更新日（YYYY-MM-DD形式） */
  updatedAt?: string;
  /** イベントマーカー（例: ["7/3 公示", "7/20 投開票"]） */
  eventMarkers?: EventMarker[];
};

/**
 * コミュニティノートの日別作成数を表示する積み上げ棒グラフ
 * ステータス別（公開中/評価中/非公開/一時公開）にフィルタリング可能
 */
export const DailyNotesCreationChart = ({
  data,
  updatedAt,
  eventMarkers,
}: DailyNotesCreationChartProps) => {
  const options = useMemo(() => RELATIVE_PERIOD_OPTIONS, []);
  const defaultPeriod = getDefaultPeriodValue(options);
  const [period, setPeriod] = useState<RelativePeriodValue>(defaultPeriod);
  const [status, setStatus] = useState<StatusValue>("all");

  const mockResponse = useMemo<DailyNotesCreationApiResponse>(
    () => createMockResponse(period),
    [period]
  );

  // TODO: APIからデータを取得するロジックを実装する
  // 現在はモックデータを使用（periodに応じて生成）
  const rawData = useMemo(
    () => data ?? mockResponse.data,
    [data, mockResponse.data]
  );

  // イベントマーカー（未指定時はデモ用のデフォルトマーカーを使用）
  const markers = useMemo(
    () => eventMarkers ?? mockResponse.eventMarkers,
    [eventMarkers, mockResponse.eventMarkers]
  );

  useEffect(() => {
    if (!options.length) return;
    if (period && options.some((option) => option.value === period)) return;
    const fallback =
      options.find((option) => option.value === defaultPeriod)?.value ??
      options[0]?.value ??
      defaultPeriod;
    setPeriod(fallback);
  }, [options, defaultPeriod, period]);

  const categories = useMemo(
    () => rawData.map((d) => dayjs(d.date).format("M/D")),
    [rawData]
  );

  // イベントマーカーをMarkLineConfigに変換
  const markLines = useMemo<MarkLineConfig[]>(() => {
    return markers?.length ? markers
      .map((marker) => ({
        xAxisValue: dayjs(marker.date).format("M/D"),
        label: marker.label,
      }))
      .filter((m) => categories.includes(m.xAxisValue)) : [];
  }, [markers, categories]);

  const seriesVisibility = useMemo(() => {
    if (status === "all") {
      return { published: true, evaluating: true, unpublished: true, temporarilyPublished: true };
    }
    return {
      published: status === "published",
      evaluating: status === "evaluating",
      unpublished: status === "unpublished",
      temporarilyPublished: status === "temporarilyPublished",
    };
  }, [status]);

  const barSeries = useMemo(
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
      {
        name: "一時公開",
        data: rawData.map((d) => d.temporarilyPublished),
        color: STATUS_COLORS.temporarilyPublished,
        visible: seriesVisibility.temporarilyPublished,
      },
    ],
    [rawData, seriesVisibility]
  );

  const footer = (
    <GraphStatusFilter
      onChange={setStatus}
      statuses={STATUS_FILTER_OPTIONS}
      value={status}
    />
  );

  return (
    <GraphWrapper
      onPeriodChange={setPeriod}
      period={period}
      periodOptions={options}
      title="コミュニティノートの日別作成数"
      updatedAt={updatedAt ?? mockResponse.updatedAt}
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
