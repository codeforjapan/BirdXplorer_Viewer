import type { SubmissionResult } from "@conform-to/react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { z } from "zod";

import type { NoteSearchParams } from "./types";
import { noteSearchParamSchema } from "./validation";

type UseNoteSearchForm = {
  defaultValue?: NoteSearchParams;
  lastResult: SubmissionResult<string[]> | undefined;
  onSubmit?: Parameters<
    typeof useForm<z.infer<typeof noteSearchParamSchema>>
  >[0]["onSubmit"];
};

export const useNoteSearchForm = (options: UseNoteSearchForm) => {
  const form = useForm<z.infer<typeof noteSearchParamSchema>>({
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
