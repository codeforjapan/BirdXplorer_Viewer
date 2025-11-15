import { parseURL, stringifyParsedURL, withQuery } from "ufo";
import type { z } from "zod";

import type { PaginationMeta } from "~/generated/api/schemas/paginationMeta";

import type { noteSearchParamSchema } from "./validation";

/**
 * API 側のページネーション情報が正しい情報を返すようになるまで、現在のパラメータから次のページと前のページの URL を生成する
 * @param meta
 * API が返したページネーション情報。前後ページが存在するかどうかの確認にのみ使用する
 * @param currentQuery
 * 現在のクエリパラメータ
 * @returns
 * 修正後のページネーション情報
 */
// API が正常な PaginationMeta を返すようになったらこの巻数で計算する必要はない
export const buildPaginationMeta = (
  meta: PaginationMeta,
  currentQuery: z.infer<typeof noteSearchParamSchema>,
): PaginationMeta => {
  const { limit, offset, ...rest } = currentQuery;

  if (meta.next == null && meta.prev == null) {
    return {
      next: null,
      prev: null,
    };
  }

  const nextOffset = offset + limit;

  // offset が 0: 前のページが存在しない
  // offset が 10, limit が 15: 前のページが存在する
  const prevOffset = Math.max(offset - limit, 0);

  const isFirstPage = offset === 0;

  // 必ず prev か next が存在する
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const url = parseURL((meta.prev ?? meta.next)!);
  url.search = "";
  const baseUrl = stringifyParsedURL(url);

  return {
    next:
      meta.next != null
        ? withQuery(baseUrl, { ...rest, limit, offset: nextOffset })
        : null,
    prev:
      isFirstPage || meta.prev == null
        ? null
        : withQuery(baseUrl, { ...rest, limit, offset: prevOffset }),
  };
};
