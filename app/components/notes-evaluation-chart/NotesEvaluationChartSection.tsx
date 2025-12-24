import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getDefaultPeriodValue,
  getStatusLabel,
  GraphContainer,
  GraphStatusFilter,
  GraphWrapper,
  type NoteEvaluationData,
  RELATIVE_PERIOD_OPTIONS,
  type RelativePeriodValue,
  ScatterBubbleChart,
  STATUS_CATEGORIES,
  type StatusValue,
} from "~/components/graph";
import type { ScatterDataItem } from "~/components/graph/ScatterBubbleChart";
import { getArrayMax } from "~/utils/math";

import type { NotesEvaluationApiResponse } from "./data";
import { createMockResponse } from "./data";

export type NotesEvaluationChartSectionProps = {
  data?: NoteEvaluationData[];
  /** 更新日（YYYY-MM-DD形式） */
  updatedAt?: string;
};

/**
 * コミュニティノート評価分布図セクション
 */
export const NotesEvaluationChartSection = ({
  data,
  updatedAt,
}: NotesEvaluationChartSectionProps) => {
  const options = useMemo(() => RELATIVE_PERIOD_OPTIONS, []);
  const defaultPeriod = getDefaultPeriodValue(options);
  const [period, setPeriod] = useState<RelativePeriodValue>(defaultPeriod);
  const [status, setStatus] = useState<StatusValue>("all");

  useEffect(() => {
    if (!options.length) return;
    if (period && options.some((option) => option.value === period)) return;
    const fallback =
      options.find((option) => option.value === defaultPeriod)?.value ??
      options[0]?.value ??
      defaultPeriod;
    setPeriod(fallback);
  }, [options, defaultPeriod, period]);

  const mockResponse = useMemo<NotesEvaluationApiResponse>(
    () => createMockResponse(period),
    [period]
  );

  // TODO: 期間変更時にAPIからデータを取得するロジックを実装する
  // 現在はモックデータを使用（periodに応じて生成）
  const rawData = useMemo(
    () => data ?? mockResponse.data,
    [data, mockResponse.data]
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
  }, []);

  const footer = <GraphStatusFilter onChange={setStatus} value={status} />;

  return (
    <GraphWrapper
      onPeriodChange={setPeriod}
      period={period}
      periodOptions={options}
      title="コミュニティーノート評価分布図"
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
