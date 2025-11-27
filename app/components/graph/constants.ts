/**
 * ステータスカラー定数
 * グラフやフィルターコンポーネントで使用
 */
export const STATUS_COLORS = {
  published: "#42a5f5",
  evaluating: "#ab47bc",
  unpublished: "#ec407a",
} as const;

export type StatusColorKey = keyof typeof STATUS_COLORS;

