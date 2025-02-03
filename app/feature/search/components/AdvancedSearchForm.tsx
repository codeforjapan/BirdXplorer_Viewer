import {
  getFormProps,
  getInputProps,
  getSelectProps,
  type SubmissionResult,
} from "@conform-to/react";
import {
  Group,
  MultiSelect,
  NativeSelect,
  Stack,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Form, useNavigation } from "@remix-run/react";

import { FormError } from "../../../components/FormError";
import { SubmitButton } from "../../../components/SubmitButton";
import type { Topic } from "../../../generated/api/schemas";
import { useDateRangeInputControl } from "../../../hooks/useDateRangeInputControl";
import { useLanguage } from "../../../hooks/useLanguatge";
import { useMultiSelectInputControl } from "../../../hooks/useMultiSelectInputControl";
import { arrayContainsNonNullItem } from "../../../utils/array";
import { safeDateFromUnixMs } from "../../../utils/date";
import { LANGUAGE_ID_TO_LABEL } from "../language";
import type { NoteSearchParams } from "../types";
import { useAdvancedNoteSearchForm } from "../useForm";

export type AdvancedSearchFormProps = {
  defaultValue?: NoteSearchParams;
  lastResult?: SubmissionResult<string[]>;
  onSubmit?: Parameters<typeof useAdvancedNoteSearchForm>[0]["onSubmit"];
  topics: Topic[];
};

export const AdvancedSearchForm = (props: AdvancedSearchFormProps) => {
  const { defaultValue, lastResult, onSubmit, topics } = props;

  const language = useLanguage("ja");
  const shortLanguage = language.slice(0, 2);

  const navigation = useNavigation();
  const searchInProgress = navigation.state !== "idle";

  const [form, fields] = useAdvancedNoteSearchForm({
    lastResult,
    defaultValue,
    onSubmit,
  });

  const {
    value: noteCreatedRangeValue,
    blur: blurNoteCreatedDate,
    focus: focusNoteCreatedDate,
    change: changeNoteCreatedDate,
  } = useDateRangeInputControl({
    fromField: fields.note_created_at_from,
    toField: fields.note_created_at_to,
    convertDateToString: (date) => date?.valueOf().toString(),
    convertStringToDate: safeDateFromUnixMs,
  });

  const {
    value: topicIdsValue,
    change: changeTopicIds,
    focus: focusTopicIds,
    blur: blurTopicIds,
  } = useMultiSelectInputControl({ field: fields.topic_ids });

  return (
    <Form method="POST" preventScrollReset {...getFormProps(form)}>
      <Group justify="flex-end">
        <SubmitButton disabled={!form.valid || searchInProgress} color="pink">
          検索
        </SubmitButton>
      </Group>
      <Stack gap="lg">
        <TextInput
          disabled={searchInProgress}
          error={
            arrayContainsNonNullItem(fields.note_includes_text.errors) && (
              <FormError errors={[fields.note_includes_text.errors]} />
            )
          }
          label="コミュニティノートに含まれるテキスト"
          {...getInputProps(fields.note_includes_text, { type: "text" })}
        />
        <MultiSelect
          label="トピック"
          data={topics.map((t) => ({
            value: t.topicId.toString(),
            label: t.label[shortLanguage] ?? t.topicId.toString(),
          }))}
          value={topicIdsValue}
          error={
            arrayContainsNonNullItem(fields.topic_ids.errors) && (
              <FormError errors={[fields.topic_ids.errors]} />
            )
          }
          onChange={changeTopicIds}
          onFocus={focusTopicIds}
          onBlur={blurTopicIds}
        />
        <NativeSelect
          disabled={searchInProgress}
          error={
            arrayContainsNonNullItem(fields.language.errors) && (
              <FormError errors={[fields.language.errors]} />
            )
          }
          label="言語"
          {...getSelectProps(fields.language)}
        >
          <option value="">言語を選択</option>
          {Object.entries(LANGUAGE_ID_TO_LABEL).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </NativeSelect>
        <DatePickerInput
          disabled={searchInProgress}
          type="range"
          valueFormat="YYYY.MM.DD (ddd)"
          label="コミュニティノートの作成日"
          error={
            arrayContainsNonNullItem(
              fields.note_created_at_from.errors,
              fields.note_created_at_to.errors
            ) && (
              <FormError
                errors={[
                  fields.note_created_at_from.errors,
                  fields.note_created_at_to.errors,
                ]}
              />
            )
          }
          onBlur={blurNoteCreatedDate}
          onChange={changeNoteCreatedDate}
          onFocus={focusNoteCreatedDate}
          value={noteCreatedRangeValue}
        />
      </Stack>
    </Form>
  );
};
