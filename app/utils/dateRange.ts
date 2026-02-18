import dayjs from "dayjs";

import type { RelativePeriodValue } from "~/components/graph/constants";
import type { PeriodRangeValue } from "~/components/graph/types";

export type DateRangeTimestamps = {
  start_date: number;
  end_date: number;
};

/**
 * Dateオブジェクトの範囲をUNIXミリ秒に変換
 */
export const dateRangeToTimestamps = (
  dateRange: [Date | null, Date | null]
): DateRangeTimestamps | null => {
  const [start, end] = dateRange;
  if (!start || !end) return null;

  return {
    start_date: dayjs(start).startOf("day").valueOf(),
    end_date: dayjs(end).endOf("day").valueOf(),
  };
};

/**
 * 相対的な期間（"1month", "3months"など）をUNIXミリ秒の範囲に変換
 */
export const relativePeriodToTimestamps = (
  period: RelativePeriodValue
): DateRangeTimestamps => {
  const now = dayjs();
  const end = now.endOf("day");

  let start: dayjs.Dayjs;
  switch (period) {
    case "1week":
      start = now.subtract(1, "week").startOf("day");
      break;
    case "1month":
      start = now.subtract(1, "month").startOf("day");
      break;
    case "3months":
      start = now.subtract(3, "month").startOf("day");
      break;
    case "6months":
      start = now.subtract(6, "month").startOf("day");
      break;
    case "1year":
      start = now.subtract(1, "year").startOf("day");
      break;
    default:
      start = now.subtract(6, "month").startOf("day");
  }

  return {
    start_date: start.valueOf(),
    end_date: end.valueOf(),
  };
};

/**
 * 期間範囲（"2025-02_2026-01"形式）をUNIXミリ秒の範囲に変換
 */
export const periodRangeToTimestamps = (
  range: PeriodRangeValue
): DateRangeTimestamps => {
  const [startMonth, endMonth] = range.split("_");

  const start = dayjs(startMonth, "YYYY-MM").startOf("month");
  const end = dayjs(endMonth, "YYYY-MM").endOf("month");

  return {
    start_date: start.valueOf(),
    end_date: end.valueOf(),
  };
};

/**
 * UNIXミリ秒の範囲をDateオブジェクトの範囲に変換
 */
export const timestampsToDateRange = (
  timestamps: DateRangeTimestamps
): [Date, Date] => {
  return [
    dayjs(timestamps.start_date).toDate(),
    dayjs(timestamps.end_date).toDate(),
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
  const now = dayjs();
  return {
    start_date: now.subtract(17, "day").startOf("day").valueOf(),
    end_date: now.subtract(3, "day").endOf("day").valueOf(),
  };
};
