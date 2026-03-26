import { type FieldMetadata, getSelectProps } from "@conform-to/react";
import { Select } from "@mantine/core";
import { useMemo } from "react";

import { FormError } from "~/components/FormError";
import { containsNonNullValues } from "~/utils/array";

type LanguageSelectProps = {
  disabled?: boolean;
  field: FieldMetadata;
  label: string;
  /**
   * key: 言語の識別子, value: 言語の表示名
   */
  languages: Record<string, string>;
};

export const LanguageSelect = ({
  field,
  disabled,
  label,
  languages,
}: LanguageSelectProps) => {
  const languageData = useMemo(
    () =>
      Object.entries(languages).map(([id, label]) => ({
        value: id,
        label,
      })),
    [languages],
  );

  return (
    <Select
      autoComplete="off"
      c="white"
      classNames={{ input: "!bg-gray-1 !border-gray-5" }}
      data={languageData}
      data-1p-ignore
      disabled={disabled}
      error={
        containsNonNullValues(field.errors) && (
          <FormError errors={[field.errors]} />
        )
      }
      errorProps={{ component: "div" }}
      label={label}
      searchable
      styles={{
        input: {
          color: "white",
        },
        label: {
          marginBottom: "8px",
        },
      }}
      {...(getSelectProps(field) as Omit<
        ReturnType<typeof getSelectProps>,
        "defaultValue"
      > & {
        defaultValue: Exclude<
          ReturnType<typeof getSelectProps>["defaultValue"],
          number | readonly string[]
        >;
      })}
    />
  );
};
