/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * FastAPI
 * OpenAPI spec version: 0.1.0
 */
import type { LanguageIdentifier } from "./languageIdentifier";

export type SearchApiV1DataSearchGetParams = {
  /**
 * 
指定した文字列を含む Note を検索して取得する。検索は Note の**Summaryに対して**行われる。

 */
  note_includes_text?: string | null;
  /**
 * 
指定した文字列を含む Note を検索して取得する。検索は Note の**Summaryに対して**行われる。

 */
  note_excludes_text?: string | null;
  /**
 * 
指定した文字列を含む Post を検索して取得する。検索は Post の**本文に対して**行われる。

 */
  post_includes_text?: string | null;
  /**
 * 
指定した文字列を含む Post を検索して取得する。検索は Post の**本文に対して**行われる。

 */
  post_excludes_text?: string | null;
  /**
 * 
取得するコミュニティノートの言語。

ISO 639-1 に準拠した 2 文字の言語コードを指定することで、その言語のコミュニティノートのみを取得できる。

 */
  language?: LanguageIdentifier | null;
  /**
 * 
取得するコミュニティノートが紐づいているトピックの ID。

`GET /api/v1/data/topics` で取得できるトピックの ID を指定することで、そのトピックに紐づいたコミュニティノートを取得できる。

複数指定した場合は、 **いずれかのトピックに紐づいたコミュニティノート** を取得する。 (AND 検索ではなく OR 検索になる)

 */
  topic_ids?: number[] | null;
  /**
 * 
取得するコミュニティノートのステータス。

| X 上の表示                                         | current_statusに指定する値  |
| :------------------------------------------------: | :-------------------------: |
| さらに評価が必要                                   | NEEDS_MORE_RATINGS          |
| 現在のところ「役に立った」と評価されています       | CURRENTLY_RATED_HELPFUL     |
| 現在のところ「役に立たなかった」と評価されています | CURRENTLY_RATED_NOT_HELPFUL |

 */
  note_status?: string[] | null;
  /**
 * 
取得するコミュニティノートの作成日時の下限。**指定した日時と同時かそれより新しい**コミュニティノートのみを取得する。

指定する形式は UNIX EPOCH TIME (ミリ秒) 。

 */
  note_created_at_from?: number | string | null;
  /**
 * 
取得するコミュニティノートの作成日時の上限。**指定した日時よりも古い**コミュニティノートのみを取得する。

指定する形式は UNIX EPOCH TIME (ミリ秒) 。

 */
  note_created_at_to?: number | string | null;
  /**
   * Xのユーザー名
   */
  x_user_names?: string[] | null;
  /**
   * Xのユーザーのフォロワー数。
   */
  x_user_followers_count_from?: number | null;
  /**
   * Xのユーザーのフォロー数。
   */
  x_user_follow_count_from?: number | null;
  /**
   * Postのお気に入り数。
   */
  post_favorite_count_from?: number | null;
  /**
   * Postのリポスト数。
   */
  post_repost_count_from?: number | null;
  /**
   * Postのインプレッション数。
   */
  post_impression_count_from?: number | null;
  /**
   * メディア情報を含んでいるか。
   */
  post_includes_media?: boolean;
  /**
 * 
取得する Post のリストの先頭からのオフセット。ページネーションに利用される。


ただし、レスポンスの `meta.next` や `meta.prev` で次のページや前のページのリクエスト用 URL が提供されるため、
そちらを利用したほうが良い場合もある。

 */
  offset?: number;
  /**
 * 
取得する Post のリストの最大数。 0 ～ 1000 まで指定できる。ページネーションに利用される。


ただし、 `meta.next` や `meta.prev` で次のページや前のページのリクエスト用 URL が提供されるため、
そちらを利用したほうが良い場合もある。

 */
  limit?: number;
};
