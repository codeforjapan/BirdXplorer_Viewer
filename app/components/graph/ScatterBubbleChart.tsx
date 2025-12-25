import type { EChartsOption } from "echarts";
import { useCallback,useMemo } from "react";

import { getArrayMinMax } from "~/utils/math";

import { GRAPH_STYLES } from "./constants";
import { EChartsGraph } from "./EChartsGraph";

/**
 * カテゴリ設定の型
 * 各カテゴリ（グループ）の表示設定を定義
 */
export type CategoryConfig = {
  /** カテゴリの識別子（データのcategoryと対応） */
  key: string | number;
  /** 凡例などに表示する名前 */
  name: string;
  /** バブルの色 */
  color: string;
};

/** 散布図データの型 */
export type ScatterDataItem = {
  x: number;
  y: number;
  size: number;
  name: string;
  /** カテゴリ識別子（categoriesのkeyと対応） */
  category: string | number;
};

export type ScatterBubbleChartProps = {
  data: ScatterDataItem[];
  /**
   * カテゴリ設定の配列
   * - 配列の順序が凡例の表示順序になる
   * - 配列の逆順がシリーズの描画順序になる（後に描画されるものが手前に表示）
   */
  categories: CategoryConfig[];
  xAxisName?: string;
  yAxisName?: string;
  xAxisMax?: number;
  yAxisMax?: number;
  height?: string | number;
  minHeight?: number;
  minBubbleSize?: number;
  maxBubbleSize?: number;
  tooltipFormatter?: (item: ScatterDataItem) => string;
};

/**
 * 散布図（バブルチャート）コンポーネント
 * - X/Y軸に任意の値をプロット
 * - バブルサイズで第3の値を表現
 * - カテゴリ別に色分け
 */
export const ScatterBubbleChart = ({
  data,
  categories,
  xAxisName = "X軸",
  yAxisName = "Y軸",
  xAxisMax,
  yAxisMax,
  height = "60vh",
  minHeight = 400,
  minBubbleSize = 10,
  maxBubbleSize = 50,
  tooltipFormatter,
}: ScatterBubbleChartProps) => {
  // カテゴリのルックアップマップを作成
  const categoryMap = useMemo(() => {
    return new Map(categories.map((c) => [c.key, c]));
  }, [categories]);

  // 凡例の表示順序（categoriesの配列順）
  const legendOrder = useMemo(() => {
    return categories.map((c) => c.name);
  }, [categories]);

  // シリーズの描画順序（categoriesの逆順 = 後のものが手前に表示）
  const seriesOrder = useMemo(() => {
    return [...categories].reverse();
  }, [categories]);

  const sizeRange = useMemo(() => {
    return getArrayMinMax(data.map((d) => d.size));
  }, [data]);

  // EChartsのscatterシリーズはタプル形式のデータを要求するため変換
  // [x, y, size, name, category]
  const internalData = useMemo(() => {
    return data.map(
      (d) =>
        [d.x, d.y, d.size, d.name, d.category] as [
          number,
          number,
          number,
          string,
          string | number,
        ]
    );
  }, [data]);

  const calculateBubbleSize = useCallback(
    (sizeValue: number): number => {
      if (sizeRange.min === sizeRange.max) {
        return (minBubbleSize + maxBubbleSize) / 2;
      }
      const ratio = (sizeValue - sizeRange.min) / (sizeRange.max - sizeRange.min);
      // 平方根でスケーリング: バブルの「面積」が値に比例するようにするため（直径を線形にすると面積が二乗で増え、視覚的に誇張される）
      return minBubbleSize + Math.sqrt(ratio) * (maxBubbleSize - minBubbleSize);
    },
    [sizeRange, minBubbleSize, maxBubbleSize]
  );

  const option = useMemo<EChartsOption>(() => {
    const defaultTooltipFormatter = (item: ScatterDataItem): string => {
      const categoryConfig = categoryMap.get(item.category);
      const categoryName = categoryConfig?.name ?? String(item.category);
      return `<strong>${item.name}</strong><br/>
        ${xAxisName}: ${item.x.toLocaleString()}<br/>
        ${yAxisName}: ${item.y.toLocaleString()}<br/>
        サイズ: ${item.size.toLocaleString()}<br/>
        カテゴリ: ${categoryName}`;
    };

    const formatter = tooltipFormatter ?? defaultTooltipFormatter;

    return {
      backgroundColor: "transparent",
      legend: {
        data: legendOrder,
        icon: "circle",
        itemGap: 24,
        itemHeight: 14,
        left: 10,
        textStyle: {
          color: GRAPH_STYLES.textColor,
          fontSize: 14,
          lineHeight: 14,
        },
        top: 10,
      },
      tooltip: {
        backgroundColor: GRAPH_STYLES.tooltipBgColor,
        borderColor: GRAPH_STYLES.tooltipBorderColor,
        formatter: (param) => {
          if (Array.isArray(param)) return "";
          const [x, y, size, name, category] = param.value as [
            number,
            number,
            number,
            string,
            string | number,
          ];
          return formatter({ x, y, size, name, category });
        },
        textStyle: { color: "#fff" },
        trigger: "item",
      },
      grid: { bottom: 80, left: 80, right: 40, top: 60 },
      xAxis: {
        axisLabel: { color: GRAPH_STYLES.textColor, fontSize: 11 },
        axisLine: { lineStyle: { color: GRAPH_STYLES.axisColor } },
        max: xAxisMax,
        name: xAxisName,
        nameGap: 45,
        nameLocation: "middle",
        nameTextStyle: { color: GRAPH_STYLES.textColor, fontSize: 12 },
        splitLine: { lineStyle: { color: GRAPH_STYLES.gridColor }, show: true },
        type: "value",
      },
      yAxis: {
        axisLabel: { color: GRAPH_STYLES.textColor, fontSize: 11 },
        axisLine: { lineStyle: { color: GRAPH_STYLES.axisColor } },
        max: yAxisMax,
        name: yAxisName,
        nameGap: 50,
        nameLocation: "middle",
        nameTextStyle: { color: GRAPH_STYLES.textColor, fontSize: 12 },
        splitLine: { lineStyle: { color: GRAPH_STYLES.gridColor }, show: true },
        type: "value",
      },
      series: seriesOrder.map((categoryConfig) => ({
        animationDuration: 500,
        data: internalData.filter((d) => d[4] === categoryConfig.key),
        emphasis: {
          focus: "series",
          itemStyle: { opacity: 0.95 },
        },
        itemStyle: {
          color: categoryConfig.color,
          opacity: 0.7,
          borderColor: GRAPH_STYLES.borderColor,
          borderWidth: 1,
        },
        name: categoryConfig.name,
        symbolSize: (val: [number, number, number, string, string | number]) => {
          return calculateBubbleSize(val[2]);
        },
        type: "scatter",
      })),
    };
  }, [
    internalData,
    categoryMap,
    legendOrder,
    seriesOrder,
    xAxisName,
    yAxisName,
    xAxisMax,
    yAxisMax,
    calculateBubbleSize,
    tooltipFormatter,
  ]);

  return <EChartsGraph height={height} minHeight={minHeight} option={option} />;
};
