import { tool } from "ai";
import { zodSchema } from "ai";
import { z } from "zod";

const API_BASE_URL =
  process.env.BIRDXPLORER_API_URL ??
  "https://dev.api-birdxplorer.code4japan.org";

async function bxFetch<T>(
  path: string,
  params?: Record<string, string | number | boolean | string[] | number[]>,
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === null || value === undefined) continue;
      if (Array.isArray(value)) {
        for (const v of value) {
          url.searchParams.append(key, String(v));
        }
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`BirdXplorer API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

const listTopicsTool = tool({
  description:
    "BirdXplorer のトピック一覧を取得します。トピックIDと日本語・英語ラベル、ノート件数が含まれます。",
  inputSchema: zodSchema(z.object({})),
  execute: async () => {
    const data = await bxFetch<{
      data: Array<{
        topicId: number;
        label: Record<string, string>;
        referenceCount: number;
      }>;
    }>("/api/v1/data/topics");
    return data.data.map((t) => ({
      id: t.topicId,
      label_ja: t.label.ja ?? "",
      label_en: t.label.en ?? "",
      noteCount: t.referenceCount,
    }));
  },
});

const searchNotesSchema = z.object({
  note_includes_text: z
    .array(z.string())
    .optional()
    .describe("ノートの本文に含まれるキーワード（複数指定でAND検索）"),
  post_includes_text: z
    .array(z.string())
    .optional()
    .describe("投稿の本文に含まれるキーワード（複数指定でAND検索）"),
  language: z
    .string()
    .optional()
    .describe("言語コード（例: ja, en）。省略時は全言語"),
  topic_ids: z
    .array(z.number())
    .optional()
    .describe("絞り込むトピックIDの配列。OR検索"),
  note_status: z
    .array(
      z.enum([
        "NEEDS_MORE_RATINGS",
        "CURRENTLY_RATED_HELPFUL",
        "CURRENTLY_RATED_NOT_HELPFUL",
      ]),
    )
    .optional()
    .describe("ノートのステータスフィルタ"),
  note_created_at_from: z
    .number()
    .optional()
    .describe("ノート作成日時の下限（ミリ秒 Unix タイムスタンプ）"),
  note_created_at_to: z
    .number()
    .optional()
    .describe("ノート作成日時の上限（ミリ秒 Unix タイムスタンプ）"),
  limit: z.number().min(1).max(50).default(10).describe("取得件数（最大50）"),
});

const searchNotesTool = tool({
  description:
    "BirdXplorer のコミュニティノートを検索します。キーワード、言語、トピック、ステータス、期間で絞り込めます。",
  inputSchema: zodSchema(searchNotesSchema),
  execute: async (args) => {
    const params: Record<
      string,
      string | number | boolean | string[] | number[]
    > = { limit: args.limit };
    if (args.note_includes_text)
      params.note_includes_text = args.note_includes_text;
    if (args.post_includes_text)
      params.post_includes_text = args.post_includes_text;
    if (args.language) params.language = args.language;
    if (args.topic_ids) params.topic_ids = args.topic_ids;
    if (args.note_status) params.note_status = args.note_status;
    if (args.note_created_at_from !== undefined)
      params.note_created_at_from = args.note_created_at_from;
    if (args.note_created_at_to !== undefined)
      params.note_created_at_to = args.note_created_at_to;
    params.include_total = true;

    const data = await bxFetch<{
      data: Array<{
        noteId: string;
        summary: string;
        language: string;
        topics: Array<{ topicId: number; label: Record<string, string> }>;
        currentStatus: string;
        createdAt: number;
        helpfulCount: number;
        notHelpfulCount: number;
        rateCount: number;
        post: { text?: string; likeCount?: number } | null;
      }>;
      meta: { total?: number };
    }>("/api/v1/data/search", params);

    return {
      total: data.meta.total,
      notes: data.data.map((n) => ({
        noteId: n.noteId,
        summary: n.summary,
        language: n.language,
        topics: n.topics.map((t) => t.label.ja ?? t.label.en ?? ""),
        status: n.currentStatus,
        createdAt: new Date(n.createdAt).toISOString(),
        helpfulCount: n.helpfulCount,
        notHelpfulCount: n.notHelpfulCount,
        rateCount: n.rateCount,
        postText: n.post?.text?.slice(0, 200) ?? null,
        postLikeCount: n.post?.likeCount ?? null,
      })),
    };
  },
});

const countNotesSchema = z.object({
  note_includes_text: z
    .array(z.string())
    .optional()
    .describe("ノートの本文に含まれるキーワード（複数指定でAND検索）"),
  post_includes_text: z
    .array(z.string())
    .optional()
    .describe("投稿の本文に含まれるキーワード（複数指定でAND検索）"),
  language: z.string().optional().describe("言語コード（例: ja, en）"),
  topic_ids: z.array(z.number()).optional().describe("トピックIDの配列"),
  note_status: z
    .array(
      z.enum([
        "NEEDS_MORE_RATINGS",
        "CURRENTLY_RATED_HELPFUL",
        "CURRENTLY_RATED_NOT_HELPFUL",
      ]),
    )
    .optional()
    .describe("ノートのステータスフィルタ"),
  note_created_at_from: z
    .number()
    .optional()
    .describe("ノート作成日時の下限（ミリ秒 Unix タイムスタンプ）"),
  note_created_at_to: z
    .number()
    .optional()
    .describe("ノート作成日時の上限（ミリ秒 Unix タイムスタンプ）"),
});

const countNotesTool = tool({
  description:
    "フィルタ条件に一致するコミュニティノートの総件数を返します。search_notes よりも軽量です。",
  inputSchema: zodSchema(countNotesSchema),
  execute: async (args) => {
    const params: Record<
      string,
      string | number | boolean | string[] | number[]
    > = {};
    if (args.note_includes_text)
      params.note_includes_text = args.note_includes_text;
    if (args.post_includes_text)
      params.post_includes_text = args.post_includes_text;
    if (args.language) params.language = args.language;
    if (args.topic_ids) params.topic_ids = args.topic_ids;
    if (args.note_status) params.note_status = args.note_status;
    if (args.note_created_at_from !== undefined)
      params.note_created_at_from = args.note_created_at_from;
    if (args.note_created_at_to !== undefined)
      params.note_created_at_to = args.note_created_at_to;

    const data = await bxFetch<{ total: number }>(
      "/api/v1/data/search/count",
      params,
    );
    return { total: data.total };
  },
});

const getDailyNotesStatsSchema = z.object({
  start_date: z.number().describe("集計開始日時（ミリ秒 Unix タイムスタンプ）"),
  end_date: z
    .number()
    .describe(
      "集計終了日時（ミリ秒 Unix タイムスタンプ）。start_date との差は最大30日",
    ),
  language: z
    .string()
    .optional()
    .describe("言語コード（例: ja, en）。省略時は全言語"),
  keywords: z
    .string()
    .optional()
    .describe("カンマ区切りのキーワード（AND検索）"),
});

const getDailyNotesStatsTool = tool({
  description:
    "指定期間（最大30日）の日別コミュニティノート投稿数を返します。公開済み・評価中・未公開の内訳も含まれます。",
  inputSchema: zodSchema(getDailyNotesStatsSchema),
  execute: async (args) => {
    const params: Record<
      string,
      string | number | boolean | string[] | number[]
    > = {
      start_date: args.start_date,
      end_date: args.end_date,
    };
    if (args.language) params.language = args.language;
    if (args.keywords) params.keywords = args.keywords;

    const data = await bxFetch<{
      data: Array<{
        date: string;
        published: number;
        evaluating: number;
        unpublished: number;
        temporarilyPublished: number;
      }>;
      updatedAt: string;
    }>("/api/v1/graphs/daily-notes", params);

    return {
      updatedAt: data.updatedAt,
      items: data.data.map((d) => ({
        date: d.date,
        published: d.published,
        evaluating: d.evaluating,
        unpublished: d.unpublished,
        temporarilyPublished: d.temporarilyPublished,
        total:
          d.published + d.evaluating + d.unpublished + d.temporarilyPublished,
      })),
    };
  },
});

// Returns a Promise to allow future phase-2 MCP client to be merged here:
// const mcpClient = await createMcpClient(...);
// return { ...localTools, ...(await mcpClient.tools()) };
// eslint-disable-next-line @typescript-eslint/promise-function-async
export function getChatTools() {
  return Promise.resolve({
    list_topics: listTopicsTool,
    search_notes: searchNotesTool,
    count_notes: countNotesTool,
    get_daily_notes_stats: getDailyNotesStatsTool,
  });
}
