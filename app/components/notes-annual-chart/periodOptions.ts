import dayjs from "dayjs";

import type { PeriodOption, PeriodRangeValue } from "~/components/graph/types";

const createPeriodOptions = (
  periodCount = 3
): Array<PeriodOption<PeriodRangeValue>> => {
  const options: Array<PeriodOption<PeriodRangeValue>> = [];
  let end = dayjs().startOf("month");

  for (let i = 0; i < periodCount; i++) {
    const start = end.subtract(1, "year").add(1, "month");
    const value = `${start.format("YYYY-MM")}_${end.format(
      "YYYY-MM"
    )}` as PeriodRangeValue;
    options.push({
      value,
      label: `${start.format("YYYY/MM")} 〜 ${end.format("YYYY/MM")}`,
    });
    end = start.subtract(1, "month");
  }

  return options;
};

/** 年間グラフの期間オプション（フロントエンドで管理） */
export const NOTES_ANNUAL_PERIOD_OPTIONS = createPeriodOptions();
