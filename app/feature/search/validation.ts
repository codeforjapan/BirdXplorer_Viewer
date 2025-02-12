import type { ZodTypeAny } from "zod";
import { z } from "zod";

import {
  searchApiV1DataSearchGetQueryLimitMax,
  searchApiV1DataSearchGetQueryOffsetMin,
  searchApiV1DataSearchGetQueryTopicIdsItemMin,
} from "../../generated/api/zod/schema";

const preprocessArray = <T extends ZodTypeAny>(schema: T) => {
  return z.preprocess((data) => {
    if (data == null) {
      return [];
    }
    if (Array.isArray(data)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return data;
    }
    if (typeof data === "string") {
      return data.split(",");
    }
    return [data];
  }, schema);
};

export const noteSearchParamSchema = z.object({
  note_includes_text: z.string().or(z.null()).optional(),
  note_excludes_text: z.string().or(z.null()).optional(),
  post_includes_text: z.string().or(z.null()).optional(),
  post_excludes_text: z.string().or(z.null()).optional(),
  language: z
    .enum([
      "en",
      "es",
      "ja",
      "pt",
      "de",
      "fr",
      "fi",
      "tr",
      "nl",
      "he",
      "it",
      "fa",
      "ca",
      "ar",
      "el",
      "sv",
      "da",
      "ru",
      "pl",
      "other",
    ])
    .or(z.null())
    .optional(),
  topic_ids: preprocessArray(
    z
      .array(
        z.coerce.number().min(searchApiV1DataSearchGetQueryTopicIdsItemMin),
      )
      .or(z.null()),
  ).optional(),
  note_status: preprocessArray(
    z
      .array(
        z.enum([
          "NEEDS_MORE_RATINGS",
          "CURRENTLY_RATED_HELPFUL",
          "CURRENTLY_RATED_NOT_HELPFUL",
        ]),
      )
      .or(z.null()),
  ).optional(),
  note_created_at_from: z.coerce
    .number()
    .min(0)
    .max(
      new Date().valueOf(),
      "作成期間の最初を現在より先の日時に設定することはできません",
    )
    .or(z.null())
    .optional(),
  note_created_at_to: z.coerce
    .number()
    .min(0)
    .max(
      new Date().valueOf(),
      "作成期間の最後を現在より先の日時に設定することはできません",
    )
    .or(z.null())
    .optional(),
  x_user_names: preprocessArray(z.array(z.string()).or(z.null())).optional(),
  x_user_followers_count_from: z.coerce.number().min(0).or(z.null()).optional(),
  x_user_follow_count_from: z.coerce.number().min(0).or(z.null()).optional(),
  post_like_count_from: z.coerce.number().min(0).or(z.null()).optional(),
  post_repost_count_from: z.coerce.number().min(0).or(z.null()).optional(),
  post_impression_count_from: z.coerce.number().min(0).or(z.null()).optional(),
  post_includes_media: z.coerce.boolean().optional(),
  offset: z.coerce
    .number()
    .min(searchApiV1DataSearchGetQueryOffsetMin)
    .optional()
    .default(0),
  limit: z.coerce
    .number()
    .max(searchApiV1DataSearchGetQueryLimitMax)
    .optional()
    .default(25),
});
