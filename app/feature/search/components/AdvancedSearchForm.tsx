import type { SubmissionResult } from "@conform-to/react";
import { getFormProps, getInputProps } from "@conform-to/react";
import {
  Divider,
  Group,
  ModalCloseButton,
  MultiSelect,
  Stack,
  TagsInput,
  Text,
} from "@mantine/core";
import { Form, useNavigation } from "@remix-run/react";

import { FormError } from "../../../components/FormError";
import { DateRangePicker } from "../../../components/input/DateRangePicker";
import { Fieldset } from "../../../components/mantine/Fieldset";
import { TextInput } from "../../../components/mantine/TextInput";
import { SubmitButton } from "../../../components/SubmitButton";
import type { Topic } from "../../../generated/api/schemas";
import { useLanguage } from "../../../hooks/useLanguage";
import { useMultiSelectInputControl } from "../../../hooks/useMultiSelectInputControl";
import { containsNonNullValues } from "../../../utils/array";
import { safeDateFromUnixMs } from "../../../utils/date";
import { LANGUAGE_ID_TO_LABEL } from "../language";
import { NOTE_CURRENT_STATUS } from "../status";
import type { NoteSearchParams } from "../types";
import { useAdvancedNoteSearchForm } from "../useForm";
import { LanguageSelect } from "./input/LanguageSelect";

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

  const noteStatusControl = useMultiSelectInputControl({
    field: fields.note_status,
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

  const xUserNamesControl = useMultiSelectInputControl({
    field: fields.x_user_names,
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
      return mantineValue.join(",");
    },
  });

  return (
    <Stack className="relative" gap="md">
      <Stack className="sticky top-0 z-10 pt-4 bg-white">
        <Group justify="space-between">
          <Group>
            <ModalCloseButton aria-label="簡易検索に戻る" size="lg" />
            <Text className="self-end" size="xl">
              詳細な条件で検索
            </Text>
          </Group>
          <SubmitButton
            color="pink"
            disabled={!form.valid || searchInProgress}
            form={form.id}
          >
            検索
          </SubmitButton>
        </Group>
        <Divider />
      </Stack>
      <Form
        className="relative"
        method="POST"
        preventScrollReset
        {...getFormProps(form)}
      >
        <Stack gap="lg">
          <Fieldset legend="キーワード">
            <Stack>
              <TextInput
                autoComplete="off"
                disabled={searchInProgress}
                error={
                  containsNonNullValues(fields.note_includes_text.errors) && (
                    <FormError errors={[fields.note_includes_text.errors]} />
                  )
                }
                label="コミュニティノートに含まれるキーワード"
                {...getInputProps(fields.note_includes_text, {
                  type: "text",
                })}
              />
              <TextInput
                autoComplete="off"
                disabled={searchInProgress}
                error={
                  containsNonNullValues(fields.note_excludes_text.errors) && (
                    <FormError errors={[fields.note_excludes_text.errors]} />
                  )
                }
                label="コミュニティノートに含まれないキーワード"
                {...getInputProps(fields.note_excludes_text, {
                  type: "text",
                })}
              />
              <TextInput
                autoComplete="off"
                disabled={searchInProgress}
                error={
                  containsNonNullValues(fields.post_includes_text.errors) && (
                    <FormError errors={[fields.post_includes_text.errors]} />
                  )
                }
                label="X のポストに含まれるキーワード"
                {...getInputProps(fields.post_includes_text, {
                  type: "text",
                })}
              />
              <TextInput
                autoComplete="off"
                disabled={searchInProgress}
                error={
                  containsNonNullValues(fields.post_excludes_text.errors) && (
                    <FormError errors={[fields.post_excludes_text.errors]} />
                  )
                }
                label="X のポストに含まれないキーワード"
                {...getInputProps(fields.post_excludes_text, {
                  type: "text",
                })}
              />
            </Stack>
          </Fieldset>
          <Divider />
          <Fieldset legend="絞り込み">
            <Stack>
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
                {...topicIdsControl}
              />
              <LanguageSelect
                disabled={searchInProgress}
                field={fields.language}
                label="言語"
                languages={LANGUAGE_ID_TO_LABEL}
              />
              <MultiSelect
                clearable
                data={Object.entries(NOTE_CURRENT_STATUS).map(
                  ([value, label]) => ({
                    value,
                    label,
                  }),
                )}
                disabled={searchInProgress}
                error={
                  containsNonNullValues(fields.note_status.errors) && (
                    <FormError errors={[fields.note_status.errors]} />
                  )
                }
                errorProps={{ component: "div" }}
                label="コミュニティノートのステータス"
                searchable
                {...noteStatusControl}
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
            </Stack>
          </Fieldset>
          <Divider />
          <Fieldset legend="ノートに紐ついたポストで絞り込み">
            <Stack>
              <TagsInput
                autoComplete="off"
                disabled={searchInProgress}
                error={
                  containsNonNullValues(fields.x_user_names.errors) && (
                    <FormError errors={[fields.x_user_names.errors]} />
                  )
                }
                label="コミュニティノートがついたポストの投稿者"
                {...xUserNamesControl}
              />
              <TextInput
                autoComplete="off"
                data-1p-ignore
                disabled={searchInProgress}
                error={
                  containsNonNullValues(
                    fields.x_user_followers_count_from.errors,
                  ) && (
                    <FormError
                      errors={[fields.x_user_followers_count_from.errors]}
                    />
                  )
                }
                label="コミュニティノートがついたポストの投稿者のフォロワー数"
                rightSection={<Text>人以上</Text>}
                rightSectionPointerEvents="none"
                rightSectionWidth="4em"
                {...getInputProps(fields.x_user_followers_count_from, {
                  type: "number",
                })}
              />
              <TextInput
                autoComplete="off"
                data-1p-ignore
                disabled={searchInProgress}
                error={
                  containsNonNullValues(
                    fields.x_user_follow_count_from.errors,
                  ) && (
                    <FormError
                      errors={[fields.x_user_follow_count_from.errors]}
                    />
                  )
                }
                label="コミュニティノートがついたポストの投稿者のフォロー数"
                rightSection={<Text>人以上</Text>}
                rightSectionPointerEvents="none"
                rightSectionWidth="4em"
                {...getInputProps(fields.x_user_follow_count_from, {
                  type: "number",
                })}
              />
              <TextInput
                autoComplete="off"
                data-1p-ignore
                disabled={searchInProgress}
                error={
                  containsNonNullValues(fields.post_like_count_from.errors) && (
                    <FormError errors={[fields.post_like_count_from.errors]} />
                  )
                }
                label="コミュニティノートがついたポストの最小いいね数"
                rightSection={<Text>以上</Text>}
                rightSectionPointerEvents="none"
                rightSectionWidth="3em"
                {...getInputProps(fields.post_like_count_from, {
                  type: "number",
                })}
              />
              <TextInput
                autoComplete="off"
                data-1p-ignore
                disabled={searchInProgress}
                error={
                  containsNonNullValues(
                    fields.post_repost_count_from.errors,
                  ) && (
                    <FormError
                      errors={[fields.post_repost_count_from.errors]}
                    />
                  )
                }
                label="コミュニティノートがついたポストの最小リポスト数"
                rightSection={<Text>以上</Text>}
                rightSectionPointerEvents="none"
                rightSectionWidth="3em"
                {...getInputProps(fields.post_repost_count_from, {
                  type: "number",
                })}
              />
              <TextInput
                autoComplete="off"
                data-1p-ignore
                disabled={searchInProgress}
                error={
                  containsNonNullValues(
                    fields.post_impression_count_from.errors,
                  ) && (
                    <FormError
                      errors={[fields.post_impression_count_from.errors]}
                    />
                  )
                }
                label="コミュニティノートがついたポストの最小インプレッション数"
                rightSection={<Text>以上</Text>}
                rightSectionPointerEvents="none"
                rightSectionWidth="3em"
                {...getInputProps(fields.post_impression_count_from, {
                  type: "number",
                })}
              />
            </Stack>
          </Fieldset>
        </Stack>
      </Form>
    </Stack>
  );
};
