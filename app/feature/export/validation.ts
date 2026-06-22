import { z } from "zod";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_KEYWORDS = 50;

export const csvExportBaseSchema = z.object({
  keywords: z.string().min(1, "キーワードを1つ以上入力してください"),
  search_mode: z
    .preprocess((v) => (v === "" ? undefined : v), z.enum(["or", "and"]).optional()),
  note_created_at_from: z.coerce
    .number()
    .min(0)
    .max(new Date().valueOf(), "現在より先の日時は指定できません")
    .or(z.null())
    .optional(),
  note_created_at_to: z.coerce
    .number()
    .min(0)
    .max(new Date().valueOf(), "現在より先の日時は指定できません")
    .or(z.null())
    .optional(),
});

export const csvExportParamSchema = csvExportBaseSchema.superRefine(
  (data, ctx) => {
    const parsed = parseKeywords(data.keywords);
    if (parsed.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "キーワードを1つ以上入力してください",
        path: ["keywords"],
      });
    }
    if (parsed.length > MAX_KEYWORDS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `キーワードは最大${MAX_KEYWORDS}個です`,
        path: ["keywords"],
      });
    }
    if (data.note_created_at_from == null || data.note_created_at_to == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "日付範囲を入力してください",
        path: ["note_created_at_from"],
      });
      return;
    }
    if (data.note_created_at_from > data.note_created_at_to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "開始日時は終了日時より前にしてください",
        path: ["note_created_at_from"],
      });
    }
    if (data.note_created_at_to - data.note_created_at_from > THIRTY_DAYS_MS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "期間は最大30日間です",
        path: ["note_created_at_to"],
      });
    }
  },
);

export type CsvExportParams = z.infer<typeof csvExportParamSchema>;

export function parseKeywords(raw: string): string[] {
  return raw
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}
