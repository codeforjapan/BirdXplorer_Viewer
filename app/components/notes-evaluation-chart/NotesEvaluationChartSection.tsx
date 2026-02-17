import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFetcher, useRevalidator } from "react-router";

import type { DateRange } from "~/components/date-range-selector";
import {
  getStatusLabel,
  GraphContainer,
  type GraphFetchResult,
  GraphState,
  type GraphStateStatus,
  GraphStatusFilter,
  GraphWrapper,
  type NoteEvaluationData,
  ScatterBubbleChart,
  STATUS_CATEGORIES,
  type StatusValue,
} from "~/components/graph";
import type { ScatterDataItem } from "~/components/graph/ScatterBubbleChart";
import { dateRangeToTimestamps, getDefaultDateRange } from "~/utils/dateRange";
import { getArrayMax } from "~/utils/math";

export type NotesEvaluationChartSectionProps = {
  /** コンテナのクラス名 */
  className?: string;
  initialResult?: GraphFetchResult<NoteEvaluationData[]>;
};

/**
 * コミュニティノート評価分布図セクション
 */
export const NotesEvaluationChartSection = ({
  className,
  initialResult,
}: NotesEvaluationChartSectionProps) => {
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
  const [status, setStatus] = useState<StatusValue>("all");
  const fetcher = useFetcher<GraphFetchResult<NoteEvaluationData[]>>();
  const revalidator = useRevalidator();
  const hasFetcherLoaded = useRef(false);
  const hasMounted = useRef(false);
  const [lastUrl, setLastUrl] = useState<string | null>(null);

  const currentResult = fetcher.data ?? initialResult;

  useEffect(() => {
    const timestamps = dateRangeToTimestamps(dateRange);
    if (!timestamps) return;

    const nextUrl = `/resources/graphs/notes-evaluation?start_date=${timestamps.start_date}&end_date=${timestamps.end_date}&status=${status}&limit=5000`;

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

  // フィルター前の全データから軸の最大値を算出（フィルター後だと軸のスケールが変動してしまう）
  const axisRange = useMemo(() => {
    const notHelpfulValues = rawData.map((d) => d.notHelpful);
    const helpfulValues = rawData.map((d) => d.helpful);
    return {
      xMax: getArrayMax(notHelpfulValues),
      yMax: getArrayMax(helpfulValues),
    };
  }, [rawData]);

  const filteredData = useMemo(() => {
    if (status === "all") return rawData;
    return rawData.filter((d) => d.status === status);
  }, [rawData, status]);

  const chartData: ScatterDataItem[] = useMemo(() => {
    return filteredData.map((d) => ({
      x: d.notHelpful,
      y: d.helpful,
      size: d.impressions,
      name: d.name,
      category: d.status,
    }));
  }, [filteredData]);

  const tooltipFormatter = useCallback((item: ScatterDataItem): string => {
    return `<strong>${item.name}</strong><br/>
      「役に立たなかった」の評価数: ${item.x.toLocaleString()}<br/>
      「役に立った」の評価数: ${item.y.toLocaleString()}<br/>
      インプレッション: ${item.size.toLocaleString()}<br/>
      ステータス: ${getStatusLabel(item.category as string)}`;
    },
    [],
  );

  const footer = <GraphStatusFilter onChange={setStatus} value={status} />;

  return (
    <GraphWrapper
      className={className}
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
      title="コミュニティーノート評価分布図"
      updatedAt={currentResult?.ok ? currentResult.updatedAt : undefined}
    >
      <GraphState
        error={currentResult?.ok ? undefined : currentResult?.error}
        onRetry={handleRetry}
        status={graphStatus}
      >
        <GraphContainer footer={footer}>
          <ScatterBubbleChart
            categories={STATUS_CATEGORIES}
            data={chartData}
            height="60vh"
            minHeight={400}
            tooltipFormatter={tooltipFormatter}
            xAxisMax={axisRange.xMax}
            xAxisName="「役に立たなかった」の評価数"
            yAxisMax={axisRange.yMax}
            yAxisName="「役に立った」の評価数"
          />
        </GraphContainer>
      </GraphState>
    </GraphWrapper>
  );
};
