import { Stack, Title } from "@mantine/core";
import type { EChartsOption } from "echarts";
import * as React from "react";

import {
  EChartsGraph,
  GRAPH_STYLES,
  GraphContainer,
  GraphSizeLegend,
  GraphStatusFilter,
  STATUS_COLORS,
  type StatusValue,
} from "~/components/graph";

export default function Test2() {
  // フィルター状態
  const [status, setStatus] = React.useState<StatusValue>("all");

  // サンプルデータ: [notHelpful, helpful, impressions, name, status]
  // notHelpful=X軸, helpful=Y軸, impressions=バブルサイズ
  // status: 0=非公開, 1=評価中, 2=公開中
  const rawData = React.useMemo<
    Array<[number, number, number, string, number]>
  >(() => {
    const result: Array<[number, number, number, string, number]> = [];

    // 公開中（水色）- 左上に密集
    for (let i = 0; i < 60; i++) {
      result.push([
        Math.random() * 200 + 50,
        Math.random() * 1500 + 500,
        Math.random() * 50000000 + 1000000,
        `公開中${i + 1}`,
        2,
      ]);
    }

    // 評価中（紫）- 右側に散在
    for (let i = 0; i < 25; i++) {
      result.push([
        Math.random() * 150 + 350,
        Math.random() * 1200 + 200,
        Math.random() * 40000000 + 500000,
        `評価中${i + 1}`,
        1,
      ]);
    }

    // 非公開（ピンク）- 右下に少数
    for (let i = 0; i < 8; i++) {
      result.push([
        Math.random() * 100 + 400,
        Math.random() * 300,
        Math.random() * 30000000 + 100000,
        `非公開${i + 1}`,
        0,
      ]);
    }

    return result;
  }, []);

  // インプレッションの最小値・最大値を計算
  const impressionRange = React.useMemo(() => {
    const impressions = rawData.map((d) => d[2]);
    return {
      min: Math.min(...impressions),
      max: Math.max(...impressions),
    };
  }, [rawData]);

  // フィルター適用後のデータ
  const filteredData = React.useMemo(() => {
    if (status === "all") return rawData;

    const statusMap: Record<StatusValue, number> = {
      all: -1,
      unpublished: 0,
      evaluating: 1,
      published: 2,
    };

    return rawData.filter((d) => d[4] === statusMap[status]);
  }, [rawData, status]);

  const option = React.useMemo<EChartsOption>(() => {
    // 定数からステータスカラーをインデックスでマッピング
    const statusColorsByIdx = {
      0: STATUS_COLORS.unpublished, // 非公開
      1: STATUS_COLORS.evaluating, // 評価中
      2: STATUS_COLORS.published, // 公開中
    };

    // statusIdx順の名前（データ参照用）
    const statusNamesByIdx = ["非公開", "評価中", "公開中"];
    // 凡例表示順
    const legendOrder = ["公開中", "評価中", "非公開"];

    return {
      backgroundColor: "transparent",
      legend: {
        data: legendOrder,
        icon: "circle",
        itemGap: 24,
        left: 10,
        textStyle: { color: GRAPH_STYLES.textColor, fontSize: 13 },
        top: 10,
      },
      tooltip: {
        backgroundColor: GRAPH_STYLES.tooltipBgColor,
        borderColor: GRAPH_STYLES.tooltipBorderColor,
        formatter: (param) => {
          if (Array.isArray(param)) return "";
          const [notHelpful, helpful, impressions, name, statusIdx] =
            param.value as [number, number, number, string, number];
          return `<strong>${name}</strong><br/>
            「役に立った」の評価数: ${helpful.toLocaleString()}<br/>
            「役に立たなかった」の評価数: ${notHelpful.toLocaleString()}<br/>
            インプレッション: ${impressions.toLocaleString()}<br/>
            ステータス: ${statusNamesByIdx[statusIdx]}`;
        },
        textStyle: { color: "#fff" },
        trigger: "item",
      },
      grid: { bottom: 80, left: 80, right: 40, top: 60 },
      xAxis: {
        axisLabel: { color: GRAPH_STYLES.textColor, fontSize: 11 },
        axisLine: { lineStyle: { color: GRAPH_STYLES.axisColor } },
        max: 500,
        name: "「役に立たなかった」の評価数",
        nameGap: 45,
        nameLocation: "middle",
        nameTextStyle: { color: GRAPH_STYLES.textColor, fontSize: 12 },
        splitLine: { lineStyle: { color: GRAPH_STYLES.gridColor }, show: true },
        type: "value",
      },
      yAxis: {
        axisLabel: { color: GRAPH_STYLES.textColor, fontSize: 11 },
        axisLine: { lineStyle: { color: GRAPH_STYLES.axisColor } },
        max: 2200,
        name: "「役に立った」の評価数",
        nameGap: 50,
        nameLocation: "middle",
        nameTextStyle: { color: GRAPH_STYLES.textColor, fontSize: 12 },
        splitLine: { lineStyle: { color: GRAPH_STYLES.gridColor }, show: true },
        type: "value",
      },
      // Figmaデザイン順（公開中→評価中→非公開）でseriesを作成
      series: [2, 1, 0].map((statusIdx) => ({
        animationDuration: 500,
        data: filteredData.filter((d) => d[4] === statusIdx),
        emphasis: {
          focus: "series",
          itemStyle: { opacity: 0.95 },
        },
        itemStyle: {
          color: statusColorsByIdx[statusIdx as keyof typeof statusColorsByIdx],
          opacity: 0.7,
          borderColor: GRAPH_STYLES.borderColor,
          borderWidth: 1,
        },
        name: statusNamesByIdx[statusIdx],
        symbolSize: (val: [number, number, number, string, number]) => {
          const impressions = val[2];
          // インプレッション数に基づいてバブルサイズを計算
          const minSize = 10;
          const maxSize = 50;
          const ratio =
            (impressions - impressionRange.min) /
            (impressionRange.max - impressionRange.min);
          return minSize + Math.sqrt(ratio) * (maxSize - minSize);
        },
        type: "scatter",
      })),
    };
  }, [filteredData, impressionRange]);

  return (
    <Stack gap="xl" p="md">
      <Title order={2}>GraphContainer デモ</Title>

      <GraphContainer
        footer={
          <Stack gap="md">
            <GraphStatusFilter onChange={setStatus} value={status} />
            <GraphSizeLegend
              label="インプレッション"
              max={impressionRange.max}
              min={impressionRange.min}
              steps={5}
            />
          </Stack>
        }
      >
        <EChartsGraph height="60vh" minHeight={400} option={option} />
      </GraphContainer>
    </Stack>
  );
}
