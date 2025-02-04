import type { SubmissionResult } from "@conform-to/react";
import { getFormProps, getInputProps } from "@conform-to/react";
import { MultiSelect, Stack, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Form, useNavigation } from "@remix-run/react";

import { FormError } from "../../../components/FormError";
import { DateRangePicker } from "../../../components/input/DateRangePicker";
import { TextInput } from "../../../components/mantine/TextInput";
import { SubmitButton } from "../../../components/SubmitButton";
import type { Topic } from "../../../generated/api/schemas";
import { useLanguage } from "../../../hooks/useLanguage";
import { useMultiSelectInputControl } from "../../../hooks/useMultiSelectInputControl";
import { containsNonNullValues } from "../../../utils/array";
import { safeDateFromUnixMs } from "../../../utils/date";
import { LANGUAGE_ID_TO_LABEL } from "../language";
import type { NoteSearchParams } from "../types";
import { useSimpleNoteSearchForm } from "../useForm";
import { AdvancedSearchForm } from "./AdvancedSearchForm";
import { AdvancedSearchModal } from "./AdvancedSearchModal";
import { LanguageSelect } from "./input/LanguageSelect";

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

  const topicIdsControl = useMultiSelectInputControl({
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
        <Stack>
          <TextInput
            autoComplete="off"
            disabled={searchInProgress}
            error={
              containsNonNullValues(fields.note_includes_text.errors) && (
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
              containsNonNullValues(fields.topic_ids.errors) && (
                <FormError errors={[fields.topic_ids.errors]} />
              )
            }
            label="トピック"
            searchable
            {...topicIdsControl}
          />
          <LanguageSelect
            disabled={searchInProgress}
            field={fields.language}
            label="言語"
            languages={LANGUAGE_ID_TO_LABEL}
          />
          <DateRangePicker
            convertFormValueToMantine={safeDateFromUnixMs}
            convertMantineValueToForm={(date) => date?.valueOf().toString()}
            disabled={searchInProgress}
            fromField={fields.note_created_at_from}
            label="コミュニティノートの作成期間"
            toField={fields.note_created_at_to}
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
      <AdvancedSearchModal
        onClose={closeAdvancedSearch}
        opened={mountAdvancedSearchModal}
      >
        <AdvancedSearchForm
          defaultValue={defaultValue}
          lastResult={lastResult}
          onSubmit={closeAdvancedSearch}
          topics={topics}
        />
      </AdvancedSearchModal>
    </>
  );
};
