import {
  ActionIcon,
  Box,
  Group,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import type { DateRange } from "~/components/date-range-selector";
import { DateRangeSelector } from "~/components/date-range-selector";
import { PeriodSelector } from "~/components/period-selector/PeriodSelector";
import { MOBILE_BREAKPOINT } from "~/constants/breakpoints";
import { formatUpdatedAt } from "~/utils/date";
import Fa6SolidCircleQuestion from "~icons/fa6-solid/circle-question";

import type { PeriodOption } from "./types";

type GraphWrapperProps<T extends string = string> = {
  children: React.ReactNode;
  /** コンテナのクラス名 */
  className?: string;
  /** ヘルプアイコンのツールチップテキスト */
  helpText?: string;
  /** DateRangeSelectorを使う場合の日付範囲 */
  dateRange?: DateRange;
  /** DateRangeSelectorの変更コールバック */
  onDateRangeChange?: (value: DateRange) => void;
  /** PeriodSelectorを使う場合の期間値（後方互換性のため） */
  onPeriodChange?: (value: T) => void;
  period?: T;
  /** カスタム期間オプション */
  periodOptions?: Array<PeriodOption<T>>;
  title: string;
  /** 更新日（YYYY-MM-DD形式または表示済み文字列） */
  updatedAt?: string;
};

/**
 * グラフやランキングなどをラップする汎用コンテナー
 * - タイトルを左側に表示
 * - 期間選択（DateRangeSelectorまたはPeriodSelector）を右側に表示（オプション）
 */
export const GraphWrapper = <T extends string = string,>({
  title,
  children,
  className,
  helpText,
  dateRange,
  onDateRangeChange,
  period,
  onPeriodChange,
  periodOptions,
  updatedAt,
}: GraphWrapperProps<T>) => {
  // スマホ判定（640px以下）- SSR時はデスクトップ表示をデフォルトとする
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT) ?? false;
  const displayUpdatedAt =
    updatedAt && /^\d{4}-\d{2}-\d{2}$/.test(updatedAt)
      ? formatUpdatedAt(updatedAt)
      : updatedAt;

  // DateRangeSelectorを使用するかどうか
  const shouldShowDateRangeSelector = Boolean(dateRange && onDateRangeChange);
  // PeriodSelectorを使用するかどうか（後方互換性のため）
  const shouldShowPeriodSelector = Boolean(period && periodOptions?.length);

  return (
    <Box className={`w-full ${className ?? ""}`}>
      {/* ヘッダー: タイトル + 期間選択 */}
      <Group
        align="flex-start"
        className={isMobile ? "mb-3" : "mb-4"}
        justify="space-between"
        wrap={isMobile ? "wrap" : "nowrap"}
      >
        <Stack gap={4}>
          <Group align="center" gap="xs">
            <Text
              c="white"
              className={isMobile ? "text-heading-l" : "text-heading-xl"}
              component="h2"
            >
              {title}
            </Text>
            {helpText && (
              <Tooltip
                label={helpText}
                multiline
                position="top"
                w={300}
                withArrow
              >
                <ActionIcon
                  aria-label="ヘルプ"
                  radius="xl"
                  size="sm"
                  variant="transparent"
                >
                  <Fa6SolidCircleQuestion className="size-4 text-primary" />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
          {displayUpdatedAt && (
            <Text c="dimmed" size="sm">
              {displayUpdatedAt}
            </Text>
          )}
        </Stack>

        {/* DateRangeSelectorまたはPeriodSelectorを表示 */}
        {shouldShowDateRangeSelector ? (
          <DateRangeSelector onChange={onDateRangeChange} value={dateRange} />
        ) : shouldShowPeriodSelector ? (
          <PeriodSelector
            onChange={onPeriodChange}
            periodOptions={periodOptions}
            value={period}
          />
        ) : null}
      </Group>

      {/* コンテンツ */}
      {children}
    </Box>
  );
};
