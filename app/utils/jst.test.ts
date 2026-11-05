import { describe, expect, it } from "vitest";

import {
  addDaysYmd,
  addMonthsYmd,
  dateToYmd,
  endOfMonthYmd,
  jstEndOfDayMs,
  jstStartOfDayMs,
  jstTodayYmd,
  jstYmdToLocalDate,
  msToJstYmd,
  startOfMonthYmd,
} from "./jst";

describe("jst", () => {
  it("JST の日の境界をミリ秒で返す", () => {
    expect(jstStartOfDayMs("2025-12-01")).toBe(1764514800000);
    expect(jstEndOfDayMs("2025-12-01")).toBe(1764601199999);
  });

  it("実行環境の夏時間の切り替え日でも JST の日の境界がずれない", () => {
    for (const ymd of [
      "2026-11-01",
      "2026-10-25",
      "2026-03-08",
      "2026-03-29",
      "2026-01-19",
      "2026-03-07",
      "2026-10-31",
      "2026-03-28",
      "2026-10-24",
    ]) {
      expect(jstStartOfDayMs(ymd)).toBe(Date.parse(`${ymd}T00:00:00+09:00`));
      expect(jstEndOfDayMs(ymd)).toBe(Date.parse(`${ymd}T23:59:59.999+09:00`));
    }
  });

  it("2026年の全日で JST の日の境界がずれない", () => {
    for (
      let d = Date.UTC(2026, 0, 1);
      d < Date.UTC(2027, 0, 1);
      d += 86_400_000
    ) {
      const ymd = new Date(d).toISOString().slice(0, 10);
      expect(jstStartOfDayMs(ymd)).toBe(Date.parse(`${ymd}T00:00:00+09:00`));
      expect(jstEndOfDayMs(ymd)).toBe(Date.parse(`${ymd}T23:59:59.999+09:00`));
    }
  });

  it("ミリ秒を JST の日付に変換する", () => {
    expect(msToJstYmd(1764514799999)).toBe("2025-11-30");
    expect(msToJstYmd(1764514800000)).toBe("2025-12-01");
  });

  it("jstTodayYmd は JST の今日を返す", () => {
    expect(jstTodayYmd(Date.parse("2025-11-30T15:30:00Z"))).toBe("2025-12-01");
    expect(typeof jstTodayYmd()).toBe("string");
  });

  it("日付選択の Date とローカル日付を相互変換する", () => {
    expect(dateToYmd(new Date(2025, 11, 1))).toBe("2025-12-01");
    const d = jstYmdToLocalDate("2025-12-01");
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2025, 11, 1]);
  });

  it("日・月の加減算と月初・月末", () => {
    expect(addDaysYmd("2025-12-31", 1)).toBe("2026-01-01");
    expect(addDaysYmd("2026-03-01", -1)).toBe("2026-02-28");
    expect(startOfMonthYmd("2026-02-10")).toBe("2026-02-01");
    expect(endOfMonthYmd("2026-02-10")).toBe("2026-02-28");
    expect(endOfMonthYmd("2028-02-10")).toBe("2028-02-29");
    expect(addMonthsYmd("2025-12-01", -11)).toBe("2025-01-01");
    expect(addMonthsYmd("2026-03-31", -1)).toBe("2026-02-28");
  });
});
