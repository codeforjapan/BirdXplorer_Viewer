import dayjs from "dayjs";

import type { MonthlyNoteData, PeriodRangeValue } from "~/components/graph";
import type { PeriodOption } from "~/components/graph/types";

import { NOTES_ANNUAL_PERIOD_OPTIONS } from "./periodOptions";

// 共通型を再エクスポート
export type { MonthlyNoteData } from "~/components/graph";

export type NotesAnnualApiResponse = {
  data: MonthlyNoteData[];
  updatedAt: string;
};

const resolvePeriod = (
  period: PeriodRangeValue | undefined,
  periodOptions: Array<PeriodOption<PeriodRangeValue>>,
  defaultPeriod?: PeriodRangeValue
): PeriodRangeValue => {
  if (period && periodOptions.some((option) => option.value === period)) {
    return period;
  }
  if (
    defaultPeriod &&
    periodOptions.some((option) => option.value === defaultPeriod)
  ) {
    return defaultPeriod;
  }
  return (
    periodOptions[0]?.value ??
    defaultPeriod ??
    NOTES_ANNUAL_PERIOD_OPTIONS[0]!.value
  );
};

/**
 * @param period 期間文字列（例: "2024-10_2025-09"）
 * @throws 不正なフォーマットの場合
 */
const parsePeriod = (
  period: PeriodRangeValue
): { start: dayjs.Dayjs; end: dayjs.Dayjs } => {
  const [startStr, endStr] = period.split("_");
  if (!startStr || !endStr) {
    throw new Error(`Invalid period format: ${period}`);
  }
  const start = dayjs(startStr, "YYYY-MM").startOf("month");
  const end = dayjs(endStr, "YYYY-MM").startOf("month");
  return { start, end };
};

const buildMonths = (start: dayjs.Dayjs, end: dayjs.Dayjs): string[] => {
  const months: string[] = [];
  let cursor = start.startOf("month");
  const endMonth = end.startOf("month");

  while (cursor.isBefore(endMonth) || cursor.isSame(endMonth)) {
    months.push(cursor.format("YYYY-MM"));
    cursor = cursor.add(1, "month");
  }

  return months;
};

/** 12ヶ月分のモックデータを生成 */
export const generateMockData = (
  period: PeriodRangeValue
): MonthlyNoteData[] => {
  const { start, end } = parsePeriod(period);
  const months = buildMonths(start, end);

  return months.map((month) => {
    const published = Math.floor(Math.random() * 800) + 600;
    const evaluating = Math.floor(Math.random() * 500) + 300;
    const unpublished = Math.floor(Math.random() * 400) + 200;
    const temporarilyPublished = Math.floor(Math.random() * 200) + 100;
    const total = published + evaluating + unpublished + temporarilyPublished;
    const publicationRate = Math.round((published / total) * 100);

    return {
      month,
      published,
      evaluating,
      unpublished,
      temporarilyPublished,
      publicationRate,
    };
  });
};

export const createMockResponse = (
  period?: PeriodRangeValue
): NotesAnnualApiResponse => {
  const defaultPeriod = NOTES_ANNUAL_PERIOD_OPTIONS[0]!.value;
  const resolvedPeriod = resolvePeriod(
    period,
    NOTES_ANNUAL_PERIOD_OPTIONS,
    defaultPeriod
  );
  const data = generateMockData(resolvedPeriod);
  const lastMonth = data[data.length - 1]?.month;
  const updatedAt = lastMonth
    ? dayjs(lastMonth, "YYYY-MM").endOf("month").format("YYYY-MM-DD")
    : dayjs().format("YYYY-MM-DD");

  return {
    data,
    updatedAt,
  };
};
