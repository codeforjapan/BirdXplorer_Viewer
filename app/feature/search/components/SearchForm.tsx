import type { SubmissionResult } from "@conform-to/react";
import { getFormProps, getInputProps } from "@conform-to/react";
import {
  Autocomplete,
  MultiSelect,
  Stack,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Form, useNavigation } from "react-router";

import { FormError } from "~/components/FormError";
import { DateRangePicker } from "~/components/input/DateRangePicker";
import { TextInput } from "~/components/mantine/TextInput";
import { SubmitButton } from "~/components/SubmitButton";
import { mantineInputOrder } from "~/config/mantine";
import { LANGUAGE_ID_TO_LABEL } from "~/feature/search/language";
import type { NoteSearchParams } from "~/feature/search/types";
import { useSimpleNoteSearchForm } from "~/feature/search/useForm";
import { useLanguageLiteral } from "~/feature/search/useLanguageLiteral";
import type { Topic } from "~/generated/api/schemas";
import { useMultiSelectInputControl } from "~/hooks/useMultiSelectInputControl";
import { containsNonNullValues } from "~/utils/array";
import { safeDateFromUnixMs } from "~/utils/date";

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

  const shortLanguage = useLanguageLiteral("ja");

  const navigation = useNavigation();
  const searchInProgress = navigation.state !== "idle";

  const [form, fields] = useSimpleNoteSearchForm({
    lastResult,
    defaultValue,
  });

  // 簡易検索画面においても詳細検索にしかない検索条件の値は保持される。
  // このため、簡易検索の条件を入れて検索したつもりでも、詳細検索にしかない条件が追加で入る可能性がある。
  // これは、詳細検索を多用するユーザーには利用しやすいが、簡易検索を多用するユーザーには予期せぬ挙動となる。
  // この問題を解決するために、詳細検索のみの条件が指定されている場合はその数をユーザーにフィードバックしたい。
  const hiddenInputKeys = Object.keys(form.value ?? {}).filter((key) => {
    return !(
      [
        "note_includes_text",
        "topic_ids",
        "language",
        "note_created_at_from",
        "note_created_at_to",
        "limit",
        "offset", // フォームでは入力しないが、ページネーションは簡易検索の画面に表示されているので
      ] satisfies Array<keyof NoteSearchParams>
    ).includes(
      // @ts-expect-error ここでは型が合わないが、ランタイムの挙動は Literal[] と string の比較になるので問題ないstring
      key,
    );
  });

  const { value: xUserNamesValue } = useMultiSelectInputControl({
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

  const { value: noteStatusValue } = useMultiSelectInputControl({
    field: fields.note_status,
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
    <>
      <Form method="POST" preventScrollReset {...getFormProps(form)}>
        <Stack>
          <TextInput
            autoComplete="off"
            c="white"
            classNames={{ input: "!bg-gray-1 !border-gray-5" }}
            disabled={searchInProgress}
            error={
              containsNonNullValues(fields.note_includes_text.errors) && (
                <FormError errors={[fields.note_includes_text.errors]} />
              )
            }
            label="コミュニティノートに含まれるテキスト"
            styles={{
              input: {
                color: "white",
              },
              label: {
                marginBottom: "8px",
              },
            }}
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
            c="white"
            classNames={{ input: "!bg-gray-1 !border-gray-5" }}
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
            styles={{
              input: {
                color: "white",
              },
              label: {
                marginBottom: "8px",
              },
            }}
            {...getInputProps(fields.limit, { type: "number" })}
          />
          {/**
           * 詳細入力のみに存在する input の条件が入った状態で簡易検索を submit すると詳細入力側の検索条件が消えてしまう！
           * ここで不可視 input に値を保持して整合性を保つ
           */}
          <>
            <input
              value={fields.note_excludes_text.value}
              {...getInputProps(fields.note_excludes_text, {
                type: "hidden",
                value: false,
              })}
            />
            <input
              value={fields.post_includes_text.value}
              {...getInputProps(fields.post_includes_text, {
                type: "hidden",
                value: false,
              })}
            />
            <input
              value={fields.post_excludes_text.value}
              {...getInputProps(fields.post_excludes_text, {
                type: "hidden",
                value: false,
              })}
            />
            <input
              value={fields.note_created_at_from.value}
              {...getInputProps(fields.note_created_at_from, {
                type: "hidden",
                value: false,
              })}
            />
            <MultiSelect
              aria-hidden
              className="hidden"
              name={fields.note_status.name}
              value={noteStatusValue}
            />
            <MultiSelect
              aria-hidden
              className="hidden"
              name={fields.x_user_names.name}
              value={xUserNamesValue}
            />
            <input
              value={fields.x_user_followers_count_from.value}
              {...getInputProps(fields.x_user_followers_count_from, {
                type: "hidden",
                value: false,
              })}
            />
            <input
              value={fields.x_user_follow_count_from.value}
              {...getInputProps(fields.x_user_follow_count_from, {
                type: "hidden",
                value: false,
              })}
            />
            <input
              value={fields.post_impression_count_from.value}
              {...getInputProps(fields.post_impression_count_from, {
                type: "hidden",
                value: false,
              })}
            />
            <input
              value={fields.post_like_count_from.value}
              {...getInputProps(fields.post_like_count_from, {
                type: "hidden",
                value: false,
              })}
            />
            <input
              value={fields.post_repost_count_from.value}
              {...getInputProps(fields.post_repost_count_from, {
                type: "hidden",
                value: false,
              })}
            />
          </>
          <div className="pt-4 md:pt-5" />
          <div className="flex flex-col-reverse gap-y-4 pt-3 md:flex-col">
            {/* 最後の入力の直後は必ず submit ボタンにフォーカスが当たるようにするために、
            DOM の順序は固定して flex direction で並べ替える
            */}
            <SubmitButton
              c="white"
              disabled={!form.valid || searchInProgress}
              loading={searchInProgress}
              styles={{
                root: {
                  backgroundColor: "var(--color-primary)",
                  borderRadius: "9999px",
                },
              }}
            >
              Search
            </SubmitButton>
            <UnstyledButton
              c="pink"
              className="ms-auto me-0"
              onClick={openAdvancedSearch}
              type="button"
            >
              <span className="text-sm">
                詳細検索
                {hiddenInputKeys.length > 0 &&
                  ` (選択済み条件: ${hiddenInputKeys.length}種類)`}
              </span>
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
