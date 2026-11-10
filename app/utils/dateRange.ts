import type { RelativePeriodValue } from "~/components/graph/constants";
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
} from "~/utils/jst";

export type DateRangeTimestamps = {
  start_date: number;
  end_date: number;
};

/**
 * Dateオブジェクトの範囲をUNIXミリ秒に変換（選んだ日を JST の日として扱う）
 */
export const dateRangeToTimestamps = (
  dateRange: [Date | null, Date | null],
): DateRangeTimestamps | null => {
  const [start, end] = dateRange;
  if (!start || !end) return null;

  return {
    start_date: jstStartOfDayMs(dateToYmd(start)),
    end_date: jstEndOfDayMs(dateToYmd(end)),
  };
};

/**
 * 相対的な期間（"1month", "3months"など）をUNIXミリ秒の範囲に変換
 */
export const relativePeriodToTimestamps = (
  period: RelativePeriodValue,
): DateRangeTimestamps => {
  const today = jstTodayYmd();

  let start: string;
  switch (period) {
    case "1week":
      start = addDaysYmd(today, -7);
      break;
    case "1month":
      start = addMonthsYmd(today, -1);
      break;
    case "3months":
      start = addMonthsYmd(today, -3);
      break;
    case "6months":
      start = addMonthsYmd(today, -6);
      break;
    case "1year":
      start = addMonthsYmd(today, -12);
      break;
    default:
      start = addMonthsYmd(today, -6);
  }

  return {
    start_date: jstStartOfDayMs(start),
    end_date: jstEndOfDayMs(today),
  };
};

/**
 * 期間範囲（"2025-02_2026-01"形式）をUNIXミリ秒の範囲に変換
 */
export const periodRangeToTimestamps = (range: string): DateRangeTimestamps => {
  const [startMonth, endMonth] = range.split("_");

  return {
    start_date: jstStartOfDayMs(`${startMonth}-01`),
    end_date: jstEndOfDayMs(endOfMonthYmd(`${endMonth}-01`)),
  };
};

/**
 * UNIXミリ秒の範囲をDateオブジェクトの範囲に変換（JST の日付をローカルの Date にする）
 */
export const timestampsToDateRange = (
  timestamps: DateRangeTimestamps,
): [Date, Date] => {
  return [
    jstYmdToLocalDate(msToJstYmd(timestamps.start_date)),
    jstYmdToLocalDate(msToJstYmd(timestamps.end_date)),
  ];
};

/**
 * デフォルトの日付範囲を取得（直近6ヶ月）
 */
export const getDefaultDateRange = (): [Date, Date] => {
  const timestamps = relativePeriodToTimestamps("6months");
  return timestampsToDateRange(timestamps);
};

/**
 * コミュニティノート評価分布図のデフォルト範囲を取得（3日前〜17日前）
 */
export const getDefault14DayRange = (): DateRangeTimestamps => {
  const today = jstTodayYmd();
  return {
    start_date: jstStartOfDayMs(addDaysYmd(today, -17)),
    end_date: jstEndOfDayMs(addDaysYmd(today, -3)),
  };
};

/**
 * 年次グラフのデフォルト範囲を取得（今月を含む過去12ヶ月）
 */
export const getDefault12MonthRange = (): DateRangeTimestamps => {
  const today = jstTodayYmd();
  return {
    start_date: jstStartOfDayMs(startOfMonthYmd(addMonthsYmd(today, -11))),
    end_date: jstEndOfDayMs(endOfMonthYmd(today)),
  };
};

export type AccountRankingPeriod = "1week" | "2weeks" | "1month";

/**
 * アカウントランキング用の期間をUNIXミリ秒の範囲に変換
 * 終了日は常に2日前、開始日は期間に応じて 9/16/32 日前
 */
export const rankingPeriodToTimestamps = (
  period: AccountRankingPeriod,
): DateRangeTimestamps => {
  const today = jstTodayYmd();

  let startDaysAgo: number;
  switch (period) {
    case "1week":
      startDaysAgo = 9;
      break;
    case "2weeks":
      startDaysAgo = 16;
      break;
    case "1month":
      startDaysAgo = 31;
      break;
    default:
      startDaysAgo = 9;
  }

  return {
    start_date: jstStartOfDayMs(addDaysYmd(today, -startDaysAgo)),
    end_date: jstEndOfDayMs(addDaysYmd(today, -2)),
  };
};
