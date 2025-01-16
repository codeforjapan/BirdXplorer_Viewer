/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * FastAPI
 * OpenAPI spec version: 0.1.0
 */
import type { LanguageIdentifier } from "./languageIdentifier";

export type GetNotesApiV1DataNotesGetParams = {
  /**
 * 
データを取得する X のコミュニティノートの ID。

複数回クエリパラメータを指定する / カンマ区切りで複数の ID を指定することで複数のコミュニティノートを一括で取得できる。

 */
  note_ids?: string[] | null;
  /**
 * 
取得するコミュニティノートの作成日時の下限。**指定した日時と同時かそれより新しい**コミュニティノートのみを取得する。

指定する形式は UNIX EPOCH TIME (ミリ秒) 。

 */
  created_at_from?: number | null;
  /**
 * 
取得するコミュニティノートの作成日時の上限。**指定した日時よりも古い**コミュニティノートのみを取得する。

指定する形式は UNIX EPOCH TIME (ミリ秒) 。

 */
  created_at_to?: number | null;
  /**
 * 
取得するコミュニティノートのリストの先頭からのオフセット。ページネーションに利用される。


ただし、レスポンスの `meta.next` や `meta.prev` で次のページや前のページのリクエスト用 URL が提供されるため、
そちらを利用したほうが良い場合もある。

 */
  offset?: number;
  /**
 * 
取得するコミュニティノートのリストの最大数。 0 ～ 1000 まで指定できる。ページネーションに利用される。


ただし、レスポンスの `meta.next` や `meta.prev` で次のページや前のページのリクエスト用 URL が提供されるため、
そちらを利用したほうが良い場合もある。

 */
  limit?: number;
  /**
 * 
取得するコミュニティノートが紐づいているトピックの ID。

`GET /api/v1/data/topics` で取得できるトピックの ID を指定することで、そのトピックに紐づいたコミュニティノートを取得できる。

複数指定した場合は、 **いずれかのトピックに紐づいたコミュニティノート** を取得する。 (AND 検索ではなく OR 検索になる)

 */
  topic_ids?: number[] | null;
  /**
 * 
コミュニティノートのデータ取得に利用する X の Post の ID。
コミュニティノートと Post は 1 : 1 で紐づいている。

複数回クエリパラメータを指定する / カンマ区切りで複数の ID を指定することで複数のコミュニティノートを一括で取得できる。

 */
  post_ids?: string[] | null;
  /**
 * 
取得するコミュニティノートのステータス。

| X 上の表示                                         | current_statusに指定する値  |
| :------------------------------------------------: | :-------------------------: |
| さらに評価が必要                                   | NEEDS_MORE_RATINGS          |
| 現在のところ「役に立った」と評価されています       | CURRENTLY_RATED_HELPFUL     |
| 現在のところ「役に立たなかった」と評価されています | CURRENTLY_RATED_NOT_HELPFUL |

 */
  current_status?: string[] | null;
  /**
 * 
取得するコミュニティノートの言語。

ISO 639-1 に準拠した 2 文字の言語コードを指定することで、その言語のコミュニティノートのみを取得できる。

 */
  language?: LanguageIdentifier | null;
  /**
 * 
指定した文字列を含む Note を検索して取得する。検索は Note の**Summaryに対して**行われる。

 */
  search_text?: string | null;
};
