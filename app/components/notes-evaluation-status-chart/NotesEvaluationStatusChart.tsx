import { Stack } from "@mantine/core";
import * as React from "react";

import {
  type CategoryConfig,
  GraphContainer,
  GraphSizeLegend,
  GraphStatusFilter,
  GraphWrapper,
  ScatterBubbleChart,
  STATUS_COLORS,
  type StatusValue,
} from "~/components/graph";
import type { ScatterDataItem } from "~/components/graph/ScatterBubbleChart";

import { generateMockData } from "./data";

/**
 * ノート評価状況のカテゴリ設定
 * 凡例の表示順序: 公開中 → 評価中 → 非公開
 */
const NOTE_STATUS_CATEGORIES: CategoryConfig[] = [
  { key: "published", name: "公開中", color: STATUS_COLORS.evaluating },
  { key: "evaluating", name: "評価中", color: STATUS_COLORS.published },
  { key: "unpublished", name: "非公開", color: STATUS_COLORS.temporarilyPublished },
];

/** ノート評価状況データの型 */
export type NoteEvaluationStatusData = {
  noteId: string;
  name: string;
  notHelpful: number;
  helpful: number;
  impressions: number;
  /** ステータス: published=公開中, evaluating=評価中, unpublished=非公開 */
  status: "published" | "evaluating" | "unpublished";
};

export type NotesEvaluationStatusChartProps = {
  data?: NoteEvaluationStatusData[];
  /** 更新日（例: "2025年10月13日更新"） */
  updatedAt?: string;
};

/**
 * コミュニティーノートの評価状況グラフカード
 * X軸: 「役に立たなかった」の評価数、Y軸: 「役に立った」の評価数、バブルサイズ: インプレッション
 */
export const NotesEvaluationStatusChart = ({
  data,
  updatedAt = "2025年10月13日更新",
}: NotesEvaluationStatusChartProps) => {
  const [status, setStatus] = React.useState<StatusValue>("all");

  const rawData = React.useMemo(() => data ?? generateMockData(), [data]);

  const axisRange = React.useMemo(() => {
    const notHelpfulValues = rawData.map((d) => d.notHelpful);
    const helpfulValues = rawData.map((d) => d.helpful);
    return {
      xMax: Math.max(...notHelpfulValues),
      yMax: Math.max(...helpfulValues),
    };
  }, [rawData]);

  const impressionRange = React.useMemo(() => {
    const impressions = rawData.map((d) => d.impressions);
    return {
      min: Math.min(...impressions),
      max: Math.max(...impressions),
    };
  }, [rawData]);

  const filteredData = React.useMemo(() => {
    if (status === "all") return rawData;
    return rawData.filter((d) => d.status === status);
  }, [rawData, status]);

  const chartData: ScatterDataItem[] = React.useMemo(() => {
    return filteredData.map((d) => ({
      x: d.notHelpful,
      y: d.helpful,
      size: d.impressions,
      name: d.name,
      category: d.status,
    }));
  }, [filteredData]);

  const tooltipFormatter = React.useCallback((item: ScatterDataItem): string => {
    const statusNames: Record<string, string> = {
      published: "公開中",
      evaluating: "評価中",
      unpublished: "非公開",
    };
    return `<strong>${item.name}</strong><br/>
      「役に立たなかった」の評価数: ${item.x.toLocaleString()}<br/>
      「役に立った」の評価数: ${item.y.toLocaleString()}<br/>
      インプレッション: ${item.size.toLocaleString()}<br/>
      ステータス: ${statusNames[item.category as string] ?? item.category}`;
  }, []);

  const statusOptions = [
    { value: "all" as const, label: "全て" },
    { value: "published" as const, label: "公開中" },
    { value: "evaluating" as const, label: "評価中" },
    { value: "unpublished" as const, label: "非公開" },
  ];

  const footer = (
    <Stack gap="md">
      <GraphStatusFilter onChange={setStatus} statuses={statusOptions} value={status} />
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
      hidePeriodSelector
      title="コミュニティーノートの評価状況"
      updatedAt={updatedAt}
    >
      <GraphContainer footer={footer}>
        <ScatterBubbleChart
          categories={NOTE_STATUS_CATEGORIES}
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
