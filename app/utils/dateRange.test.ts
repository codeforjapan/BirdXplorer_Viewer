import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  dateRangeToTimestamps,
  getDefault12MonthRange,
  getDefault14DayRange,
  periodRangeToTimestamps,
  rankingPeriodToTimestamps,
  relativePeriodToTimestamps,
  timestampsToDateRange,
} from "./dateRange";
import { dateToYmd, jstEndOfDayMs, jstStartOfDayMs } from "./jst";

describe("dateRange", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // JST 2026-11-06 01:00
    vi.setSystemTime(Date.parse("2026-11-05T16:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("年次グラフの既定範囲は JST の今月を含む過去12ヶ月", () => {
    expect(getDefault12MonthRange()).toEqual({
      start_date: 1764514800000, // 2025-12-01 JST
      end_date: 1796050799999, // 2026-11-30T23:59:59.999 JST
    });
  });

  it("ランキングの期間は JST の今日から数える", () => {
    expect(rankingPeriodToTimestamps("1week")).toEqual({
      start_date: jstStartOfDayMs("2026-10-28"),
      end_date: jstEndOfDayMs("2026-11-04"),
    });
  });

  it("評価分布図の既定範囲は JST の今日から数える", () => {
    expect(getDefault14DayRange()).toEqual({
      start_date: jstStartOfDayMs("2026-10-20"),
      end_date: jstEndOfDayMs("2026-11-03"),
    });
  });

  it("相対期間は JST の今日から数える", () => {
    expect(relativePeriodToTimestamps("1week")).toEqual({
      start_date: jstStartOfDayMs("2026-10-30"),
      end_date: jstEndOfDayMs("2026-11-06"),
    });
    expect(relativePeriodToTimestamps("6months")).toEqual({
      start_date: jstStartOfDayMs("2026-05-06"),
      end_date: jstEndOfDayMs("2026-11-06"),
    });
    expect(relativePeriodToTimestamps("1year")).toEqual({
      start_date: jstStartOfDayMs("2025-11-06"),
      end_date: jstEndOfDayMs("2026-11-06"),
    });
  });

  it("期間範囲は開始月1日〜終了月末日の JST", () => {
    expect(periodRangeToTimestamps("2025-02_2026-01")).toEqual({
      start_date: jstStartOfDayMs("2025-02-01"),
      end_date: jstEndOfDayMs("2026-01-31"),
    });
  });

  it("日付選択の日を JST の日として扱う", () => {
    expect(
      dateRangeToTimestamps([new Date(2025, 11, 1), new Date(2025, 11, 1)]),
    ).toEqual({ start_date: 1764514800000, end_date: 1764601199999 });
  });

  it("ミリ秒の範囲を JST の日付の Date にする", () => {
    expect(
      timestampsToDateRange({
        start_date: 1764514800000,
        end_date: 1764601199999,
      }).map(dateToYmd),
    ).toEqual(["2025-12-01", "2025-12-01"]);
  });
});
