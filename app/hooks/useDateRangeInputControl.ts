import type { FormValue } from "@conform-to/dom";
import { type FieldMetadata, useInputControl } from "@conform-to/react";
import type { DatePickerValue, DatesRangeValue } from "@mantine/dates";
import { useCallback, useMemo } from "react";

type DateRangeInputControlOptions = {
  fromField: FieldMetadata<string | number | null | undefined>;
  toField: FieldMetadata<string | number | null | undefined>;
  /**
   * DatePickerInput から送られてきた Date をフォームの文字列に変換する処理
   *
   * この処理は冪等である必要がある
   *
   * 空文字 or undefined を返すと、フォームの値が空になる
   */
  convertDateToString: (date: Date | null) => string | undefined;
  /**
   * フォームの文字列を DatePickerInput に渡す際に、Date に変換する処理
   *
   * この処理は冪等性がある必要がある
   */
  convertStringToDate: (
    formValue: FormValue<string | number | null | undefined>
  ) => Date | null;
};

type DateRangeInputControl = Omit<
  ReturnType<typeof useInputControl>,
  "change" | "value"
> & {
  change: (value: DatePickerValue<"range">) => void;
  value: DatesRangeValue;
};

/**
 * Conform を `<DatePickerInput type="range" />` と連携するためのフック
 */
export const useDateRangeInputControl = (
  options: DateRangeInputControlOptions
): DateRangeInputControl => {
  const { fromField, toField, convertDateToString, convertStringToDate } =
    options;

  const fromControl = useInputControl(fromField);
  const toControl = useInputControl(toField);

  const fromValue = useMemo(
    () => convertStringToDate(fromField.value),
    [fromField.value]
  );
  const toValue = useMemo(
    () => convertStringToDate(toField.value),
    [toField.value]
  );

  const change = useCallback(
    (dateRange: DatePickerValue<"range">) => {
      fromControl.change(convertDateToString(dateRange[0]) ?? "");
      toControl.change(convertDateToString(dateRange[1]) ?? "");
    },
    [fromControl, toControl]
  );

  const focus = useCallback(() => {
    fromControl.focus();
    toControl.focus();
  }, [fromControl, toControl]);

  const blur = useCallback(() => {
    fromControl.blur();
    toControl.blur();
  }, [fromControl, toControl]);

  return {
    blur,
    change,
    focus,
    value: [fromValue, toValue] satisfies DatesRangeValue,
  };
};
