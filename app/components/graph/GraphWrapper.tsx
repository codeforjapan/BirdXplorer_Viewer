import { Box, Group, Select, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { MOBILE_BREAKPOINT } from "~/constants/breakpoints";
import Fa6RegularCalendar from "~icons/fa6-regular/calendar";

import type { PeriodValue } from "./periodConstants";
import { PERIOD_OPTIONS } from "./periodConstants";

type GraphWrapperProps = {
  /** ラップするコンテンツ（グラフ、ランキングなど） */
  children: React.ReactNode;
  /** 期間選択を非表示にする場合はtrue */
  hidePeriodSelector?: boolean;
  /** 期間変更時のコールバック */
  onPeriodChange?: (value: PeriodValue) => void;
  /** 選択中の期間 */
  period?: PeriodValue;
  /** コンポーネントのタイトル */
  title: string;
};

/**
 * グラフやランキングなどをラップする汎用コンテナー
 * - タイトルを左側に表示
 * - 期間選択ドロップダウンを右側に表示（オプション）
 */
export const GraphWrapper = ({
  title,
  children,
  period = "1month",
  onPeriodChange,
  hidePeriodSelector = false,
}: GraphWrapperProps) => {
  // スマホ判定（640px以下）- SSR時はデスクトップ表示をデフォルトとする
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT) ?? false;

  const handlePeriodChange = (value: string | null) => {
    if (value && onPeriodChange) {
      onPeriodChange(value as PeriodValue);
    }
  };

  return (
    <Box className="w-full">
      {/* ヘッダー: タイトル + 期間選択 */}
      <Group
        align="center"
        className={isMobile ? "mb-3" : "mb-4"}
        justify="space-between"
        wrap="nowrap"
      >
        <Text
          c="white"
          className={isMobile ? "text-heading-l" : "text-heading-xl"}
          component="h2"
        >
          {title}
        </Text>

        {!hidePeriodSelector && (
          <Select
            allowDeselect={false}
            comboboxProps={{
              offset: 4,
              position: "bottom-end",
            }}
            data={PERIOD_OPTIONS}
            leftSection={<Fa6RegularCalendar className="size-4" />}
            onChange={handlePeriodChange}
            rightSection={null}
            styles={{
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
                minWidth: isMobile ? "120px" : "140px",
                paddingLeft: "36px",
                paddingRight: "12px",
              },
              option: {
                color: "white",
                fontSize: isMobile ? "12px" : "14px",
                padding: "8px 12px",
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

