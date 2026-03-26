import { DatePickerInput } from "@mantine/dates";

import { FormError } from "~/components/FormError";
import { useDateRangeInputControl } from "~/hooks/useDateRangeInputControl";
import { containsNonNullValues } from "~/utils/array";

type DateRangePickerProps = Parameters<typeof useDateRangeInputControl>[0] & {
  disabled?: boolean;
  label: string;
  /**
   * 入力した値を表示する際のフォーマット
   *
   * @default "YYYY.MM.DD (ddd)"
   *
   * @see {@link https://day.js.org/docs/en/display/format Day.js のフォーマット仕様}
   */
  valueFormat?: string;
  /**
   * 選択できる日付範囲の最大日数
   *
   * @default 30
   */
  maxRange?: number;
};

export const DateRangePicker = ({
  disabled,
  toField,
  fromField,
  label,
  valueFormat,
  maxRange = 30,
  convertMantineValueToForm,
  convertFormValueToMantine,
}: DateRangePickerProps) => {
  valueFormat ??= "YYYY.MM.DD (ddd)";

  const {
    value,
    change: onChange,
    focus: onFocus,
    blur: onBlur,
  } = useDateRangeInputControl({
    fromField,
    toField,
    convertMantineValueToForm,
    convertFormValueToMantine,
  });

  const getDayProps = (date: Date) => {
    const [from, to] = value ?? [null, null];
    if (from && !to) {
      const diffMs = date.getTime() - from.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays > maxRange || diffDays < -maxRange) {
        return { disabled: true };
      }
    }
    return {};
  };

  return (
    <DatePickerInput
      c="white"
      classNames={{ input: "!bg-gray-1 !border-gray-5" }}
      clearable
      disabled={disabled}
      error={
        containsNonNullValues(fromField.errors, toField.errors) && (
          <FormError errors={[fromField.errors, toField.errors]} />
        )
      }
      errorProps={{ component: "div" }}
      getDayProps={getDayProps}
      label={label}
      maxDate={new Date()}
      onBlur={onBlur}
      onChange={onChange}
      onFocus={onFocus}
      styles={{
        input: {
          color: "white",
        },
        label: {
          marginBottom: "8px",
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
          color: "white",
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
          color: "white",
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
          color: "white",
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
      valueFormat={valueFormat}
    />
  );
};
