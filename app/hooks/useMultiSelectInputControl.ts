import type { FormValue } from "@conform-to/dom";
import { type FieldMetadata, useInputControl } from "@conform-to/react";
import { useCallback, useMemo } from "react";

type MultiSelectInputControlOptions = {
  field: FieldMetadata<Array<string | number> | null | undefined>;
  convertFormValueToMantine: (
    formValue: FormValue<Array<string | number> | null | undefined>
  ) => string[];
  convertMantineValueToForm: (
    mantineValue: string[]
  ) => string | string[] | undefined;
};

type MultiSelectInputControl = Omit<
  ReturnType<typeof useInputControl>,
  "change" | "value"
> & {
  change: (value: string[]) => void;
  value: string[];
};

export const useMultiSelectInputControl = (
  options: MultiSelectInputControlOptions
): MultiSelectInputControl => {
  const { field, convertFormValueToMantine, convertMantineValueToForm } =
    options;

  const control = useInputControl(field);

  const value = useMemo(
    () => convertFormValueToMantine(field.value),
    [field.value]
  );

  const change = useCallback(
    (value: string[]) => {
      control.change(convertMantineValueToForm(value) ?? "");
    },
    [control]
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
