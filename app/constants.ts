/**
 * BirdXplorer API のベースURL。
 * orval.config.ts の baseUrl と一致させること。
 * 環境変数 VITE_API_BASE_URL で上書き可能。
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://dev.api-birdxplorer.code4japan.org";
