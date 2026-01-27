import dayjs from "dayjs";

import type { DailyPostCountDataItem, PeriodRangeValue } from "~/components/graph";
import { getDefaultPeriodValue } from "~/components/graph";
import { getDailyPostCountPeriodOptions } from "~/components/graph/periodOptions";
import type { PeriodOption } from "~/components/graph/types";

export type DailyPostCountApiResponse = {
  data: DailyPostCountDataItem[];
  updatedAt: string;
  eventMarkers?: Array<{ date: string; label: string }>;
};

const parsePeriod = (period: PeriodRangeValue): { start: dayjs.Dayjs; end: dayjs.Dayjs } => {
  const [startStr, endStr] = period.split("_");
  const start = dayjs(startStr, "YYYY-MM").startOf("month");
  const end = dayjs(endStr, "YYYY-MM").endOf("month");
  return { start, end };
};

const resolvePeriod = (
  period: PeriodRangeValue | undefined,
  periodOptions: Array<PeriodOption<PeriodRangeValue>>
): PeriodRangeValue => {
  if (period && periodOptions.some((option) => option.value === period)) {
    return period;
  }
  return getDefaultPeriodValue(periodOptions);
};

export const generateMockData = (period?: PeriodRangeValue): DailyPostCountDataItem[] => {
  const resolvedPeriod = resolvePeriod(period, getDailyPostCountPeriodOptions());
  const { start, end } = parsePeriod(resolvedPeriod);

  const days: DailyPostCountDataItem[] = [];
  const totalDays = end.diff(start, "day") + 1;

  for (let d = 0; d < totalDays; d++) {
    const date = start.add(d, "day");
    const iso = date.format("YYYY-MM-DD");

    // モックデータ: 日ごとにランダムな変動（ステータス別）
    const base = 800 + Math.random() * 600;
    const published = Math.max(0, Math.floor(base * 0.3 + Math.random() * 200));
    const evaluating = Math.max(0, Math.floor(base * 0.4 + Math.random() * 250));
    const unpublished = Math.max(0, Math.floor(base * 0.2 + Math.random() * 120));
    const temporarilyPublished = Math.max(
      0,
      Math.floor(base * 0.1 + Math.random() * 80)
    );

    days.push({
      date: iso,
      published,
      evaluating,
      unpublished,
      temporarilyPublished,
    });
  }

  return days;
};

export const createMockResponse = (period?: PeriodRangeValue): DailyPostCountApiResponse => {
  const resolvedPeriod = resolvePeriod(period, getDailyPostCountPeriodOptions());
  const data = generateMockData(resolvedPeriod);

  return {
    data,
    updatedAt: data[data.length - 1]?.date ?? dayjs().format("YYYY-MM-DD"),
  };
};
