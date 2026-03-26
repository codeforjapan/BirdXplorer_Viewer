import { Select } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { DEFAULT_PERIOD_OPTIONS } from "~/components/graph/constants";
import { MOBILE_BREAKPOINT } from "~/constants/breakpoints";
import Fa6RegularCalendar from "~icons/fa6-regular/calendar";
import Fa6SolidChevronDown from "~icons/fa6-solid/chevron-down";

type PeriodOption<T extends string = string> = { value: T; label: string };

export type PeriodSelectorProps<T extends string = string> = {
  /** 現在選択されている期間 */
  value?: T;
  /** 期間が変更されたときのコールバック */
  onChange?: (value: T) => void;
  /** 期間オプション（指定しない場合はデフォルトのPERIOD_OPTIONSを使用） */
  periodOptions?: Array<PeriodOption<T>>;
};

/**
 * 期間選択セレクタ
 * - グラフやランキングなどで使用する期間選択UI
 * - モバイル対応
 * - カスタム期間オプション対応
 */
export const PeriodSelector = <T extends string = string>({
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
      data={periodOptions ?? DEFAULT_PERIOD_OPTIONS}
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
