import { Select } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { MOBILE_BREAKPOINT } from "~/constants/breakpoints";
import Fa6RegularCalendar from "~icons/fa6-regular/calendar";
import Fa6SolidChevronDown from "~icons/fa6-solid/chevron-down";

type PeriodOption<T extends string = string> = { value: T; label: string };

type PeriodValue = "1week" | "1month" | "3months" | "6months" | "1year";

export const PERIOD_OPTIONS: Array<{ value: PeriodValue; label: string }> = [
  { value: "1week", label: "直近1週間" },
  { value: "1month", label: "直近1ヶ月" },
  { value: "3months", label: "直近3ヶ月" },
  { value: "6months", label: "直近6ヶ月" },
  { value: "1year", label: "直近1年" },
];

export type PeriodSelectorProps<T extends string = string> = {
  /** 現在選択されている期間 */
  value?: T;
  /** 期間が変更されたときのコールバック */
  onChange?: (value: T) => void;
  /** 期間オプション（指定しない場合はデフォルトのPERIOD_OPTIONSを使用） */
  periodOptions?: PeriodOption<T>[];
};

/**
 * 期間選択セレクタ
 * - グラフやランキングなどで使用する期間選択UI
 * - モバイル対応
 * - カスタム期間オプション対応
 */
export const PeriodSelector = <T extends string = string,>({
  value,
  onChange,
  periodOptions,
}: PeriodSelectorProps<T>) => {
  // スマホ判定（640px以下）- SSR時はデスクトップ表示をデフォルトとする
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT) ?? false;

  const handleChange = (newValue: string | null) => {
    if (newValue && onChange) {
      onChange(newValue as T);
    }
  };

  return (
    <Select
      allowDeselect={false}
      comboboxProps={{
        offset: 4,
        position: "bottom-end",
      }}
      data={periodOptions ?? PERIOD_OPTIONS}
      leftSection={<Fa6RegularCalendar className="size-4 text-primary" />}
      onChange={handleChange}
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
      value={value}
      withCheckIcon={false}
    />
  );
};
