import { Title } from "@mantine/core";
import type { ECharts, EChartsOption } from "echarts";
import * as echarts from "echarts";
import * as React from "react";

export default function Test() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const chartRef = React.useRef<ECharts | null>(null);

  // サンプルデータ: [x, y, size, name]
  const data = React.useMemo<Array<[number, number, number, string]>>(
    () => [
      [10, 8, 20, "A"],
      [15, 18, 50, "B"],
      [20, 30, 80, "C"],
      [25, 10, 35, "D"],
      [32, 22, 60, "E"],
    ],
    [],
  );

  React.useEffect(() => {
    if (!ref.current || typeof window === "undefined") return;

    // 初期化（既にあれば再利用）
    const inst = echarts.getInstanceByDom(ref.current) ?? echarts.init(ref.current);
    chartRef.current = inst;

    const option: EChartsOption = {
      backgroundColor: "transparent",
      title: { text: "バブル散布図", left: "center" },
      tooltip: {
        trigger: "item",
        formatter: (param) => {
          if (Array.isArray(param)) return "";
          const [x, y, size, name] = param.value as [number, number, number, string];
          return `${name ?? "-"}<br/>X: ${x}<br/>Y: ${y}<br/>サイズ: ${size}`;
        },
      },
      grid: { left: 60, right: 60, top: 80, bottom: 60 },
      xAxis: { 
        type: "value", 
        name: "X軸", 
        splitLine: { show: true } 
      },
      yAxis: { 
        type: "value", 
        name: "Y軸", 
        splitLine: { show: true } 
      },
      visualMap: {
        // サイズ用の凡例
        show: true,
        right: 10,
        top: 80,
        dimension: 2, // value[2] を参照
        min: Math.min(...data.map((d) => d[2])),
        max: Math.max(...data.map((d) => d[2])),
        calculable: true,
        inRange: { color: ["#50a3ba", "#eac736", "#d94e5d"] }, // 色はデフォルト配色に任せる
        text: ["大", "小"],
      },
      series: [
        {
          type: "scatter",
          name: "バブル",
          data,
          symbolSize: (val) => {
            const v = (val as [number, number, number])[2];
            // 見やすいように平方根スケール＋下限
            return Math.max(8, Math.sqrt(v) * 3);
          },
          emphasis: { focus: "series" },
          label: {
            show: true,
            formatter: (p) => (p.value as [number, number, number, string])[3] ?? "",
          },
          animationDuration: 500,
        },
      ],
    };

    inst.setOption(option, true);

    // リサイズ対応
    const ro = new ResizeObserver(() => inst.resize());
    ro.observe(ref.current);

    return () => {
      ro.disconnect();
      inst.dispose();
      chartRef.current = null;
    };
  }, [data]);

  return (
    <>
      <Title order={2}>テストページ</Title>
      <div style={{ height: "100%", padding: 16 }}>
        <div
          ref={ref}
          style={{
            width: "100%",
            height: "60vh",
            minHeight: 360,
          }}
        />
      </div>
    </>
  );
}