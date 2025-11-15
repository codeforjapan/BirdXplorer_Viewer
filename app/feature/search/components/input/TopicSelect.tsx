import type { FieldMetadata } from "@conform-to/react";
import { getSelectProps } from "@conform-to/react";
import { MultiSelect } from "@mantine/core";
import { useMemo } from "react";

import { FormError } from "~/components/FormError";
import type { Topic } from "~/generated/api/schemas";
import { useMultiSelectInputControl } from "~/hooks/useMultiSelectInputControl";
import { containsNonNullValues } from "~/utils/array";

type TopicSelectProps = {
  disabled?: boolean;
  field: FieldMetadata;
  topics: Topic[];
  currentLanguage: string;
};

export const TopicSelect = ({
  disabled,
  field,
  topics,
  currentLanguage,
}: TopicSelectProps) => {
  const {
    value,
    change: onChange,
    blur: onBlur,
    focus: onFocus,
  } = useMultiSelectInputControl({
    // @ts-expect-error FieldMetadata の型が複雑すぎて型を合わせるのが難しい
    field,
    convertFormValueToMantine(formValue) {
      if (formValue == null) {
        return [];
      }
      if (typeof formValue === "string") {
        return formValue.split(",");
      }
      return formValue.filter((v) => v != null);
    },
    convertMantineValueToForm(mantineValue) {
      return mantineValue.length > 0 ? mantineValue : [];
    },
  });

  const topicsData = useMemo(
    () =>
      topics
        .map((t) => ({
          value: t.topicId.toString(),
          label: t.label[currentLanguage] ?? t.topicId.toString(),
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [topics, currentLanguage],
  );

  // 制御コンポーネントなので defaultValue は捨てる
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { defaultValue, ...rest } = getSelectProps(field, {
    value: false,
  });

  return (
    <MultiSelect
      data={topicsData}
      disabled={disabled}
      error={
        containsNonNullValues(field.errors) && (
          <FormError errors={[field.errors]} />
        )
      }
      errorProps={{ component: "div", id: field.errorId }}
      label="トピック"
      labelProps={{ htmlFor: field.id }}
      onBlur={onBlur}
      onChange={onChange}
      onFocus={onFocus}
      searchable
      value={value}
      {...rest}
    />
  );
};
