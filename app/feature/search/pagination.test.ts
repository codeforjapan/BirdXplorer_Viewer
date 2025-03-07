import { getQuery } from "ufo";
import { describe, expect, test } from "vitest";
import type { z } from "zod";

import type { PaginationMeta } from "../../generated/api/schemas/paginationMeta";
import { buildPaginationMeta } from "./pagination";
import type { noteSearchParamSchema } from "./validation";

describe("buildPaginationMeta", () => {
  test("API 修正前ロジック: 現在のクエリパラメータから PaginationMeta を生成できる", () => {
    const currentQuery = {
      post_includes_text: "地震",
      limit: 10,
      offset: 10,
    } satisfies z.infer<typeof noteSearchParamSchema>;

    // API が limit, offset 以外のクエリパラメータを削除してしまう挙動を再現
    const currentBrokenMeta = {
      next: "https://example.com/api/v1/data/search?offset=20&limit=10",
      prev: "https://example.com/api/v1/data/search?offset=0&limit=10",
    } satisfies PaginationMeta;

    const paginationMeta = buildPaginationMeta(currentBrokenMeta, currentQuery);
    const prevQuery = paginationMeta.prev
      ? getQuery(paginationMeta.prev)
      : null;
    const nextQuery = paginationMeta.next
      ? getQuery(paginationMeta.next)
      : null;

    expect(prevQuery).toStrictEqual({
      limit: "10",
      offset: "0",
      post_includes_text: "地震",
    });
    expect(nextQuery).toStrictEqual({
      limit: "10",
      offset: "20",
      post_includes_text: "地震",
    });
  });

  test("API 修正前ロジック: offset が 0 より大きい AND limit より小さい場合も prev を生成できる", () => {
    const currentQuery = {
      post_includes_text: "地震",
      limit: 15,
      offset: 10,
    } satisfies z.infer<typeof noteSearchParamSchema>;

    // API が limit, offset 以外のクエリパラメータを削除してしまう挙動を再現
    const currentBrokenMeta = {
      next: "https://example.com/api/v1/data/search?offset=25&limit=15",
      prev: "https://example.com/api/v1/data/search?offset=0&limit=15",
    } satisfies PaginationMeta;

    const fixedMeta = buildPaginationMeta(currentBrokenMeta, currentQuery);
    const prevQuery = fixedMeta.prev ? getQuery(fixedMeta.prev) : null;

    expect(prevQuery).toStrictEqual({
      limit: "15",
      offset: "0",
      post_includes_text: "地震",
    });
  });

  test("API 修正前ロジック: 前のページが存在しない場合に prev が null になる", () => {
    const currentQuery = {
      post_includes_text: "地震",
      limit: 10,
      offset: 0,
    } satisfies z.infer<typeof noteSearchParamSchema>;

    // API が limit, offset 以外のクエリパラメータを削除してしまう挙動を再現
    const currentBrokenMeta = {
      next: "https://example.com/api/v1/data/search?offset=10&limit=10",
      prev: null,
    } satisfies PaginationMeta;

    const fixedMeta = buildPaginationMeta(currentBrokenMeta, currentQuery);

    const prevQuery = fixedMeta.prev ? getQuery(fixedMeta.prev) : null;

    expect(prevQuery).toBe(null);
  });
});
