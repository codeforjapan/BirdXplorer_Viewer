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
      type="range"
      value={value}
      valueFormat={valueFormat}
    />
  );
};
