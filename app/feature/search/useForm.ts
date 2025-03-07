import type { SubmissionResult } from "@conform-to/react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { hash } from "ohash";
import { useMemo } from "react";
import type { z } from "zod";

import type { NoteSearchParams } from "./types";
import { noteSearchParamSchema } from "./validation";

// useForm の型を事前に計算してコンパイルさせる
type UseNoteSearchFormFn = typeof useForm<
  z.infer<typeof noteSearchParamSchema>
>;

type UseNoteSearchFormReturn = ReturnType<UseNoteSearchFormFn>;

type UseNoteSearchFormOptions = {
  defaultValue?: NoteSearchParams;
  lastResult: SubmissionResult<string[]> | undefined;
  onSubmit?: Parameters<UseNoteSearchFormFn>[0]["onSubmit"];
  /**
   * フォームの種類。フォームの入力状態の制御に必要
   *
   * - `simple`: 簡易検索フォーム
   * - `advanced`: 詳細検索フォーム
   *
   * @see {@link https://ja.conform.guide/api/react/useForm#tips `id` が変更されたときに自動的にフォームをリセットします。}
   *
   */
  // このプロパティは、フォームのデフォルト値が変わったときにフォームの表示をリセットする挙動の実現のために必要
  // defaultValue のみをハッシュ化して useForm の id に渡すと、簡易検索と詳細検索で id が衝突して挙動が壊れるので、
  // フォームの種類を id に含めることで、簡易検索と詳細検索で id が衝突しないようにしている
  formType: "simple" | "advanced";
};

type useAdvancedNoteSearchFormOptions = Omit<
  UseNoteSearchFormOptions,
  "formType"
>;

export const useAdvancedNoteSearchForm = (
  options: useAdvancedNoteSearchFormOptions,
) => useNoteSearchForm({ ...options, formType: "advanced" });

type useSimpleNoteSearchFormOptions = Omit<
  UseNoteSearchFormOptions,
  "formType"
>;

export const useSimpleNoteSearchForm = (
  options: useSimpleNoteSearchFormOptions,
) => useNoteSearchForm({ ...options, formType: "simple" });

// この hooks を直接使わないこと
const useNoteSearchForm = ({
  defaultValue,
  formType,
  ...rest
}: UseNoteSearchFormOptions): UseNoteSearchFormReturn => {
  const formIdHash = useMemo(
    () => hash({ formType, ...defaultValue }),
    [formType, defaultValue],
  );

  const form = useForm<z.infer<typeof noteSearchParamSchema>>({
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: noteSearchParamSchema,
      });
    },
    defaultValue,
    id: formIdHash,
    ...rest,
  });

  return form;
};
