import { Text } from "@mantine/core";
import type { EChartsOption } from "echarts";
import { useEffect, useState } from "react";

type EChartsGraphProps = {
  /** EChartsのオプション設定 */
  option: EChartsOption;
  /** グラフの高さ（デフォルト: 60vh） */
  height?: string | number;
  /** グラフの最小高さ（デフォルト: 360px） */
  minHeight?: number;
  /** ローディング中の表示 */
  loadingFallback?: React.ReactNode;
};

/**
 * EChartsグラフ描画コンポーネント
 * - SSR対策でecharts-for-reactを動的インポート
 * - GraphContainerのchildrenとして使用
 */
export const EChartsGraph = ({
  option,
  height = "60vh",
  minHeight = 360,
  loadingFallback,
}: EChartsGraphProps): React.ReactNode => {
  const [ReactECharts, setReactECharts] = useState<React.ComponentType<{
    option: EChartsOption;
    style?: React.CSSProperties;
  }> | null>(null);

  // クライアントサイドでのみecharts-for-reactをロード（SSR対策）
  useEffect(() => {
    const loadECharts = async () => {
      const mod = await import("echarts-for-react");
      setReactECharts(() => mod.default);
    };
    void loadECharts();
  }, []);

  const fallback = loadingFallback ?? (
    <div
      className="flex items-center justify-center"
      style={{ height, minHeight }}
    >
      <Text c="dimmed">読み込み中...</Text>
    </div>
  );

  if (!ReactECharts) {
    return fallback;
  }

  return (
    <ReactECharts
      option={option}
      style={{
        width: "100%",
        height,
        minHeight,
      }}
    />
  );
};

