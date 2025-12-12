import type { EChartsOption } from "echarts";
import * as React from "react";

import { GRAPH_STYLES } from "./constants";
import { EChartsGraph } from "./EChartsGraph";

/** 棒グラフシリーズの設定 */
export type BarSeriesConfig = {
  /** シリーズ名（ツールチップに表示） */
  name: string;
  data: number[];
  color: string;
  visible?: boolean;
};

/** 折れ線グラフシリーズの設定 */
export type LineSeriesConfig = {
  /** シリーズ名（ツールチップに表示） */
  name: string;
  data: number[];
  color: string;
  visible?: boolean;
  /** 値の単位（ツールチップ表示用、例: "%"） */
  unit?: string;
};

/** Y軸の設定 */
export type YAxisConfig = {
  /** 軸名（縦に表示） */
  name?: string;
  min?: number;
  max?: number;
};

/** StackedBarLineChart のプロパティ */
export type StackedBarLineChartProps = {
  /** X軸のカテゴリラベル */
  categories: string[];
  /** 積み上げ棒グラフのシリーズ配列（下から上に積み上げ） */
  barSeries: BarSeriesConfig[];
  /** 折れ線グラフのシリーズ（オプション） */
  lineSeries?: LineSeriesConfig;
  leftYAxis?: YAxisConfig;
  rightYAxis?: YAxisConfig;
  height?: string;
  minHeight?: number;
  /** スタック名（デフォルト: "total"） */
  stackName?: string;
  barWidth?: string | number;
  /** 凡例表示（デフォルト: false） */
  showLegend?: boolean;
  legendTop?: number;
  legendLeft?: number;
};

export const StackedBarLineChart = ({
  categories,
  barSeries,
  lineSeries,
  leftYAxis,
  rightYAxis,
  height = "400px",
  minHeight = 350,
  stackName = "total",
  barWidth = "50%",
  showLegend = false,
  legendTop = 10,
  legendLeft = 10,
}: StackedBarLineChartProps) => {
  const option = React.useMemo<EChartsOption>(() => {
    // 凡例初期状態（visible=false を legend.selected で反映）
    const legendSelected = Object.fromEntries(
      barSeries.map((s) => [s.name, s.visible !== false]),
    ) as Record<string, boolean>;

    // 棒グラフシリーズを生成
    const barSeriesOptions = barSeries.map((series, index) => ({
      name: series.name,
      type: "bar" as const,
      stack: stackName,
      // showLegend=true の場合は ECharts の凡例クリックで表示/非表示を切り替える
      // showLegend=false の場合は従来どおり visible=false を空データで表現
      data: showLegend ? series.data : series.visible !== false ? series.data : [],
      itemStyle: { color: series.color },
      barWidth: index === 0 ? barWidth : undefined,
      animation: false,
    }));

    // 折れ線グラフシリーズを生成（存在する場合）
    const lineSeriesOption = lineSeries
      ? {
          name: lineSeries.name,
          type: "line" as const,
          yAxisIndex: 1,
          data: lineSeries.visible !== false ? lineSeries.data : [],
          itemStyle: { color: lineSeries.color },
          lineStyle: { color: lineSeries.color, width: 2 },
          symbol: "circle",
          symbolSize: 6,
        }
      : null;

    return {
      backgroundColor: "transparent",
      animationDuration: 500,
      legend: showLegend
        ? {
            data: barSeries.map((s) => s.name),
            icon: "circle",
            itemGap: 24,
            itemHeight: 14,
            left: legendLeft,
            top: legendTop,
            selected: legendSelected,
            textStyle: {
              color: GRAPH_STYLES.textColor,
              fontSize: 14,
              lineHeight: 14,
            },
          }
        : undefined,
      tooltip: {
        trigger: "axis",
        backgroundColor: GRAPH_STYLES.tooltipBgColor,
        borderColor: GRAPH_STYLES.tooltipBorderColor,
        textStyle: { color: "#fff" },
        axisPointer: {
          type: "shadow",
        },
        formatter: (params) => {
          if (!Array.isArray(params) || params.length === 0) return "";
          const firstParam = params[0];
          const category =
            typeof firstParam === "object" && firstParam !== null && "axisValue" in firstParam
              ? String(firstParam.axisValue)
              : "";
          let html = `<strong>${category}</strong><br/>`;

          params.forEach((param) => {
            if (typeof param === "object" && param !== null && "seriesName" in param) {
              const value = param.value as number;
              // 折れ線グラフの単位を取得
              const unit =
                lineSeries && param.seriesName === lineSeries.name ? (lineSeries.unit ?? "") : "";
              const marker = typeof param.marker === "string" ? param.marker : "";
              html += `${marker} ${param.seriesName}: ${value.toLocaleString()}${unit}<br/>`;
            }
          });

          return html;
        },
      },
      grid: {
        left: 80,
        right: 40,
        top: showLegend ? 60 : 20,
        bottom: 80,
      },
      xAxis: {
        type: "category",
        data: categories,
        axisLine: { lineStyle: { color: GRAPH_STYLES.axisColor } },
        axisLabel: {
          color: GRAPH_STYLES.textColor,
          fontSize: 11,
          rotate: 0,
        },
      },
      yAxis: [
        {
          type: "value",
          name: leftYAxis?.name ?? "",
          nameLocation: "middle",
          nameGap: 50,
          nameRotate: 90,
          nameTextStyle: {
            color: GRAPH_STYLES.textColor,
            fontSize: 12,
          },
          min: leftYAxis?.min,
          max: leftYAxis?.max,
          axisLine: { lineStyle: { color: GRAPH_STYLES.axisColor } },
          axisLabel: { color: GRAPH_STYLES.textColor, fontSize: 11 },
          splitLine: { lineStyle: { color: GRAPH_STYLES.gridColor } },
        },
        // 右Y軸（折れ線グラフ用）
        {
          type: "value",
          name: "",
          min: rightYAxis?.min ?? 0,
          max: rightYAxis?.max ?? 100,
          axisLine: { show: false },
          axisLabel: { show: false },
          splitLine: { show: false },
        },
      ],
      series: lineSeriesOption
        ? [...barSeriesOptions, lineSeriesOption]
        : barSeriesOptions,
    };
  }, [
    categories,
    barSeries,
    lineSeries,
    leftYAxis,
    rightYAxis,
    stackName,
    barWidth,
    showLegend,
    legendTop,
    legendLeft,
  ]);

  return <EChartsGraph height={height} minHeight={minHeight} option={option} />;
};

