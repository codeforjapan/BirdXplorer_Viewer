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
