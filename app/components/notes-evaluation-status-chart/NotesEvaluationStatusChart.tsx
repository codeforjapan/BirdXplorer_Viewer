import { Stack } from "@mantine/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFetcher, useRevalidator } from "react-router";

import { getNotesApiV1DataNotesGet } from "~/generated/api/client";
import { postLinkFromPostId } from "~/feature/twitter/link-builder";

import type { DateRange } from "~/components/date-range-selector";
import {
  getStatusLabel,
  GraphContainer,
  type GraphFetchResult,
  GraphSizeLegend,
  GraphState,
  type GraphStateStatus,
  GraphStatusFilter,
  GraphWrapper,
  type NoteEvaluationData,
  ScatterBubbleChart,
  STATUS_CATEGORIES,
  STATUS_FILTER_OPTIONS,
  type StatusValue,
} from "~/components/graph";
import type { ScatterDataItem } from "~/components/graph/ScatterBubbleChart";
import { dateRangeToTimestamps, getDefaultDateRange } from "~/utils/dateRange";
import { getArrayMax, getArrayMin } from "~/utils/math";

export type NotesEvaluationStatusChartProps = {
  initialResult?: GraphFetchResult<NoteEvaluationData[]>;
  initialDateRange?: DateRange;
};

/**
 * コミュニティーノートの評価状況グラフカード
 * X軸: 「役に立たなかった」の評価数、Y軸: 「役に立った」の評価数、バブルサイズ: インプレッション
 */
export const NotesEvaluationStatusChart = ({
  initialResult,
  initialDateRange,
}: NotesEvaluationStatusChartProps) => {
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange ?? getDefaultDateRange());
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

    const nextUrl = `/resources/graphs/notes-evaluation-status?start_date=${timestamps.start_date}&end_date=${timestamps.end_date}&status=${status}&limit=200`;
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

  const axisRange = useMemo(() => {
    const notHelpfulValues = rawData.map((d) => d.notHelpful);
    const helpfulValues = rawData.map((d) => d.helpful);
    return {
      xMax: getArrayMax(notHelpfulValues),
      yMax: getArrayMax(helpfulValues),
    };
  }, [rawData]);

  const impressionRange = useMemo(() => {
    const impressions = rawData.map((d) => d.impressions);
    return {
      min: getArrayMin(impressions),
      max: getArrayMax(impressions),
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
      itemId: d.noteId,
    }));
  }, [filteredData]);

  const handleBubbleClick = useCallback(async (noteId: string) => {
    const response = await getNotesApiV1DataNotesGet({ note_ids: [noteId] });
    if (response.status !== 200) return;
    const postId = response.data.data[0]?.postId;
    if (!postId) return;
    window.open(postLinkFromPostId(postId), "_blank", "noopener,noreferrer");
  }, []);

  const tooltipFormatter = useCallback((item: ScatterDataItem): string => {
    return `<strong>${item.name}</strong><br/>
      「役に立たなかった」の評価数: ${item.x.toLocaleString()}<br/>
      「役に立った」の評価数: ${item.y.toLocaleString()}<br/>
      インプレッション: ${item.size.toLocaleString()}<br/>
      ステータス: ${getStatusLabel(item.category as string)}`;
  }, []);

  const footer = (
    <Stack gap="md">
      <GraphStatusFilter onChange={setStatus} statuses={STATUS_FILTER_OPTIONS} value={status} />
      <GraphSizeLegend
        label="インプレッション"
        max={impressionRange.max}
        maxBubbleSize={28}
        min={impressionRange.min}
        minBubbleSize={6}
      />
    </Stack>
  );

  return (
    <GraphWrapper
      dateRange={dateRange}
      onDateRangeChange={initialDateRange ? undefined : setDateRange}
      title="コミュニティノートの評価状況"
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
            onBubbleClick={handleBubbleClick}
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
