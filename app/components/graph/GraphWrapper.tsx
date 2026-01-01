import {
  ActionIcon,
  Box,
  Group,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { PeriodSelector } from "~/components/period-selector/PeriodSelector";
import { MOBILE_BREAKPOINT } from "~/constants/breakpoints";
import Fa6SolidCircleQuestion from "~icons/fa6-solid/circle-question";

type PeriodOption = { value: string; label: string };

type GraphWrapperProps = {
  children: React.ReactNode;
  /** コンテナのクラス名 */
  className?: string;
  /** ヘルプアイコンのツールチップテキスト */
  helpText?: string;
  hidePeriodSelector?: boolean;
  onPeriodChange?: (value: string) => void;
  period?: string;
  /** カスタム期間オプション（指定しない場合はデフォルトのPERIOD_OPTIONSを使用） */
  periodOptions?: PeriodOption[];
  title: string;
  /** 更新日表示（例: "2025年10月13日更新"） */
  updatedAt?: string;
};

/**
 * グラフやランキングなどをラップする汎用コンテナー
 * - タイトルを左側に表示
 * - 期間選択ドロップダウンを右側に表示（オプション）
 */
export const GraphWrapper = ({
  title,
  children,
  className,
  helpText,
  period = "1month",
  onPeriodChange,
  hidePeriodSelector = false,
  periodOptions,
  updatedAt,
}: GraphWrapperProps) => {
  // スマホ判定（640px以下）- SSR時はデスクトップ表示をデフォルトとする
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT) ?? false;

  return (
    <Box className={`w-full ${className ?? ""}`}>
      {/* ヘッダー: タイトル + 期間選択 */}
      <Group
        align="flex-start"
        className={isMobile ? "mb-3" : "mb-4"}
        justify="space-between"
        wrap="nowrap"
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
          {updatedAt && (
            <Text c="dimmed" size="sm">
              {updatedAt}
            </Text>
          )}
        </Stack>

        {!hidePeriodSelector && (
          <PeriodSelector
            onChange={onPeriodChange}
            periodOptions={periodOptions}
            value={period}
          />
        )}
      </Group>

      {/* コンテンツ */}
      {children}
    </Box>
  );
};
