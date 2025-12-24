import dayjs from "dayjs";

import type {
  DailyPostCountDataItem,
  EventMarker,
  PeriodRangeValue,
} from "~/components/graph";
import type { PeriodOption } from "~/components/graph/types";

import { MOCK_DAILY_POST_COUNT_PERIOD_OPTIONS } from "./periodOptions";

// 共通型を再エクスポート
export type { DailyPostCountDataItem, EventMarker } from "~/components/graph";

export type DailyPostCountApiResponse = {
  data: DailyPostCountDataItem[];
  eventMarkers?: EventMarker[];
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
    MOCK_DAILY_POST_COUNT_PERIOD_OPTIONS[0]!.value
  );
};

/**
 * @param period 期間文字列（例: "2024-12_2025-12"）
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
  const end = dayjs(endStr, "YYYY-MM").endOf("month");
  return { start, end };
};

/**
 * デモ用: 期間の40%/60%地点にマーカーを配置
 * @param period 期間文字列（例: "2024-12_2025-12"）
 */
export const generateDemoEventMarkers = (
  period: PeriodRangeValue
): EventMarker[] => {
  const { start, end } = parsePeriod(period);
  const totalDays = end.diff(start, "day");
  const marker1 = start.add(Math.floor(totalDays * 0.4), "day");
  const marker2 = start.add(Math.floor(totalDays * 0.6), "day");
  return [
    { date: marker1.format("YYYY-MM-DD"), label: `${marker1.format("M/D")} 公示` },
    { date: marker2.format("YYYY-MM-DD"), label: `${marker2.format("M/D")} 投開票` },
  ];
};

/** @param period 期間文字列（例: "2024-12_2025-12"） */
export const generateMockData = (
  period: PeriodRangeValue
): DailyPostCountDataItem[] => {
  const { start, end } = parsePeriod(period);

  const days: DailyPostCountDataItem[] = [];
  const totalDays = end.diff(start, "day") + 1;

  for (let d = 0; d < totalDays; d++) {
    const date = start.add(d, "day");
    const iso = date.format("YYYY-MM-DD");

    // モックデータ: 月ごとに変動させる
    const baseFactor = 1 + date.month() * 0.1;

    const published = Math.max(
      0,
      Math.floor(baseFactor * 5 + Math.random() * 10 - 3)
    );
    const evaluating = Math.max(
      0,
      Math.floor(baseFactor * 3 + Math.random() * 8 - 2)
    );
    const unpublished = Math.max(
      0,
      Math.floor(baseFactor * 2 + Math.random() * 5 - 1)
    );
    const temporarilyPublished = Math.max(
      0,
      Math.floor(baseFactor * 1.5 + Math.random() * 4 - 1)
    );

    days.push({ date: iso, published, evaluating, unpublished, temporarilyPublished });
  }

  return days;
};

export const createMockResponse = (
  period?: PeriodRangeValue
): DailyPostCountApiResponse => {
  const defaultPeriod = MOCK_DAILY_POST_COUNT_PERIOD_OPTIONS[0]!.value;
  const resolvedPeriod = resolvePeriod(
    period,
    MOCK_DAILY_POST_COUNT_PERIOD_OPTIONS,
    defaultPeriod
  );
  const data = generateMockData(resolvedPeriod);

  return {
    data,
    eventMarkers: generateDemoEventMarkers(resolvedPeriod),
    updatedAt: data[data.length - 1]?.date ?? dayjs().format("YYYY-MM-DD"),
  };
};
