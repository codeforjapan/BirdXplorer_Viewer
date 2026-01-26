import { Stack } from "@mantine/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFetcher, useRevalidator } from "react-router";

import {
  DEFAULT_EVALUATION_PERIOD,
  getStatusLabel,
  GraphContainer,
  type GraphFetchResult,
  GraphSizeLegend,
  GraphState,
  type GraphStateStatus,
  GraphStatusFilter,
  GraphWrapper,
  type PostInfluenceData,
  ScatterBubbleChart,
  STATUS_CATEGORIES,
  STATUS_FILTER_OPTIONS,
  type StatusValue,
} from "~/components/graph";
import type { ScatterDataItem } from "~/components/graph/ScatterBubbleChart";
import { getArrayMax, getArrayMin } from "~/utils/math";

// PostInfluenceData は ~/components/graph から再エクスポート
export type { PostInfluenceData } from "~/components/graph";

export type PostInfluenceChartProps = {
  initialResult?: GraphFetchResult<PostInfluenceData[]>;
};

/**
 * ポストの影響力グラフカード
 * X軸: リポスト数、Y軸: いいね数、バブルサイズ: インプレッション
 */
export const PostInfluenceChart = ({
  initialResult,
}: PostInfluenceChartProps) => {
  const [status, setStatus] = useState<StatusValue>("all");
  const fetcher = useFetcher<GraphFetchResult<PostInfluenceData[]>>();
  const revalidator = useRevalidator();
  const hasFetcherLoaded = useRef(false);
  const hasMounted = useRef(false);
  const [lastUrl, setLastUrl] = useState<string | null>(null);

  const currentResult = fetcher.data ?? initialResult;

  useEffect(() => {
    const nextUrl = `/resources/graphs/post-influence?period=${DEFAULT_EVALUATION_PERIOD}&status=${status}&limit=200`;
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
  }, [fetcher, initialResult, lastUrl, status]);

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
    const repostValues = rawData.map((d) => d.reposts);
    const likeValues = rawData.map((d) => d.likes);
    return {
      xMax: getArrayMax(repostValues),
      yMax: getArrayMax(likeValues),
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
      x: d.reposts,
      y: d.likes,
      size: d.impressions,
      name: d.name,
      category: d.status,
    }));
  }, [filteredData]);

  const tooltipFormatter = useCallback((item: ScatterDataItem): string => {
    return `<strong>${item.name}</strong><br/>
      リポスト数: ${item.x.toLocaleString()}<br/>
      いいね数: ${item.y.toLocaleString()}<br/>
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
      title="ポストの影響力"
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
            xAxisName="リポスト数"
            yAxisMax={axisRange.yMax}
            yAxisName="いいね数"
          />
        </GraphContainer>
      </GraphState>
    </GraphWrapper>
  );
};
