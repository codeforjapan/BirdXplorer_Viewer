/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * FastAPI
 * OpenAPI spec version: 0.1.0
 */
import type { Link } from "./link";
import type { Media } from "./media";
import type { XUser } from "./xUser";

export interface Post {
  /**
   * Post の作成日時 (ミリ秒単位の UNIX EPOCH TIMESTAMP)
   * @minimum 1152921600000
   * @maximum 1734933018424
   */
  createdAt: number;
  /**
   * Post の表示回数
   * @minimum 0
   */
  impressionCount: number;
  /**
   * Post のいいね数
   * @minimum 0
   */
  likeCount: number;
  /**
   * Post を X 上で表示する URL
   * @minLength 1
   * @maxLength 2083
   */
  readonly link: string;
  /** Post に含まれるリンク情報のリスト */
  links?: Link[];
  /** Post に含まれるメディア情報のリスト */
  mediaDetails?: Media[];
  /**
   * X の Post の ID
   * @pattern ^([0-9]{1,19}|)$
   */
  postId: string;
  /**
   * Post のリポスト数
   * @minimum 0
   */
  repostCount: number;
  /** Post の本文 */
  text: string;
  /** Post を投稿したユーザーの情報 */
  xUser: XUser;
  /**
   * Post を投稿したユーザーの ID。`xUser.userId` と同じ
   * @pattern ^([0-9]{1,19}|)$
   */
  xUserId: string;
}