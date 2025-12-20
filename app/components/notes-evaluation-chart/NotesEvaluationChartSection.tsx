import * as React from "react";

import {
  type CategoryConfig,
  GraphContainer,
  GraphStatusFilter,
  GraphWrapper,
  PERIOD_OPTIONS,
  type PeriodValue,
  ScatterBubbleChart,
  STATUS_COLORS,
  type StatusValue,
} from "~/components/graph";
import type { ScatterDataItem } from "~/components/graph/ScatterBubbleChart";

/**
 * ノート評価分布図のカテゴリ設定
 * 凡例の表示順序: 非公開 → 評価中 → 公開済 → 一時公開
 */
const NOTE_STATUS_CATEGORIES: CategoryConfig[] = [
  { key: 0, name: "非公開", color: STATUS_COLORS.unpublished },
  { key: 1, name: "評価中", color: STATUS_COLORS.evaluating },
  { key: 2, name: "公開済", color: STATUS_COLORS.published },
  { key: 3, name: "一時公開", color: STATUS_COLORS.temporarilyPublished },
];

/** 評価分布データの型 */
export type EvaluationData = {
  noteId: string;
  name: string;
  helpful: number;
  notHelpful: number;
  impressions: number;
  /** ステータス: 0=非公開, 1=評価中, 2=公開済み, 3=一時公開 */
  status: 0 | 1 | 2 | 3;
};

/**
 * モックデータを生成
 */
const generateMockData = (): EvaluationData[] => {
  const result: EvaluationData[] = [];

  // 非公開（青）- 左下に少数、サイズ小
  for (let i = 0; i < 10; i++) {
    result.push({
      noteId: `unpublished-${i + 1}`,
      name: `非公開ノート${i + 1}`,
      helpful: Math.floor(Math.random() * 300) + 50,
      notHelpful: Math.floor(Math.random() * 100) + 10,
      impressions: Math.floor(Math.random() * 4000000) + 1000000,
      status: 0,
    });
  }

  // 評価中（水色）- 左下から左上に多数、サイズ中
  // 左下に密集
  for (let i = 0; i < 50; i++) {
    result.push({
      noteId: `evaluating-${i + 1}`,
      name: `評価中ノート${i + 1}`,
      helpful: Math.floor(Math.random() * 400) + 50,
      notHelpful: Math.floor(Math.random() * 150) + 10,
      impressions: Math.floor(Math.random() * 15000000) + 5000000,
      status: 1,
    });
  }
  // 左上に散らばる
  for (let i = 0; i < 30; i++) {
    result.push({
      noteId: `evaluating-${51 + i}`,
      name: `評価中ノート${51 + i}`,
      helpful: Math.floor(Math.random() * 300) + 100,
      notHelpful: Math.floor(Math.random() * 350) + 200,
      impressions: Math.floor(Math.random() * 15000000) + 5000000,
      status: 1,
    });
  }

  // 公開済み（紫）- 左下から真ん中↓に中程度、サイズ中
  for (let i = 0; i < 30; i++) {
    result.push({
      noteId: `published-${i + 1}`,
      name: `公開済みノート${i + 1}`,
      helpful: Math.floor(Math.random() * 800) + 100,
      notHelpful: Math.floor(Math.random() * 150) + 20,
      impressions: Math.floor(Math.random() * 15000000) + 5000000,
      status: 2,
    });
  }

  // 一時公開（ピンク）- 左下から右下に中程度、サイズ大
  for (let i = 0; i < 20; i++) {
    result.push({
      noteId: `temporarilyPublished-${i + 1}`,
      name: `一時公開ノート${i + 1}`,
      helpful: Math.floor(Math.random() * 3000) + 100,
      notHelpful: Math.floor(Math.random() * 180) + 20,
      impressions: Math.floor(Math.random() * 30000000) + 20000000,
      status: 3,
    });
  }

  return result;
};

export type NotesEvaluationChartSectionProps = {
  /** コンテナのクラス名 */
  className?: string;
  data?: EvaluationData[];
  /** 更新日（例: "2025年10月13日更新"） */
  updatedAt?: string;
};

/**
 * コミュニティノート評価分布図セクション
 */
export const NotesEvaluationChartSection = ({
  className,
  data,
  updatedAt = "2025年10月13日更新",
}: NotesEvaluationChartSectionProps) => {
  const [period, setPeriod] = React.useState<PeriodValue>("1month");
  const [status, setStatus] = React.useState<StatusValue>("all");

  // TODO: 期間変更時にAPIからデータを取得するロジックを実装する
  // 現在はモックデータを使用しており、periodの変更には対応していない
  const rawData = React.useMemo(() => data ?? generateMockData(), [data]);

  // フィルター前の全データから軸の最大値を算出（フィルター後だと軸のスケールが変動してしまう）
  const axisRange = React.useMemo(() => {
    const helpfulValues = rawData.map((d) => d.helpful);
    const notHelpfulValues = rawData.map((d) => d.notHelpful);
    return {
      xMax: Math.max(...helpfulValues),
      yMax: Math.max(...notHelpfulValues),
    };
  }, [rawData]);

  const filteredData = React.useMemo(() => {
    if (status === "all") return rawData;

    const statusMap: Record<Exclude<StatusValue, "all">, number> = {
      unpublished: 0,
      evaluating: 1,
      published: 2,
      temporarilyPublished: 3,
    };

    return rawData.filter((d) => d.status === statusMap[status]);
  }, [rawData, status]);

  const chartData: ScatterDataItem[] = React.useMemo(() => {
    return filteredData.map((d) => ({
      x: d.helpful,
      y: d.notHelpful,
      size: d.impressions,
      name: d.name,
      category: d.status,
    }));
  }, [filteredData]);

  const tooltipFormatter = React.useCallback((item: ScatterDataItem): string => {
    const statusNames: Record<number, string> = {
      0: "非公開",
      1: "評価中",
      2: "公開済",
      3: "一時公開",
    };
    return `<strong>${item.name}</strong><br/>
      「役に立った」の評価数: ${item.x.toLocaleString()}<br/>
      「役に立たなかった」の評価数: ${item.y.toLocaleString()}<br/>
      インプレッション: ${item.size.toLocaleString()}<br/>
      ステータス: ${statusNames[item.category as number] ?? item.category}`;
  }, []);

  const footer = <GraphStatusFilter onChange={setStatus} value={status} />;

  return (
    <GraphWrapper
      className={className}
      onPeriodChange={(v) => setPeriod(v as PeriodValue)}
      period={period}
      periodOptions={PERIOD_OPTIONS}
      title="コミュニティーノート評価分布図"
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
          xAxisName="役に立った"
          yAxisMax={axisRange.yMax}
          yAxisName="役に立たなかった"
        />
      </GraphContainer>
    </GraphWrapper>
  );
};

