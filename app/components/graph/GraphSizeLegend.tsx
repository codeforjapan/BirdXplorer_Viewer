import { Group, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useMemo } from "react";

import { MOBILE_BREAKPOINT } from "~/constants/breakpoints";

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

/**
 * きれいなステップ間隔を計算
 */
const getNiceStepSize = (range: number, steps: number): number => {
  const rawStep = range / (steps - 1);
  if (rawStep === 0) return 1;

  const exponent = Math.floor(Math.log10(rawStep));
  const magnitude = Math.pow(10, exponent);
  const normalized = rawStep / magnitude;

  // 1, 2, 5, 10 のいずれかに丸める
  let niceStep: number;
  if (normalized <= 1) niceStep = 1;
  else if (normalized <= 2) niceStep = 2;
  else if (normalized <= 5) niceStep = 5;
  else niceStep = 10;

  return niceStep * magnitude;
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
  // スマホ判定（640px以下）- SSR時はデスクトップ表示をデフォルトとする
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT) ?? false;

  /**
   * ステップごとの値とサイズを計算
   * - 最小値と最大値は実データの値を使用
   * - 中間のステップはきれいな数値（切りの良い数値）で分割
   */
  const legendItems = useMemo(() => {
    // steps が2未満の場合は最小1つのアイテムを表示
    const effectiveSteps = Math.max(2, steps);
    const items: Array<{ value: number; size: number }> = [];

    // min === max の場合は中央サイズで1つだけ表示
    if (min === max) {
      const middleSize = (minBubbleSize + maxBubbleSize) / 2;
      return [{ value: min, size: middleSize }];
    }

    const range = max - min;

    const stepSize = getNiceStepSize(range, effectiveSteps);
    const firstNiceValue = Math.ceil(min / stepSize) * stepSize;

    const middleValues: number[] = [];
    let currentValue = firstNiceValue;
    while (currentValue < max) {
      middleValues.push(currentValue);
      currentValue += stepSize;
    }

    items.push({
      value: min,
      size: minBubbleSize,
    });

    // min と max で2枠使うため、中間値は最大 steps - 2 個
    const maxMiddleSteps = effectiveSteps - 2;
    const middleToUse =
      middleValues.length <= maxMiddleSteps
        ? middleValues
        : middleValues.filter((_, i) => {
            const interval = Math.ceil(middleValues.length / maxMiddleSteps);
            return i % interval === 0;
          }).slice(0, maxMiddleSteps);

    for (const value of middleToUse) {
      const ratio = (value - min) / range;
      const sizeRatio = Math.sqrt(ratio);
      const size = minBubbleSize + (maxBubbleSize - minBubbleSize) * sizeRatio;
      items.push({ value, size });
    }

    items.push({
      value: max,
      size: maxBubbleSize,
    });

    return items;
  }, [min, max, steps, minBubbleSize, maxBubbleSize]);

  const bubbleItems = (
    <Group align="flex-end" gap="md">
      {legendItems.map((item) => (
        <div
          className="flex flex-col items-center gap-1"
          key={`legend-${item.value}`}
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
          <Text c="gray.4" className="whitespace-nowrap" size="xs">
            {formatValue(Math.round(item.value))}
          </Text>
        </div>
      ))}
    </Group>
  );

  // スマホ: 縦並び、デスクトップ: 横並び
  if (isMobile) {
    return (
      <Stack gap="sm">
        <Text c="white" fw={700} size="md">
          {label}
        </Text>
        {bubbleItems}
      </Stack>
    );
  }

  return (
    <Group align="center" gap="lg">
      <Text c="white" fw={700} size="md">
        {label}
      </Text>
      {bubbleItems}
    </Group>
  );
};
