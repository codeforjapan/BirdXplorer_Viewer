import { DatePickerInput, DatesProvider } from "@mantine/dates";
import { useMediaQuery } from "@mantine/hooks";
import "dayjs/locale/ja";

import { MOBILE_BREAKPOINT } from "~/constants/breakpoints";
import Fa6RegularCalendar from "~icons/fa6-regular/calendar";

export type DateRange = [Date | null, Date | null];

export type DateRangeSelectorProps = {
  /** 現在選択されている日付範囲 */
  value?: DateRange;
  /** 日付範囲が変更されたときのコールバック */
  onChange?: (value: DateRange) => void;
  /** プレースホルダーテキスト */
  placeholder?: string;
  /** 選択可能な最小日付 */
  minDate?: Date;
  /** 選択可能な最大日付 */
  maxDate?: Date;
};

/**
 * 日付範囲選択コンポーネント
 * - グラフの期間指定で使用
 * - モバイル対応
 * - 日本語表示
 */
export const DateRangeSelector = ({
  value,
  onChange,
  placeholder = "期間を選択",
  minDate,
  maxDate,
}: DateRangeSelectorProps) => {
  // スマホ判定（640px以下）- SSR時はデスクトップ表示をデフォルトとする
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT) ?? false;

  return (
    <DatesProvider settings={{ locale: "ja" }}>
      <DatePickerInput
        allowSingleDateInRange
        clearable
        leftSection={<Fa6RegularCalendar className="size-4 text-primary" />}
        maxDate={maxDate}
        minDate={minDate}
        onChange={onChange}
        placeholder={placeholder}
        styles={{
          root: {
            maxWidth: "280px",
          },
          input: {
            backgroundColor: "var(--color-gray-1)",
            border: "1px solid var(--color-gray-2)",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer",
            fontSize: isMobile ? "12px" : "14px",
            height: isMobile ? "36px" : "40px",
            minWidth: isMobile ? "220px" : "260px",
            paddingLeft: "36px",
            paddingRight: "12px",
          },
          dropdown: {
            backgroundColor: "var(--color-gray-1)",
            border: "1px solid var(--color-gray-2)",
            borderRadius: "8px",
          },
          calendar: {
            backgroundColor: "var(--color-gray-1)",
          },
          calendarHeader: {
            color: "white",
          },
          calendarHeaderControl: {
            color: "white",
            "&:hover": {
              backgroundColor: "var(--color-gray-2)",
            },
          },
          calendarHeaderLevel: {
            color: "white",
            "&:hover": {
              backgroundColor: "var(--color-gray-2)",
            },
          },
          monthsList: {
            backgroundColor: "var(--color-gray-1)",
          },
          yearsList: {
            backgroundColor: "var(--color-gray-1)",
          },
          month: {
            backgroundColor: "var(--color-gray-1)",
          },
          monthCell: {
            color: "white",
            "&:hover": {
              backgroundColor: "var(--color-gray-2)",
            },
            "&[data-selected]": {
              backgroundColor: "var(--color-primary)",
              color: "white",
            },
          },
          yearCell: {
            color: "white",
            "&:hover": {
              backgroundColor: "var(--color-gray-2)",
            },
            "&[data-selected]": {
              backgroundColor: "var(--color-primary)",
              color: "white",
            },
          },
          day: {
            color: "white",
            "&[data-selected]": {
              backgroundColor: "var(--color-primary)",
              color: "white",
            },
            "&[data-in-range]": {
              backgroundColor: "rgba(var(--color-primary-rgb), 0.2)",
              color: "white",
            },
            "&:hover": {
              backgroundColor: "var(--color-gray-2)",
            },
            "&[data-outside]": {
              color: "var(--color-gray-4)",
            },
          },
          weekday: {
            color: "var(--color-gray-4)",
          },
        }}
        type="range"
        value={value}
        valueFormat="YYYY/MM/DD"
      />
    </DatesProvider>
  );
};
