import { z } from "zod";

import {
  searchApiV1DataSearchGetQueryLimitMax,
  searchApiV1DataSearchGetQueryOffsetMin,
  searchApiV1DataSearchGetQueryTopicIdsItemMin,
} from "../../generated/api/zod/schema";

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
  topic_ids: z
    .array(z.coerce.number().min(searchApiV1DataSearchGetQueryTopicIdsItemMin))
    .or(z.null())
    .optional(),
  note_status: z
    .array(
      z.enum([
        "NEEDS_MORE_RATINGS",
        "CURRENTLY_RATED_HELPFUL",
        "CURRENTLY_RATED_NOT_HELPFUL",
      ])
    )
    .or(z.null())
    .optional(),
  note_created_at_from: z.coerce
    .number()
    .min(0)
    .max(
      new Date().valueOf(),
      "作成日の下限を現在より先の日時に設定することはできません"
    )
    .or(z.null())
    .optional(),
  note_created_at_to: z.coerce
    .number()
    .min(0)
    .max(
      new Date().valueOf(),
      "作成日の上限を現在より先の日時に設定することはできません"
    )
    .or(z.null())
    .optional(),
  x_user_names: z.array(z.string()).or(z.null()).optional(),
  x_user_followers_count_from: z.number().or(z.null()).optional(),
  x_user_follow_count_from: z.number().or(z.null()).optional(),
  post_like_count_from: z.number().or(z.null()).optional(),
  post_repost_count_from: z.number().or(z.null()).optional(),
  post_impression_count_from: z.number().or(z.null()).optional(),
  post_includes_media: z.boolean().optional(),
  offset: z.number().min(searchApiV1DataSearchGetQueryOffsetMin).optional(),
  limit: z.number().max(searchApiV1DataSearchGetQueryLimitMax).optional(),
});
