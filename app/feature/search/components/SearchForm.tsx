import type { SubmissionResult } from "@conform-to/react";
import { getFormProps, getInputProps, getSelectProps } from "@conform-to/react";
import { MultiSelect, Select, Stack, UnstyledButton } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { Form, useNavigation } from "@remix-run/react";

import { FormError } from "../../../components/FormError";
import { TextInput } from "../../../components/mantine/TextInput";
import { SubmitButton } from "../../../components/SubmitButton";
import type { Topic } from "../../../generated/api/schemas";
import { useDateRangeInputControl } from "../../../hooks/useDateRangeInputControl";
import { useLanguage } from "../../../hooks/useLanguatge";
import { useMultiSelectInputControl } from "../../../hooks/useMultiSelectInputControl";
import { arrayContainsNonNullItem } from "../../../utils/array";
import { safeDateFromUnixMs } from "../../../utils/date";
import { LANGUAGE_ID_TO_LABEL } from "../language";
import type { NoteSearchParams } from "../types";
import { useSimpleNoteSearchForm } from "../useForm";
import { AdvancedSearchForm } from "./AdvancedSearchForm";

type SearchFormProps = {
  defaultValue?: NoteSearchParams;
  lastResult?: SubmissionResult<string[]>;
  topics: Topic[];
};

export const SearchForm = (props: SearchFormProps) => {
  const { defaultValue, lastResult, topics } = props;

  const [
    mountAdvancedSearchModal,
    { open: openAdvancedSearch, close: closeAdvancedSearch },
  ] = useDisclosure(false);

  const language = useLanguage("ja");
  const shortLanguage = language.slice(0, 2);

  const navigation = useNavigation();
  const searchInProgress = navigation.state !== "idle";

  const [form, fields] = useSimpleNoteSearchForm({
    lastResult,
    defaultValue,
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
  } = useMultiSelectInputControl({
    field: fields.topic_ids,
    convertFormValueToMantine(formValue) {
      if (formValue == null) {
        return [];
      }
      if (typeof formValue === "string") {
        return [formValue];
      }
      return formValue.filter((v) => v != null);
    },
    convertMantineValueToForm(mantineValue) {
      return mantineValue.length > 0 ? mantineValue : "";
    },
  });

  return (
    <>
      <Form method="POST" preventScrollReset {...getFormProps(form)}>
        <Stack gap="lg">
          <TextInput
            autoComplete="off"
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
            data={topics.map((t) => ({
              value: t.topicId.toString(),
              label: t.label[shortLanguage] ?? t.topicId.toString(),
            }))}
            error={
              arrayContainsNonNullItem(fields.topic_ids.errors) && (
                <FormError errors={[fields.topic_ids.errors]} />
              )
            }
            label="トピック"
            onBlur={blurTopicIds}
            onChange={changeTopicIds}
            onFocus={focusTopicIds}
            searchable
            value={topicIdsValue}
          />
          <Select
            data={Object.entries(LANGUAGE_ID_TO_LABEL).map(([id, label]) => ({
              value: id,
              label,
            }))}
            disabled={searchInProgress}
            error={
              arrayContainsNonNullItem(fields.language.errors) && (
                <FormError errors={[fields.language.errors]} />
              )
            }
            errorProps={{ component: "div" }}
            label="言語"
            searchable
            {
              // HACK: defaultValue が number や string [] になることはないので TypeScript を騙す
              ...(getSelectProps(fields.language) as Omit<
                ReturnType<typeof getSelectProps>,
                "defaultValue"
              > & {
                defaultValue: Exclude<
                  ReturnType<typeof getSelectProps>["defaultValue"],
                  number | readonly string[]
                >;
              })
            }
          />
          <DatePickerInput
            clearable
            disabled={searchInProgress}
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
            errorProps={{ component: "div" }}
            label="コミュニティノートの作成期間"
            onBlur={blurNoteCreatedDate}
            onChange={changeNoteCreatedDate}
            onFocus={focusNoteCreatedDate}
            type="range"
            value={noteCreatedRangeValue}
            valueFormat="YYYY.MM.DD (ddd)"
          />
          <UnstyledButton
            c="pink"
            onClick={openAdvancedSearch}
            type="button"
            variant="link"
          >
            詳細な条件で検索
          </UnstyledButton>
          <SubmitButton
            color="pink"
            disabled={!form.valid || searchInProgress}
            loading={searchInProgress}
          >
            検索
          </SubmitButton>
        </Stack>
      </Form>
      <AdvancedSearchForm
        defaultValue={defaultValue}
        lastResult={lastResult}
        onClose={closeAdvancedSearch}
        onSubmit={closeAdvancedSearch}
        opened={mountAdvancedSearchModal}
        topics={topics}
      />
    </>
  );
};
