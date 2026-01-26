import dayjs from "dayjs";

import { GRAPH_DATA_SOURCE } from "~/config/graphDataSource";

import {
  API_EVENT_MARKERS_RANGE,
  API_EVENT_MARKERS_RELATIVE,
  EVENT_MARKER_LABELS,
  type RelativePeriodValue,
} from "./constants";
import type { EventMarker, PeriodRangeValue } from "./types";

const RELATIVE_PERIOD_EVENT_MARKER_RATIOS = [0.35, 0.7] as const;
const RANGE_PERIOD_EVENT_MARKER_RATIOS = [0.4, 0.6] as const;

const toEventMarkers = (
  start: dayjs.Dayjs,
  end: dayjs.Dayjs,
  ratios: readonly number[]
): EventMarker[] => {
  const totalDays = Math.max(1, end.diff(start, "day"));

  return ratios.map((ratio, index) => {
    const date = start.add(Math.floor(totalDays * ratio), "day");
    const label = EVENT_MARKER_LABELS[index] ?? EVENT_MARKER_LABELS[0];
    return {
      date: date.format("YYYY-MM-DD"),
      label: `${date.format("M/D")} ${label}`.trim(),
    };
  });
};

const parseRelativePeriod = (period?: RelativePeriodValue) => {
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

const parseRangePeriod = (period: PeriodRangeValue) => {
  const [startStr, endStr] = period.split("_");
  if (!startStr || !endStr) {
    throw new Error(`Invalid period format: ${period}`);
  }
  const start = dayjs(startStr, "YYYY-MM").startOf("month");
  const end = dayjs(endStr, "YYYY-MM").endOf("month");
  return { start, end };
};

export const getEventMarkersForRelativePeriod = (
  period?: RelativePeriodValue
): EventMarker[] => {
  if (GRAPH_DATA_SOURCE === "api") {
    return API_EVENT_MARKERS_RELATIVE;
  }
  const { start, end } = parseRelativePeriod(period);
  return toEventMarkers(start, end, RELATIVE_PERIOD_EVENT_MARKER_RATIOS);
};

export const getEventMarkersForRangePeriod = (
  period: PeriodRangeValue
): EventMarker[] => {
  if (GRAPH_DATA_SOURCE === "api") {
    return API_EVENT_MARKERS_RANGE;
  }
  const { start, end } = parseRangePeriod(period);
  return toEventMarkers(start, end, RANGE_PERIOD_EVENT_MARKER_RATIOS);
};
