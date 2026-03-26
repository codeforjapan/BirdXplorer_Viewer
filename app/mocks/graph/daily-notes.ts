import dayjs from "dayjs";

import type {
  DailyNotesCreationDataItem,
  EventMarker,
  RelativePeriodValue,
} from "~/components/graph";
import {
  getDefaultPeriodValue,
  getEventMarkersForRelativePeriod,
} from "~/components/graph";
import { getRelativePeriodOptions } from "~/components/graph/periodOptions";
import type { PeriodOption } from "~/components/graph/types";

export type DailyNotesCreationApiResponse = {
  data: DailyNotesCreationDataItem[];
  eventMarkers?: EventMarker[];
  updatedAt: string;
};

/**
 * デフォルトのイベントマーカーを生成（デモ用）
 * 期間内に2つのマーカーを配置
 */
const parsePeriod = (
  period?: RelativePeriodValue,
): { start: dayjs.Dayjs; end: dayjs.Dayjs } => {
  if (period?.includes("_")) {
    const [startStr, endStr] = period.split("_");
    const start = dayjs(startStr, "YYYY-MM").startOf("month");
    const end = dayjs(endStr, "YYYY-MM").endOf("month");
    return { start, end };
  }

  const end = dayjs().startOf("day");
  switch (period) {
    case "1week":
      return { start: end.subtract(1, "week"), end };
    case "3months":
      return { start: end.subtract(3, "month"), end };
    case "6months":
      return { start: end.subtract(6, "month"), end };
    case "1year":
      return { start: end.subtract(1, "year"), end };
    case "1month":
    default:
      return { start: end.subtract(1, "month"), end };
  }
};

const resolvePeriod = (
  period: RelativePeriodValue | undefined,
  periodOptions: Array<PeriodOption<RelativePeriodValue>>,
): RelativePeriodValue => {
  if (period && periodOptions.some((option) => option.value === period)) {
    return period;
  }
  return getDefaultPeriodValue(periodOptions);
};

export const generateMockData = (
  period?: RelativePeriodValue,
): DailyNotesCreationDataItem[] => {
  const { start, end } = parsePeriod(period);

  const days: DailyNotesCreationDataItem[] = [];
  const totalDays = end.diff(start, "day") + 1;

  for (let d = 0; d < totalDays; d++) {
    const date = start.add(d, "day");
    const iso = date.format("YYYY-MM-DD");

    // モックデータ: 日ごとにランダムな変動
    const baseFactor = 1 + Math.random() * 0.5;

    const published = Math.max(
      0,
      Math.floor(baseFactor * 3 + Math.random() * 8 - 2),
    );
    const evaluating = Math.max(
      0,
      Math.floor(baseFactor * 8 + Math.random() * 15 - 3),
    );
    const unpublished = Math.max(
      0,
      Math.floor(baseFactor * 2 + Math.random() * 5 - 1),
    );
    const temporarilyPublished = Math.max(
      0,
      Math.floor(baseFactor * 1.5 + Math.random() * 4 - 1),
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

export const createMockResponse = (
  period?: RelativePeriodValue,
): DailyNotesCreationApiResponse => {
  const resolvedPeriod = resolvePeriod(period, getRelativePeriodOptions());
  const data = generateMockData(resolvedPeriod);

  return {
    data,
    eventMarkers: getEventMarkersForRelativePeriod(resolvedPeriod),
    updatedAt: data[data.length - 1]?.date ?? dayjs().format("YYYY-MM-DD"),
  };
};
