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

