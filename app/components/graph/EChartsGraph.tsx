import { Loader, Stack, Text } from "@mantine/core";
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
  /** EChartsイベントハンドラ */
  onEvents?: Record<string, (params: unknown) => void>;
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
  onEvents,
}: EChartsGraphProps): React.ReactNode => {
  const [ReactECharts, setReactECharts] = useState<React.ComponentType<{
    option: EChartsOption;
    style?: React.CSSProperties;
    onEvents?: Record<string, (params: unknown) => void>;
  }> | null>(null);

  // クライアントサイドでのみecharts-for-reactをロード（SSR対策）
  useEffect(() => {
    const loadECharts = async () => {
      const mod = await import("echarts-for-react");
      setReactECharts(
        () =>
          mod.default as React.ComponentType<{
            option: EChartsOption;
            style?: React.CSSProperties;
            onEvents?: Record<string, (params: unknown) => void>;
          }>,
      );
    };
    void loadECharts();
  }, []);

  const fallback = loadingFallback ?? (
    <Stack
      align="center"
      justify="center"
      style={{
        height,
        minHeight,
        borderRadius: "8px",
        backgroundColor: "var(--color-gray-1)",
      }}
    >
      <Loader color="blue" size="md" />
      <Text c="dimmed" size="sm">
        グラフを読み込み中...
      </Text>
    </Stack>
  );

  if (!ReactECharts) {
    return fallback;
  }

  return (
    <ReactECharts
      onEvents={onEvents}
      option={option}
      style={{
        width: "100%",
        height,
        minHeight,
      }}
    />
  );
};
