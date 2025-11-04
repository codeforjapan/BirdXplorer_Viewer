import { Title } from "@mantine/core";
import type { ScatterSeriesOption } from "echarts/charts";
import { ScatterChart } from "echarts/charts";
import type {
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
} from "echarts/components";
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";
import type { ComposeOption } from "echarts/core";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import type { EChartsReactProps } from "echarts-for-react/esm/types";
import * as React from "react";

echarts.use([
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  ScatterChart,
  CanvasRenderer,
]);

type BubbleChartOption = ComposeOption<
  | GridComponentOption
  | LegendComponentOption
  | TitleComponentOption
  | TooltipComponentOption
  | ScatterSeriesOption
>;

const STATUS_NAMES = ["非公開", "評価中", "公開済", "一時公開"] as const;
const STATUS_COLORS = {
  0: "#1e88e5",
  1: "#42a5f5",
  2: "#9c27b0",
  3: "#ec407a",
} as const;

export default function Test() {
  const [EChartsComponent, setEChartsComponent] = React.useState<
    React.ComponentType<EChartsReactProps> | null
  >(null);

  React.useEffect(() => {
    let mounted = true;

    void import("echarts-for-react/lib/core").then((mod) => {
      if (!mounted) return;
      const Comp =
        (mod as { default?: React.ComponentType<EChartsReactProps> }).default ??
        ((mod as unknown) as React.ComponentType<EChartsReactProps>);
      setEChartsComponent(() => Comp);
    });

    return () => {
      mounted = false;
    };
  }, []);

  // サンプルデータ: [helpful, notHelpful, size, name, status]
  // status: 0=非公開, 1=評価中, 2=公開済, 3=一時公開

  // 最終的な型: Array<[number, number, number, string, number]>
  // 例: [
  //   [337, 178, 10, "非公開1", 0],  ← 1つ目のノート
  //   [171,  41, 26, "非公開2", 0],  ← 2つ目のノート
  //   [114,  99, 24, "非公開3", 0],  ← 3つ目のノート
  //   ...
  // ]
  const data = React.useMemo<Array<[number, number, number, string, number]>>(
    () => {
      const result: Array<[number, number, number, string, number]> = [];
      
      // 非公開（青）- 左下に密集
      for (let i = 0; i < 80; i++) {
        result.push([
          Math.random() * 400,
          Math.random() * 200,
          Math.random() * 300 + 10,
          `非公開${i + 1}`,
          0,
        ]);
      }
      
      // 評価中（水色）- 中央左寄り
      for (let i = 0; i < 20; i++) {
        result.push([
          Math.random() * 800 + 200,
          Math.random() * 400 + 100,
          Math.random() * 400 + 15,
          `評価中${i + 1}`,
          1,
        ]);
      }
      
      // 公開済（紫）- 中央下
      for (let i = 0; i < 15; i++) {
        result.push([
          Math.random() * 600 + 400,
          Math.random() * 150,
          Math.random() * 500 + 20,
          `公開済${i + 1}`,
          2,
        ]);
      }
      
      // 一時公開（ピンク）- 右側と中央下に散在
      for (let i = 0; i < 10; i++) {
        result.push([
          Math.random() * 2000 + 1000,
          Math.random() * 200,
          Math.random() * 600 + 25,
          `一時公開${i + 1}`,
          3,
        ]);
      }

      return result;
    },
    [],
  );

  const option = React.useMemo<BubbleChartOption>(() => {
    const series = STATUS_NAMES.map((statusName, statusIndex) => ({
      type: "scatter",
      name: statusName,
      data: data.filter((item) => item[4] === statusIndex),
      symbolSize: (val) => {
        const v = (val as [number, number, number, string, number])[2];
        return Math.max(10, Math.sqrt(v) * 1.5);
      },
      itemStyle: {
        color: STATUS_COLORS[statusIndex as keyof typeof STATUS_COLORS],
        opacity: 0.65,
      },
      emphasis: {
        focus: "series",
        itemStyle: { opacity: 0.9 },
      },
      label: { show: false },
      animationDuration: 500,
    })) as ScatterSeriesOption[];

    return {
      backgroundColor: "transparent",
      legend: {
        data: [...STATUS_NAMES],
        top: 10,
        left: 10,
        textStyle: { color: "#666", fontSize: 13 },
      },
      tooltip: {
        trigger: "item",
        formatter: (param) => {
          if (Array.isArray(param)) return "";
          const [helpful, notHelpful, , name, status] = param.value as [
            number,
            number,
            number,
            string,
            number,
          ];
          return `${name}<br/>役に立った: ${helpful}<br/>役に立たなかった: ${notHelpful}<br/>ステータス: ${STATUS_NAMES[status]}`;
        },
      },
      grid: { left: 80, right: 40, top: 60, bottom: 80 },
      xAxis: {
        type: "value",
        name: "役に立った",
        nameLocation: "middle",
        nameGap: 35,
        nameTextStyle: { color: "#666", fontSize: 13 },
        splitLine: { show: true, lineStyle: { color: "#e0e0e0" } },
        axisLine: { lineStyle: { color: "#999" } },
        axisLabel: { color: "#666", fontSize: 11 },
        max: 3500,
      },
      yAxis: {
        type: "value",
        name: "役に立たなかった",
        nameLocation: "middle",
        nameGap: 50,
        nameTextStyle: { color: "#666", fontSize: 13 },
        splitLine: { show: true, lineStyle: { color: "#e0e0e0" } },
        axisLine: { lineStyle: { color: "#999" } },
        axisLabel: { color: "#666", fontSize: 11 },
        max: 600,
      },
      series,
    } satisfies BubbleChartOption;
  }, [data]);

  if (!EChartsComponent) {
    return (
      <>
        <Title order={2}>テストページ2</Title>
        <div style={{ height: "100%", padding: 16 }}>
          <div style={{ width: "100%", height: "60vh", minHeight: 360 }} />
        </div>
      </>
    );
  }

  return (
    <>
      <Title order={2}>テストページ</Title>
      <div style={{ height: "100%", padding: 16 }}>
        <EChartsComponent
          echarts={echarts}
          option={option}
          opts={{ renderer: "canvas" }}
          style={{ width: "100%", height: "60vh", minHeight: 360 }}
        />
      </div>
    </>
  );
}