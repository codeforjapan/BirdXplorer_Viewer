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
