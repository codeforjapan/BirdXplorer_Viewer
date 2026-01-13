import dayjs from "dayjs";

import type { PeriodOption, PeriodRangeValue } from "~/components/graph/types";

const createMockPeriodOptions = (
  periodCount = 3
): Array<PeriodOption<PeriodRangeValue>> => {
  const options: Array<PeriodOption<PeriodRangeValue>> = [];
  let end = dayjs().startOf("month");

  for (let i = 0; i < periodCount; i++) {
    const start = end.subtract(1, "year");
    const value = `${start.format("YYYY-MM")}_${end.format(
      "YYYY-MM"
    )}` as PeriodRangeValue;
    options.push({
      value,
      label: `${start.format("YYYY/MM")} 〜 ${end.format("YYYY/MM")}`,
    });
    end = start;
  }

  return options;
};

/** 日別投稿数グラフのモック期間オプション（後でAPI連携に差し替え） */
export const MOCK_DAILY_POST_COUNT_PERIOD_OPTIONS = createMockPeriodOptions();
