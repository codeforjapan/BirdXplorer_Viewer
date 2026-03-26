import dayjs from "dayjs";

import type { MonthlyNoteData, PeriodRangeValue } from "~/components/graph";
import { getDefaultPeriodValue } from "~/components/graph";
import { getNotesAnnualPeriodOptions } from "~/components/graph/periodOptions";
import type { PeriodOption } from "~/components/graph/types";

export type NotesAnnualApiResponse = {
  data: MonthlyNoteData[];
  updatedAt: string;
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

export const generateMockData = (period?: PeriodRangeValue): MonthlyNoteData[] => {
  const resolvedPeriod = resolvePeriod(period, getNotesAnnualPeriodOptions());
  const [startStr, endStr] = resolvedPeriod.split("_");
  const start = dayjs(startStr, "YYYY-MM");
  const end = dayjs(endStr, "YYYY-MM");

  const result: MonthlyNoteData[] = [];
  const totalMonths = end.diff(start, "month") + 1;

  for (let i = 0; i < totalMonths; i += 1) {
    const month = start.add(i, "month");

    const published = Math.floor(Math.random() * 800) + 200;
    const evaluating = Math.floor(Math.random() * 1200) + 300;
    const unpublished = Math.floor(Math.random() * 300) + 100;
    const temporarilyPublished = Math.floor(Math.random() * 200) + 50;
    const total = published + evaluating + unpublished + temporarilyPublished;

    result.push({
      month: month.format("YYYY-MM"),
      published,
      evaluating,
      unpublished,
      temporarilyPublished,
      publicationRate: total > 0 ? published / total : 0,
    });
  }

  return result;
};

export const createMockResponse = (period?: PeriodRangeValue): NotesAnnualApiResponse => {
  const resolvedPeriod = resolvePeriod(period, getNotesAnnualPeriodOptions());
  const data = generateMockData(resolvedPeriod);

  return {
    data,
    updatedAt: data[data.length - 1]?.month ?? dayjs().format("YYYY-MM"),
  };
};
