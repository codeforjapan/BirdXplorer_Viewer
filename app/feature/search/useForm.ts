import type { SubmissionResult } from "@conform-to/react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

import type { NoteSearchParams } from "./types";
import { noteSearchParamSchema } from "./validation";

type UseNoteSearchForm = {
  defaultValue?: NoteSearchParams;
  lastResult?: SubmissionResult<string[]>;
};

export const useNoteSearchForm = (options: UseNoteSearchForm = {}) => {
  const form = useForm({
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: noteSearchParamSchema,
      });
    },
    ...options,
  });

  return form;
};
