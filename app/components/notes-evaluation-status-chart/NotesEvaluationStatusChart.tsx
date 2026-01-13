import { Stack } from "@mantine/core";
import { useCallback,useMemo, useState } from "react";

import {
  getStatusLabel,
  GraphContainer,
  GraphSizeLegend,
  GraphStatusFilter,
  GraphWrapper,
  type NoteEvaluationData,
  ScatterBubbleChart,
  STATUS_CATEGORIES,
  STATUS_FILTER_OPTIONS,
  type StatusValue,
} from "~/components/graph";
import type { ScatterDataItem } from "~/components/graph/ScatterBubbleChart";
import { getArrayMax, getArrayMin } from "~/utils/math";

import type { NotesEvaluationStatusApiResponse } from "./data";
import { createMockResponse } from "./data";

export type NotesEvaluationStatusChartProps = {
  data?: NoteEvaluationData[];
  /** 更新日（YYYY-MM-DD形式） */
  updatedAt?: string;
};

/**
 * コミュニティーノートの評価状況グラフカード
 * X軸: 「役に立たなかった」の評価数、Y軸: 「役に立った」の評価数、バブルサイズ: インプレッション
 */
export const NotesEvaluationStatusChart = ({
  data,
  updatedAt,
}: NotesEvaluationStatusChartProps) => {
  const [status, setStatus] = useState<StatusValue>("all");

  const mockResponse = useMemo<NotesEvaluationStatusApiResponse>(
    () => createMockResponse(),
    []
  );
  const rawData = useMemo(() => data ?? mockResponse.data, [data, mockResponse.data]);

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
    }));
  }, [filteredData]);

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
      title="コミュニティーノートの評価状況"
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
          xAxisName="「役に立たなかった」の評価数"
          yAxisMax={axisRange.yMax}
          yAxisName="「役に立った」の評価数"
        />
      </GraphContainer>
    </GraphWrapper>
  );
};
