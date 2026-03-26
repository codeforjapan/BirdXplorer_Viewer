import type { GraphApiErrorKind } from "./api";
import type { CategoryConfig } from "./ScatterBubbleChart";
import type { EventMarker, PeriodOption, PeriodRangeValue } from "./types";

/**
 * ステータスカラー定数
 * グラフやフィルターコンポーネントで使用
 */
export const STATUS_COLORS = {
  published: "#ab47bc", // 公開中: 紫
  evaluating: "#42a5f5", // 評価中: 水色
  unpublished: "#2979ff", // 非公開: 青
  temporarilyPublished: "#ec407a", // 一時公開: ピンク
} as const;

export type StatusColorKey = keyof typeof STATUS_COLORS;

/**
 * ステータスの日本語ラベル
 */
export const STATUS_LABELS = {
  published: "公開中",
  evaluating: "評価中",
  unpublished: "非公開",
  temporarilyPublished: "一時公開",
} as const;

export type StatusLabelKey = keyof typeof STATUS_LABELS;

/**
 * ステータスの値（フィルター用）
 * "all" を含む
 */
export type StatusValue =
  | "all"
  | "published"
  | "evaluating"
  | "unpublished"
  | "temporarilyPublished";

/**
 * バブルチャート用カテゴリ設定（4種類）
 * ScatterBubbleChartのcategoriesに使用
 */
export const STATUS_CATEGORIES: CategoryConfig[] = [
  {
    key: "published",
    name: STATUS_LABELS.published,
    color: STATUS_COLORS.published,
  },
  {
    key: "evaluating",
    name: STATUS_LABELS.evaluating,
    color: STATUS_COLORS.evaluating,
  },
  {
    key: "unpublished",
    name: STATUS_LABELS.unpublished,
    color: STATUS_COLORS.unpublished,
  },
  {
    key: "temporarilyPublished",
    name: STATUS_LABELS.temporarilyPublished,
    color: STATUS_COLORS.temporarilyPublished,
  },
];

/**
 * フィルター用オプション（4種類 + 全て）
 * GraphStatusFilterのstatusesに使用
 */
export const STATUS_FILTER_OPTIONS = [
  { value: "all" as const, label: "全て" },
  {
    value: "published" as const,
    label: STATUS_LABELS.published,
    color: STATUS_COLORS.published,
  },
  {
    value: "evaluating" as const,
    label: STATUS_LABELS.evaluating,
    color: STATUS_COLORS.evaluating,
  },
  {
    value: "unpublished" as const,
    label: STATUS_LABELS.unpublished,
    color: STATUS_COLORS.unpublished,
  },
  {
    value: "temporarilyPublished" as const,
    label: STATUS_LABELS.temporarilyPublished,
    color: STATUS_COLORS.temporarilyPublished,
  },
];

/**
 * グラフスタイル定数
 * EChartsはCanvas/SVGベースのためCSS変数が使えないので、ここで定義
 */
export const GRAPH_STYLES = {
  /** テキスト色（軸ラベル、凡例など） */
  textColor: "#999999",
  /** 軸線の色 */
  axisColor: "#666666",
  /** グリッド線の色 */
  gridColor: "#333333",
  /** ボーダー色 */
  borderColor: "#555555",
  /** ツールチップ背景色 */
  tooltipBgColor: "rgba(30, 30, 30, 0.9)",
  /** ツールチップボーダー色 */
  tooltipBorderColor: "#444444",
} as const;

/**
 * ステータスキーから日本語ラベルを取得するヘルパー
 */
export const getStatusLabel = (status: string): string => {
  return STATUS_LABELS[status as StatusLabelKey] ?? status;
};

export type DefaultPeriodValue =
  | "1week"
  | "1month"
  | "3months"
  | "6months"
  | "1year";

export const DEFAULT_PERIOD_OPTIONS: Array<{
  value: DefaultPeriodValue;
  label: string;
}> = [
  { value: "1week", label: "直近1週間" },
  { value: "1month", label: "直近1ヶ月" },
  { value: "3months", label: "直近3ヶ月" },
  { value: "6months", label: "直近6ヶ月" },
  { value: "1year", label: "直近1年" },
];

/**
 * 相対期間の値（フロントエンドで管理）
 */
export type RelativePeriodValue =
  | "1week"
  | "1month"
  | "3months"
  | "6months"
  | "1year";

export const RELATIVE_PERIOD_OPTIONS: Array<PeriodOption<RelativePeriodValue>> =
  [
    { value: "1month", label: "直近1ヶ月" },
    { value: "3months", label: "直近3ヶ月" },
    { value: "6months", label: "直近6ヶ月" },
    { value: "1year", label: "直近1年" },
  ];

export const DEFAULT_EVALUATION_PERIOD: RelativePeriodValue = "6months";

export const API_DAILY_POST_COUNT_PERIOD_OPTIONS: Array<
  PeriodOption<PeriodRangeValue>
> = [
  { value: "2025-02_2026-01", label: "2025/02 〜 2026/01" },
  { value: "2024-02_2025-01", label: "2024/02 〜 2025/01" },
  { value: "2023-02_2024-01", label: "2023/02 〜 2024/01" },
];

export const API_NOTES_ANNUAL_PERIOD_OPTIONS: Array<
  PeriodOption<PeriodRangeValue>
> = [
  { value: "2025-02_2026-01", label: "2025/02 〜 2026/01" },
  { value: "2024-02_2025-01", label: "2024/02 〜 2025/01" },
  { value: "2023-02_2024-01", label: "2023/02 〜 2024/01" },
];

/**
 * イベントマーカーのデフォルトラベル
 */
export const EVENT_MARKER_LABELS = ["公示", "投開票"] as const;

/**
 * API向けのイベントマーカー（仮置き）
 * 形式さえ合えばOKとのことなので固定値を使用
 */
export const API_EVENT_MARKERS_RELATIVE: EventMarker[] = [
  // { date: "2025-02-01", label: "2/1 公示" },
  // { date: "2025-02-15", label: "2/15 投開票" },
] as const;

export const API_EVENT_MARKERS_RANGE: EventMarker[] = [
  // { date: "2025-03-01", label: "3/1 公示" },
  // { date: "2025-03-20", label: "3/20 投開票" },
] as const;

export const DEFAULT_GRAPH_ERROR_MESSAGES: Record<GraphApiErrorKind, string> = {
  network: "通信エラーが発生しました。時間をおいて再試行してください。",
  validation: "パラメータが不正です。期間やフィルターを確認してください。",
  server: "サーバー側でエラーが発生しました。",
  parse: "取得したデータ形式が期待と異なります。",
};
