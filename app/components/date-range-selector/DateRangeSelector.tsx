import "dayjs/locale/ja";

import { DatePickerInput, DatesProvider } from "@mantine/dates";
import { useMediaQuery } from "@mantine/hooks";
import dayjs from "dayjs";
import { useMemo } from "react";

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
  /** 選択可能な最大日数幅（開始日からの日数） */
  maxRangeDays?: number;
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
  maxRangeDays,
}: DateRangeSelectorProps) => {
  // スマホ判定（640px以下）- SSR時はデスクトップ表示をデフォルトとする
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT) ?? false;

  // 開始日が選択済みかつ終了日が未選択のとき、maxRangeDays に基づいて最大日付を制限する
  const effectiveMaxDate = useMemo(() => {
    if (!maxRangeDays || !value?.[0] || value[1]) return maxDate;
    const rangeLimit = dayjs(value[0]).add(maxRangeDays, "day").toDate();
    if (!maxDate) return rangeLimit;
    return rangeLimit < maxDate ? rangeLimit : maxDate;
  }, [maxRangeDays, value, maxDate]);

  return (
    <DatesProvider settings={{ locale: "ja" }}>
      <DatePickerInput
        allowSingleDateInRange
        clearable
        leftSection={<Fa6RegularCalendar className="size-4 text-primary" />}
        maxDate={effectiveMaxDate}
        minDate={minDate}
        onChange={onChange}
        placeholder={placeholder}
        popoverProps={{
          styles: {
            dropdown: {
              backgroundColor: "var(--color-gray-1)",
              border: "1px solid var(--color-gray-2)",
              borderRadius: "8px",
            },
          },
        }}
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
          calendarHeader: {
            backgroundColor: "var(--color-gray-1)",
            color: "white",
          },
          calendarHeaderControl: {
            color: "white",
          },
          calendarHeaderLevel: {
            color: "white",
          },
          levelsGroup: {
            backgroundColor: "var(--color-gray-1)",
          },
          month: {
            backgroundColor: "var(--color-gray-1)",
          },
          monthCell: {
            "color": "white",
            "&[data-selected]": {
              backgroundColor: "var(--color-primary)",
              color: "white",
            },
          },
          monthsList: {
            backgroundColor: "var(--color-gray-1)",
          },
          monthsListCell: {
            backgroundColor: "var(--color-gray-1)",
          },
          monthsListControl: {
            "color": "white",
            "&[data-selected]": {
              backgroundColor: "var(--color-primary)",
              color: "white",
            },
          },
          yearsList: {
            backgroundColor: "var(--color-gray-1)",
          },
          yearsListCell: {
            backgroundColor: "var(--color-gray-1)",
          },
          yearsListControl: {
            "color": "white",
            "&[data-selected]": {
              backgroundColor: "var(--color-primary)",
              color: "white",
            },
          },
          day: {
            "color": "white",
            "&[data-selected]": {
              backgroundColor: "var(--color-primary)",
              color: "white",
            },
            "&[data-in-range]": {
              backgroundColor:
                "color-mix(in srgb, var(--color-primary) 20%, transparent)",
              color: "white",
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
