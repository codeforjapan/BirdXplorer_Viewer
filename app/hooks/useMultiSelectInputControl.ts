import type { FormValue } from "@conform-to/dom";
import { type FieldMetadata, useInputControl } from "@conform-to/react";
import { useCallback, useMemo } from "react";

type MultiSelectInputControlOptions<T extends string[] | number[]> = {
  field: FieldMetadata<T | null | undefined>;
  convertFormValueToMantine: (
    formValue: FormValue<T | null | undefined>,
  ) => string[];
  convertMantineValueToForm: (
    mantineValue: string[],
  ) => FormValue<T | null | undefined>;
};

type MultiSelectInputControl = Omit<
  ReturnType<typeof useInputControl>,
  "change" | "value"
> & {
  change: (value: string[]) => void;
  value: string[];
};

/**
 * Mantine の MultiSelect と連携するための制御ロジックを提供する
 * @returns
 * MultiSelect の制御ロジック。そのままコンポーネントに渡すと壊れるので、スプレッド代入して名前を変更して使う。
 * 必ず分割して名前を変更して使う必要がある。
 * @example
 * ```ts
 * const {
 *  value: selectedValues,
 *  change: onSelectedValuesChange,
 *  focus: onSelectedValuesFocus,
 *  blur: onSelectedValuesBlur,
 * } = useMultiSelectInputControl({
 *  ...
 * });
 * ```
 */
export const useMultiSelectInputControl = <T extends string[] | number[]>({
  field,
  convertFormValueToMantine,
  convertMantineValueToForm,
}: MultiSelectInputControlOptions<T>): MultiSelectInputControl => {
  const control = useInputControl(field);

  const value = useMemo(
    () => convertFormValueToMantine(field.value),
    [field.value],
  );

  const change = useCallback(
    (value: string[]) => {
      const processed = convertMantineValueToForm(value);

      if (Array.isArray(processed)) {
        if (processed.length === 0) {
          control.change("");
          return;
        }
        control.change(processed.filter((v) => v != null));
        return;
      }

      control.change(processed ?? "");
    },
    [control],
  );

  const focus = useCallback(() => {
    control.focus();
  }, [control]);

  const blur = useCallback(() => {
    control.blur();
  }, [control]);

  return {
    value,
    change,
    focus,
    blur,
  };
};
