import type { SubmissionResult } from "@conform-to/react";
import { getFormProps, getInputProps, getSelectProps } from "@conform-to/react";
import {
  Container,
  Group,
  Modal,
  ModalCloseButton,
  MultiSelect,
  NativeSelect,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { Form, useNavigation } from "@remix-run/react";
import { objectHash } from "ohash";

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
import { useNoteSearchForm } from "../useForm";
import { AdvancedSearchForm } from "./AdvancedSearchForm";

type SearchFormProps = {
  defaultValue?: NoteSearchParams;
  lastResult?: SubmissionResult<string[]>;
  topics: Topic[];
};

export const SearchForm = (props: SearchFormProps) => {
  const { defaultValue, lastResult, topics } = props;

  const [opened, { open, close }] = useDisclosure(false);

  const language = useLanguage("ja");
  const shortLanguage = language.slice(0, 2);

  const navigation = useNavigation();
  const searchInProgress = navigation.state !== "idle";

  const [form, fields] = useNoteSearchForm({
    lastResult,
    defaultValue,
    // 検索条件が変わったときに明示的に Input を再レンダリングするために、defaultValue から一意な id を生成する
    // モーダル内の AdvancedSearchForm を submit した際に新しい条件がページ側のフォームに反映される
    id: objectHash(defaultValue),
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
    <>
      <Form method="POST" preventScrollReset {...getFormProps(form)}>
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
            searchable
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
            clearable
            disabled={searchInProgress}
            type="range"
            valueFormat="YYYY.MM.DD (ddd)"
            label="コミュニティノートの作成期間"
            errorProps={{ component: "div" }}
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
          <UnstyledButton c="pink" onClick={open} type="button" variant="link">
            詳細な条件で検索
          </UnstyledButton>
          <SubmitButton
            disabled={!form.valid || searchInProgress}
            loading={searchInProgress}
            color="pink"
          >
            検索
          </SubmitButton>
        </Stack>
      </Form>
      <Modal fullScreen withCloseButton={false} opened={opened} onClose={close}>
        <Container size="md">
          <Stack gap="md">
            <Group justify="space-between">
              <Text>詳細な条件で検索</Text>
              <ModalCloseButton aria-label="簡易検索に戻る" />
            </Group>
            <AdvancedSearchForm
              defaultValue={defaultValue}
              lastResult={lastResult}
              onSubmit={close}
              topics={topics}
            />
          </Stack>
        </Container>
      </Modal>
    </>
  );
};
