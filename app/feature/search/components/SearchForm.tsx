import type { SubmissionResult } from "@conform-to/react";
import { getFormProps, getInputProps } from "@conform-to/react";
import { Autocomplete, Stack, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Form, useNavigation } from "@remix-run/react";

import { FormError } from "../../../components/FormError";
import { DateRangePicker } from "../../../components/input/DateRangePicker";
import { TextInput } from "../../../components/mantine/TextInput";
import { SubmitButton } from "../../../components/SubmitButton";
import { mantineInputOrder } from "../../../config/mantine";
import type { Topic } from "../../../generated/api/schemas";
import { useLanguage } from "../../../hooks/useLanguage";
import { containsNonNullValues } from "../../../utils/array";
import { safeDateFromUnixMs } from "../../../utils/date";
import { LANGUAGE_ID_TO_LABEL } from "../language";
import type { NoteSearchParams } from "../types";
import { useSimpleNoteSearchForm } from "../useForm";
import { AdvancedSearchForm } from "./AdvancedSearchForm";
import { AdvancedSearchModal } from "./AdvancedSearchModal";
import { LanguageSelect } from "./input/LanguageSelect";
import { TopicSelect } from "./input/TopicSelect";

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
          <TopicSelect
            currentLanguage={shortLanguage}
            disabled={searchInProgress}
            field={fields.topic_ids}
            topics={topics}
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
          <Autocomplete
            data={["10", "20", "50", "100"]}
            description="80: 1ページに最大 80 件のコミュニティノートを表示"
            disabled={searchInProgress}
            error={
              containsNonNullValues(fields.limit.errors) && (
                <FormError errors={[fields.limit.errors]} />
              )
            }
            errorProps={{ component: "div" }}
            inputWrapperOrder={mantineInputOrder}
            label="1ページあたりの表示件数"
            {...getInputProps(fields.limit, { type: "number" })}
          />
          <div className="flex flex-col-reverse gap-y-4 md:flex-col">
            {/* 最後の入力の直後は必ず submit ボタンにフォーカスが当たるようにするために、
            DOM の順序は固定して flex direction で並べ替える
            */}
            <SubmitButton
              color="pink"
              disabled={!form.valid || searchInProgress}
              loading={searchInProgress}
            >
              検索
            </SubmitButton>
            <UnstyledButton
              c="pink"
              className="ms-auto me-0"
              onClick={openAdvancedSearch}
              type="button"
            >
              詳細な条件で検索
            </UnstyledButton>
          </div>
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
