import "./advanced-search-modal.css";

import type { SubmissionResult } from "@conform-to/react";
import { getFormProps, getInputProps, getSelectProps } from "@conform-to/react";
import {
  Divider,
  Group,
  Modal,
  ModalCloseButton,
  MultiSelect,
  ScrollArea,
  Select,
  Stack,
  TagsInput,
  Text,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Form, useNavigation } from "@remix-run/react";

import { FormError } from "../../../components/FormError";
import { Fieldset } from "../../../components/mantine/Fieldset";
import { TextInput } from "../../../components/mantine/TextInput";
import { SubmitButton } from "../../../components/SubmitButton";
import type { Topic } from "../../../generated/api/schemas";
import { useDateRangeInputControl } from "../../../hooks/useDateRangeInputControl";
import { useLanguage } from "../../../hooks/useLanguatge";
import { useMultiSelectInputControl } from "../../../hooks/useMultiSelectInputControl";
import { arrayContainsNonNullItem } from "../../../utils/array";
import { safeDateFromUnixMs } from "../../../utils/date";
import { LANGUAGE_ID_TO_LABEL } from "../language";
import { NOTE_CURRENT_STATUS } from "../status";
import type { NoteSearchParams } from "../types";
import { useAdvancedNoteSearchForm } from "../useForm";

export type AdvancedSearchFormProps = {
  defaultValue?: NoteSearchParams;
  lastResult?: SubmissionResult<string[]>;
  onSubmit?: Parameters<typeof useAdvancedNoteSearchForm>[0]["onSubmit"];
  topics: Topic[];
  opened: boolean;
  onClose: () => void;
};

export const AdvancedSearchForm = (props: AdvancedSearchFormProps) => {
  const { defaultValue, lastResult, onSubmit, topics, opened, onClose } = props;

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

  const {
    value: noteStatusValue,
    change: changeNoteStatus,
    focus: focusNoteStatus,
    blur: blurNoteStatus,
  } = useMultiSelectInputControl({
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

  const {
    value: xUserNamesValue,
    change: changeXUserNames,
    focus: focusXUserNames,
    blur: blurXUserNames,
  } = useMultiSelectInputControl({
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
    <Modal
      centered
      onClose={onClose}
      opened={opened}
      scrollAreaComponent={ScrollArea.Autosize}
      withCloseButton={false}
    >
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
                    arrayContainsNonNullItem(
                      fields.note_includes_text.errors
                    ) && (
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
                    arrayContainsNonNullItem(
                      fields.note_excludes_text.errors
                    ) && (
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
                    arrayContainsNonNullItem(
                      fields.post_includes_text.errors
                    ) && (
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
                    arrayContainsNonNullItem(
                      fields.post_excludes_text.errors
                    ) && (
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
                    arrayContainsNonNullItem(fields.topic_ids.errors) && (
                      <FormError errors={[fields.topic_ids.errors]} />
                    )
                  }
                  label="トピック"
                  onBlur={blurTopicIds}
                  onChange={changeTopicIds}
                  onFocus={focusTopicIds}
                  value={topicIdsValue}
                />
                <Select
                  autoComplete="off"
                  data={Object.entries(LANGUAGE_ID_TO_LABEL).map(
                    ([value, label]) => ({
                      value,
                      label,
                    })
                  )}
                  data-1p-ignore
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
                <MultiSelect
                  clearable
                  data={Object.entries(NOTE_CURRENT_STATUS).map(
                    ([value, label]) => ({
                      value,
                      label,
                    })
                  )}
                  disabled={searchInProgress}
                  error={
                    arrayContainsNonNullItem(fields.note_status.errors) && (
                      <FormError errors={[fields.note_status.errors]} />
                    )
                  }
                  errorProps={{ component: "div" }}
                  label="コミュニティノートのステータス"
                  onBlur={blurNoteStatus}
                  onChange={changeNoteStatus}
                  onFocus={focusNoteStatus}
                  searchable
                  value={noteStatusValue}
                />
                <DatePickerInput
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
                  label="コミュニティノートの作成日"
                  onBlur={blurNoteCreatedDate}
                  onChange={changeNoteCreatedDate}
                  onFocus={focusNoteCreatedDate}
                  type="range"
                  value={noteCreatedRangeValue}
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
                    arrayContainsNonNullItem(fields.x_user_names.errors) && (
                      <FormError errors={[fields.x_user_names.errors]} />
                    )
                  }
                  label="コミュニティノートがついたポストの投稿者"
                  onBlur={blurXUserNames}
                  onChange={changeXUserNames}
                  onFocus={focusXUserNames}
                  value={xUserNamesValue}
                />
                <TextInput
                  autoComplete="off"
                  data-1p-ignore
                  disabled={searchInProgress}
                  error={
                    arrayContainsNonNullItem(
                      fields.x_user_followers_count_from.errors
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
                    arrayContainsNonNullItem(
                      fields.x_user_follow_count_from.errors
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
                    arrayContainsNonNullItem(
                      fields.post_like_count_from.errors
                    ) && (
                      <FormError
                        errors={[fields.post_like_count_from.errors]}
                      />
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
                    arrayContainsNonNullItem(
                      fields.post_repost_count_from.errors
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
                    arrayContainsNonNullItem(
                      fields.post_impression_count_from.errors
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
    </Modal>
  );
};
