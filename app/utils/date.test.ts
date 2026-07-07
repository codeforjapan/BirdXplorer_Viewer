import { afterEach, describe, expect, test } from "vitest";

import { dateStrFromUnixMs, unixMsFromDateStr } from "./date";

const originalTz = process.env.TZ;

afterEach(() => {
  process.env.TZ = originalTz;
});

describe("unixMsFromDateStr", () => {
  test("YYYY-MM-DD をローカルタイム 0 時の unix ms 文字列に変換する（JST）", () => {
    process.env.TZ = "Asia/Tokyo";
    // 2026-07-01T00:00:00+09:00
    expect(unixMsFromDateStr("2026-07-01")).toBe("1782831600000");
  });

  test("YYYY-MM-DD をローカルタイム 0 時の unix ms 文字列に変換する（America/New_York）", () => {
    process.env.TZ = "America/New_York";
    // 2026-07-01T00:00:00-04:00 (EDT)
    expect(unixMsFromDateStr("2026-07-01")).toBe("1782878400000");
  });

  test("null は undefined を返す", () => {
    expect(unixMsFromDateStr(null)).toBeUndefined();
  });

  test("不正な文字列は undefined を返す", () => {
    expect(unixMsFromDateStr("not-a-date")).toBeUndefined();
    expect(unixMsFromDateStr("2026-13-99")).toBeUndefined();
  });

  test("dateStrFromUnixMs と往復しても日付が変わらない", () => {
    process.env.TZ = "Asia/Tokyo";
    expect(dateStrFromUnixMs(unixMsFromDateStr("2026-07-01"))).toBe(
      "2026-07-01",
    );
  });
});

describe("dateStrFromUnixMs", () => {
  test("unix ms をローカルタイムの YYYY-MM-DD に変換する（JST）", () => {
    process.env.TZ = "Asia/Tokyo";
    // 1782831600000 = 2026-07-01T00:00:00+09:00
    expect(dateStrFromUnixMs(1782831600000)).toBe("2026-07-01");
    expect(dateStrFromUnixMs("1782831600000")).toBe("2026-07-01");
  });

  test("不正な値は null を返す", () => {
    expect(dateStrFromUnixMs(null)).toBeNull();
    expect(dateStrFromUnixMs(undefined)).toBeNull();
    expect(dateStrFromUnixMs("abc")).toBeNull();
  });
});
