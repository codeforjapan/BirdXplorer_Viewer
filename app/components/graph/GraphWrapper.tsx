import { ActionIcon, Box, Group, Select, Stack, Text, Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { MOBILE_BREAKPOINT } from "~/constants/breakpoints";
import Fa6RegularCalendar from "~icons/fa6-regular/calendar";
import Fa6SolidChevronDown from "~icons/fa6-solid/chevron-down";
import Fa6SolidCircleQuestion from "~icons/fa6-solid/circle-question";

import { PERIOD_OPTIONS } from "./periodConstants";

type PeriodOption = { value: string; label: string };

type GraphWrapperProps = {
  children: React.ReactNode;
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
  helpText,
  period = "1month",
  onPeriodChange,
  hidePeriodSelector = false,
  periodOptions,
  updatedAt,
}: GraphWrapperProps) => {
  // スマホ判定（640px以下）- SSR時はデスクトップ表示をデフォルトとする
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT) ?? false;

  const handlePeriodChange = (value: string | null) => {
    if (value && onPeriodChange) {
      onPeriodChange(value);
    }
  };

  return (
    <Box className="w-full">
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
          <Select
            allowDeselect={false}
            comboboxProps={{
              offset: 4,
              position: "bottom-end",
            }}
            data={periodOptions ?? PERIOD_OPTIONS}
            leftSection={<Fa6RegularCalendar className="size-4 text-primary" />}
            onChange={handlePeriodChange}
            rightSection={<Fa6SolidChevronDown className="size-3 text-white" />}
            styles={{
              root: {
                maxWidth: periodOptions ? "220px" : "135px",
              },
              dropdown: {
                backgroundColor: "var(--color-gray-1)",
                border: "1px solid var(--color-gray-2)",
                borderRadius: "8px",
              },
              input: {
                backgroundColor: "var(--color-gray-1)",
                border: "1px solid var(--color-gray-2)",
                borderRadius: "8px",
                color: "white",
                cursor: "pointer",
                fontSize: isMobile ? "12px" : "14px",
                height: isMobile ? "36px" : "40px",
                minWidth: periodOptions
                  ? isMobile
                    ? "180px"
                    : "200px"
                  : isMobile
                    ? "120px"
                    : "140px",
                paddingLeft: "36px",
                paddingRight: "12px",
              },
              option: {
                color: "white",
                fontSize: isMobile ? "12px" : "14px",
                padding: "8px 12px 8px 36px",
              },
              section: {
                color: "var(--color-primary)",
              },
            }}
            value={period}
            withCheckIcon={false}
          />
        )}
      </Group>

      {/* コンテンツ */}
      {children}
    </Box>
  );
};
