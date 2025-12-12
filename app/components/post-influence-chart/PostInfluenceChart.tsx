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
 * ポスト影響力のカテゴリ設定
 * 凡例の表示順序: 公開中 → 評価中 → 非公開
 */
const POST_STATUS_CATEGORIES: CategoryConfig[] = [
  { key: "published", name: "公開中", color: STATUS_COLORS.evaluating },
  { key: "evaluating", name: "評価中", color: STATUS_COLORS.published },
  { key: "unpublished", name: "非公開", color: STATUS_COLORS.temporarilyPublished },
];

/** ポスト影響力データの型 */
export type PostInfluenceData = {
  postId: string;
  name: string;
  reposts: number;
  likes: number;
  impressions: number;
  /** ステータス: published=公開中, evaluating=評価中, unpublished=非公開 */
  status: "published" | "evaluating" | "unpublished";
};

export type PostInfluenceChartProps = {
  data?: PostInfluenceData[];
  /** 更新日（例: "2025年10月13日更新"） */
  updatedAt?: string;
};

/**
 * ポストの影響力グラフカード
 * X軸: リポスト数、Y軸: いいね数、バブルサイズ: インプレッション
 */
export const PostInfluenceChart = ({
  data,
  updatedAt = "2025年10月13日更新",
}: PostInfluenceChartProps) => {
  const [status, setStatus] = React.useState<StatusValue>("all");

  const rawData = React.useMemo(() => data ?? generateMockData(), [data]);

  const axisRange = React.useMemo(() => {
    const repostValues = rawData.map((d) => d.reposts);
    const likeValues = rawData.map((d) => d.likes);
    return {
      xMax: Math.max(...repostValues),
      yMax: Math.max(...likeValues),
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
      x: d.reposts,
      y: d.likes,
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
      リポスト数: ${item.x.toLocaleString()}<br/>
      いいね数: ${item.y.toLocaleString()}<br/>
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
      title="ポストの影響力"
      updatedAt={updatedAt}
    >
      <GraphContainer footer={footer}>
        <ScatterBubbleChart
          categories={POST_STATUS_CATEGORIES}
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
