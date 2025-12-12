/**
 * ステータスカラー定数
 * グラフやフィルターコンポーネントで使用
 */
export const STATUS_COLORS = {
  unpublished: "#2979ff", // 非公開: 青
  evaluating: "#42a5f5", // 評価中: 水色
  published: "#ab47bc", // 公開済み: 紫
  temporarilyPublished: "#ec407a", // 一時公開: ピンク
} as const;

export type StatusColorKey = keyof typeof STATUS_COLORS;

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

