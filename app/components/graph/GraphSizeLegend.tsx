import { Group, Text } from "@mantine/core";
import { useMemo } from "react";

type GraphSizeLegendProps = {
  /** ラベルテキスト（例: "インプレッション"） */
  label: string;
  /** 最小値 */
  min: number;
  /** 最大値 */
  max: number;
  /** 表示するステップ数（デフォルト: 5） */
  steps?: number;
  /** 値のフォーマット関数 */
  formatValue?: (value: number) => string;
  /** バブルの最小サイズ（px）（デフォルト: 8） */
  minBubbleSize?: number;
  /** バブルの最大サイズ（px）（デフォルト: 32） */
  maxBubbleSize?: number;
  /** バブルの色（デフォルト: "#666"） */
  bubbleColor?: string;
};

/** デフォルトの値フォーマット関数（カンマ区切り） */
const defaultFormatValue = (value: number): string => {
  return value.toLocaleString("ja-JP");
};

export const GraphSizeLegend = ({
  label,
  min,
  max,
  steps = 5,
  formatValue = defaultFormatValue,
  minBubbleSize = 8,
  maxBubbleSize = 32,
  bubbleColor = "#666",
}: GraphSizeLegendProps) => {
  /** ステップごとの値とサイズを計算 */
  const legendItems = useMemo(() => {
    const items: Array<{ value: number; size: number }> = [];

    for (let i = 0; i < steps; i++) {
      // 等間隔で値を計算
      const ratio = i / (steps - 1);
      const value = min + (max - min) * ratio;

      // サイズは面積に比例させるため、平方根でスケーリング
      const sizeRatio = Math.sqrt(ratio);
      const size = minBubbleSize + (maxBubbleSize - minBubbleSize) * sizeRatio;

      items.push({ value, size });
    }

    return items;
  }, [min, max, steps, minBubbleSize, maxBubbleSize]);

  return (
    <Group align="center" gap="lg">
      <Text fw={500} size="sm">
        {label}
      </Text>
      <Group align="flex-end" gap="md">
        {legendItems.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-1"
            style={{ minWidth: item.size }}
          >
            {/* バブル */}
            <div
              className="rounded-full"
              style={{
                width: item.size,
                height: item.size,
                backgroundColor: bubbleColor,
                opacity: 0.7,
              }}
            />
            {/* 値ラベル */}
            <Text c="dimmed" className="whitespace-nowrap" size="xs">
              {formatValue(Math.round(item.value))}
            </Text>
          </div>
        ))}
      </Group>
    </Group>
  );
};
