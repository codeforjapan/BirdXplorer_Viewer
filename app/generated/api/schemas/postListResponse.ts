/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * FastAPI
 * OpenAPI spec version: 0.1.0
 */
import type { Post } from "./post";
import type { PaginationMeta } from "./paginationMeta";

export interface PostListResponse {
  /** X の Post のリスト */
  data: Post[];
  /** ページネーション用情報。 リクエスト時に指定した offset / limit の値に応じて、次のページや前のページのリクエスト用 URL が設定される。 */
  meta: PaginationMeta;
}