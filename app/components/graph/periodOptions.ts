import dayjs from "dayjs";

import { isGraphMockEnabled } from "~/config/graphDataSource";

import {
  API_DAILY_POST_COUNT_PERIOD_OPTIONS,
  API_NOTES_ANNUAL_PERIOD_OPTIONS,
  DEFAULT_EVALUATION_PERIOD,
  RELATIVE_PERIOD_OPTIONS,
} from "./constants";
import type { PeriodOption, PeriodRangeValue } from "./types";

const createRangePeriodOptions = (
  periodCount = 3,
  options: { includeStartMonth?: boolean } = {}
): Array<PeriodOption<PeriodRangeValue>> => {
  const { includeStartMonth = true } = options;
  const result: Array<PeriodOption<PeriodRangeValue>> = [];
  let end = dayjs().startOf("month");

  for (let i = 0; i < periodCount; i += 1) {
    const start = includeStartMonth
      ? end.subtract(11, "month")
      : end.subtract(1, "year").add(1, "month");
    const value = `${start.format("YYYY-MM")}_${end.format(
      "YYYY-MM"
    )}` as PeriodRangeValue;
    result.push({
      value,
      label: `${start.format("YYYY/MM")} 〜 ${end.format("YYYY/MM")}`,
    });
    end = start.subtract(1, "month");
  }

  return result;
};

export const NOTES_ANNUAL_PERIOD_OPTIONS = API_NOTES_ANNUAL_PERIOD_OPTIONS;
export { DEFAULT_EVALUATION_PERIOD };

export const MOCK_DAILY_POST_COUNT_PERIOD_OPTIONS =
  createRangePeriodOptions();
export const MOCK_NOTES_ANNUAL_PERIOD_OPTIONS =
  createRangePeriodOptions(3, { includeStartMonth: false });

export const getRelativePeriodOptions = () => RELATIVE_PERIOD_OPTIONS;

export const getDailyPostCountPeriodOptions = () =>
  isGraphMockEnabled()
    ? MOCK_DAILY_POST_COUNT_PERIOD_OPTIONS
    : API_DAILY_POST_COUNT_PERIOD_OPTIONS;

export const getNotesAnnualPeriodOptions = () =>
  isGraphMockEnabled()
    ? MOCK_NOTES_ANNUAL_PERIOD_OPTIONS
    : API_NOTES_ANNUAL_PERIOD_OPTIONS;
