import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFetcher, useRevalidator } from "react-router";

import type { DateRange } from "~/components/date-range-selector";
import type {
  DailyPostCountDataItem,
  EventMarker,
  MarkLineConfig,
  StatusValue,
} from "~/components/graph";
import {
  GraphContainer,
  type GraphFetchResultWithMarkers,
  GraphState,
  type GraphStateStatus,
  GraphStatusFilter,
  GraphWrapper,
  StackedBarLineChart,
  STATUS_COLORS,
  STATUS_FILTER_OPTIONS,
} from "~/components/graph";
import { dateRangeToTimestamps, periodRangeToTimestamps } from "~/utils/dateRange";

export type DailyPostCountChartProps = {
  initialResult?: GraphFetchResultWithMarkers<DailyPostCountDataItem[]>;
  initialDateRange?: DateRange;
};

/**
 * ポストの日別投稿数を期間単位で表示する積み上げ棒グラフ
 * ステータス別（公開中/評価中/非公開/一時公開）にフィルタリング可能
 */
export const DailyPostCountChart = ({
  initialResult,
  initialDateRange,
}: DailyPostCountChartProps) => {
  // デフォルトの日付範囲を設定（2025-02_2026-01）
  const defaultTimestamps = periodRangeToTimestamps("2025-02_2026-01");
  const [dateRange, setDateRange] = useState<DateRange>(
    initialDateRange ?? [
      new Date(defaultTimestamps.start_date),
      new Date(defaultTimestamps.end_date),
    ]
  );
  const fetcher =
    useFetcher<GraphFetchResultWithMarkers<DailyPostCountDataItem[]>>();
  const revalidator = useRevalidator();
  const hasFetcherLoaded = useRef(false);
  const hasMounted = useRef(false);
  const [lastUrl, setLastUrl] = useState<string | null>(null);

  const [status, setStatus] = useState<StatusValue>("all");

  const currentResult = fetcher.data ?? initialResult;

  useEffect(() => {
    const timestamps = dateRangeToTimestamps(dateRange);
    if (!timestamps) return;

    const nextUrl = `/resources/graphs/daily-posts?start_date=${timestamps.start_date}&end_date=${timestamps.end_date}&status=${status}`;

    if (!hasMounted.current) {
      hasMounted.current = true;
      setLastUrl(nextUrl);
      if (!initialResult) {
        hasFetcherLoaded.current = true;
        void fetcher.load(nextUrl);
      }
      return;
    }

    if (nextUrl === lastUrl) return;
    setLastUrl(nextUrl);
    hasFetcherLoaded.current = true;
    void fetcher.load(nextUrl);
  }, [fetcher, initialResult, lastUrl, dateRange, status]);

  const graphStatus = useMemo<GraphStateStatus>(() => {
    if (fetcher.state !== "idle") return "loading";
    if (!currentResult) return "loading";
    if (!currentResult.ok) return "error";
    return currentResult.data.length === 0 ? "empty" : "success";
  }, [currentResult, fetcher.state]);

  const handleRetry = useCallback(() => {
    if (hasFetcherLoaded.current && lastUrl) {
      void fetcher.load(lastUrl);
      return;
    }
    void revalidator.revalidate();
  }, [fetcher, lastUrl, revalidator]);

  const rawData = useMemo(
    () => (currentResult?.ok ? currentResult.data : []),
    [currentResult]
  );
  const markers = useMemo<EventMarker[]>(
    () => (currentResult?.ok ? currentResult.eventMarkers : []),
    [currentResult]
  );

  const categories = useMemo(
    () => rawData.map((d) => dayjs(d.date).format("YY/M/D")),
    [rawData]
  );

  // イベントマーカーをMarkLineConfigに変換
  const markLines = useMemo<MarkLineConfig[]>(() => {
    return markers?.length ? markers
      .map((marker) => ({
        xAxisValue: dayjs(marker.date).format("YY/M/D"),
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
      dateRange={dateRange}
      onDateRangeChange={initialDateRange ? undefined : setDateRange}
      title="ノートがついたポストの日別投稿数"
      updatedAt={currentResult?.ok ? currentResult.updatedAt : undefined}
    >
      <GraphState
        error={currentResult?.ok ? undefined : currentResult?.error}
        onRetry={handleRetry}
        status={graphStatus}
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
      </GraphState>
    </GraphWrapper>
  );
};
