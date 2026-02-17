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
};

export const DateRangePicker = ({
  disabled,
  toField,
  fromField,
  label,
  valueFormat,
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
      label={label}
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
        levelsGroup: {
          backgroundColor: "var(--color-gray-1)",
        },
        calendarHeader: {
          backgroundColor: "var(--color-gray-1)",
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
        monthsListCell: {
          backgroundColor: "var(--color-gray-1)",
        },
        yearsList: {
          backgroundColor: "var(--color-gray-1)",
        },
        yearsListCell: {
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
        yearsListControl: {
          color: "white",
          "&:hover": {
            backgroundColor: "var(--color-gray-2)",
          },
          "&[data-selected]": {
            backgroundColor: "var(--color-primary)",
            color: "white",
          },
        },
        monthsListControl: {
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
      valueFormat={valueFormat}
    />
  );
};
