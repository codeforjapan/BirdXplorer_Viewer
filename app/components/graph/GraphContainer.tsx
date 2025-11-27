import { Box, Divider, Text } from "@mantine/core";
import type { EChartsOption } from "echarts";
import { useEffect, useState } from "react";

type GraphContainerProps = {
  /** EChartsのオプション設定 */
  option: EChartsOption;
  /** 下部に配置するコントロール（フィルターなど） */
  footer?: React.ReactNode;
  /** グラフの高さ（デフォルト: 60vh） */
  height?: string | number;
  /** グラフの最小高さ（デフォルト: 360px） */
  minHeight?: number;
  /** ローディング中の表示 */
  loadingFallback?: React.ReactNode;
};

export const GraphContainer = ({
  option,
  footer,
  height = "60vh",
  minHeight = 360,
  loadingFallback,
}: GraphContainerProps) => {
  const [ReactECharts, setReactECharts] = useState<React.ComponentType<{
    option: EChartsOption;
    style?: React.CSSProperties;
  }> | null>(null);

  // クライアントサイドでのみecharts-for-reactをロード（SSR対策）
  useEffect(() => {
    import("echarts-for-react").then((mod) => {
      setReactECharts(() => mod.default);
    });
  }, []);

  const fallback = loadingFallback ?? (
    <div
      className="flex items-center justify-center"
      style={{ height, minHeight }}
    >
      <Text c="dimmed">読み込み中...</Text>
    </div>
  );

  return (
    <Box
      className="w-full overflow-hidden"
      style={{
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "12px",
        backgroundColor: "#111111",
      }}
    >
      {/* グラフ本体 */}
      <div className="p-4">
        {ReactECharts ? (
          <ReactECharts
            option={option}
            style={{
              width: "100%",
              height,
              minHeight,
            }}
          />
        ) : (
          fallback
        )}
      </div>

      {/* フッター: フィルターコントロールなど */}
      {footer && (
        <>
          <Divider color="rgba(255, 255, 255, 0.2)" />
          <div className="px-6 py-4" style={{ backgroundColor: "#000000" }}>
            {footer}
          </div>
        </>
      )}
    </Box>
  );
};
