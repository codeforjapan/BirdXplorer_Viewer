import { Stack } from "@mantine/core";
import { useCallback,useMemo, useState } from "react";

import {
  getStatusLabel,
  GraphContainer,
  GraphSizeLegend,
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

import { createMockResponse } from "./data";

// PostInfluenceData は ~/components/graph から再エクスポート
export type { PostInfluenceData } from "~/components/graph";

export type PostInfluenceChartProps = {
  data?: PostInfluenceData[];
  /** 更新日（YYYY-MM-DD形式） */
  updatedAt?: string;
};

/**
 * ポストの影響力グラフカード
 * X軸: リポスト数、Y軸: いいね数、バブルサイズ: インプレッション
 */
export const PostInfluenceChart = ({
  data,
  updatedAt,
}: PostInfluenceChartProps) => {
  const [status, setStatus] = useState<StatusValue>("all");

  const mockResponse = useMemo(() => createMockResponse(), []);
  const rawData = useMemo(
    () => data ?? mockResponse.data,
    [data, mockResponse.data]
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
      updatedAt={updatedAt ?? mockResponse.updatedAt}
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
    </GraphWrapper>
  );
};
