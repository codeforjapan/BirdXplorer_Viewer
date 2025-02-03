import { type FieldMetadata, useInputControl } from "@conform-to/react";
import { useCallback, useMemo } from "react";

type MultiSelectInputControlOptions = {
  field: FieldMetadata<string[] | null | undefined>;
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
  const { field } = options;

  const control = useInputControl(field);

  const value = useMemo(() => {
    return Array.isArray(field.value)
      ? field.value.filter((v) => v != null)
      : field.value
      ? [field.value]
      : [];
  }, [field.value]);

  const change = useCallback(
    (value: string[]) => {
      control.change(value.length > 0 ? value : "");
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
