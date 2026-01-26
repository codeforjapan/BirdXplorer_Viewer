import { createMockResponse as createDailyNotesMockResponse } from "~/components/daily-notes-creation-chart/data";
import { createMockResponse as createDailyPostsMockResponse } from "~/components/daily-post-count-chart/data";
import {
  getDailyPostCountPeriodOptions,
  getNotesAnnualPeriodOptions,
} from "~/components/graph/periodOptions";
import { createMockResponse as createNotesAnnualMockResponse } from "~/components/notes-annual-chart/data";
import { createMockResponse as createNotesEvaluationMockResponse } from "~/components/notes-evaluation-chart/data";
import { createMockResponse as createNotesEvaluationStatusMockResponse } from "~/components/notes-evaluation-status-chart/data";
import { createMockResponse as createPostInfluenceMockResponse } from "~/components/post-influence-chart/data";
import { GRAPH_DATA_SOURCE } from "~/config/graphDataSource";
import {
  getDailyNotesApiV1GraphsDailyNotesGet,
  getDailyPostsApiV1GraphsDailyPostsGet,
  getNotesAnnualApiV1GraphsNotesAnnualGet,
  getNotesEvaluationApiV1GraphsNotesEvaluationGet,
  getNotesEvaluationStatusApiV1GraphsNotesEvaluationStatusGet,
  getPostInfluenceApiV1GraphsPostInfluenceGet,
} from "~/generated/api/client";
import {
  getDailyNotesApiV1GraphsDailyNotesGetResponse,
  getDailyPostsApiV1GraphsDailyPostsGetResponse,
  getNotesAnnualApiV1GraphsNotesAnnualGetResponse,
  getNotesEvaluationApiV1GraphsNotesEvaluationGetResponse,
  getNotesEvaluationStatusApiV1GraphsNotesEvaluationStatusGetResponse,
  getPostInfluenceApiV1GraphsPostInfluenceGetResponse,
} from "~/generated/api/zod/schema";

import {
  toDailyNotesCreationData,
  toDailyPostCountData,
  toMonthlyNoteData,
  toNoteEvaluationData,
  toPostInfluenceData,
} from "./adapters";
import {
  fetchGraphList,
  type GraphFetchResult,
  type GraphFetchResultWithMarkers,
} from "./api";
import type { RelativePeriodValue, StatusValue } from "./constants";
import { DEFAULT_GRAPH_ERROR_MESSAGES, RELATIVE_PERIOD_OPTIONS } from "./constants";
import {
  getEventMarkersForRangePeriod,
  getEventMarkersForRelativePeriod,
} from "./eventMarkers";
import { getDefaultPeriodValue } from "./periodUtils";
import type { PeriodOption, PeriodRangeValue } from "./types";
import type {
  DailyNotesCreationDataItem,
  DailyPostCountDataItem,
  MonthlyNoteData,
  NoteEvaluationData,
  PostInfluenceData,
} from "./types";

export const DEFAULT_GRAPH_LIMIT = 200;

const RELATIVE_PERIOD_VALUES: RelativePeriodValue[] = [
  "1week",
  "1month",
  "3months",
  "6months",
  "1year",
];

const STATUS_VALUES: StatusValue[] = [
  "all",
  "published",
  "evaluating",
  "unpublished",
  "temporarilyPublished",
];

export const resolveRelativePeriod = (
  value?: string | null,
  fallback?: RelativePeriodValue
): RelativePeriodValue => {
  if (value && RELATIVE_PERIOD_VALUES.includes(value as RelativePeriodValue)) {
    return value as RelativePeriodValue;
  }
  if (fallback) return fallback;
  return getDefaultPeriodValue(RELATIVE_PERIOD_OPTIONS);
};

export const resolveRangePeriod = (
  value: string | null | undefined,
  options: Array<PeriodOption<PeriodRangeValue>>
): PeriodRangeValue => {
  if (value && options.some((option) => option.value === value)) {
    return value as PeriodRangeValue;
  }
  return getDefaultPeriodValue(options);
};

export const resolveStatus = (value?: string | null): StatusValue => {
  if (value && STATUS_VALUES.includes(value as StatusValue)) {
    return value as StatusValue;
  }
  return "all";
};

export const resolveLimit = (
  value?: string | null,
  fallback: number = DEFAULT_GRAPH_LIMIT
): number => {
  const parsed = value ? Number.parseInt(value, 10) : Number.NaN;
  if (Number.isFinite(parsed) && parsed > 0) return parsed;
  return fallback;
};

const toNetworkError = <T,>(): GraphFetchResult<T> => ({
  ok: false,
  error: {
    kind: "network",
    message: DEFAULT_GRAPH_ERROR_MESSAGES.network,
  },
});

export const fetchDailyNotesGraph = async ({
  period,
  status,
}: {
  period: RelativePeriodValue;
  status: StatusValue;
}): Promise<GraphFetchResultWithMarkers<DailyNotesCreationDataItem[]>> => {
  if (GRAPH_DATA_SOURCE === "mock") {
    const mock = createDailyNotesMockResponse(period);
    const markers =
      mock.eventMarkers ?? getEventMarkersForRelativePeriod(period);
    return {
      ok: true,
      data: mock.data,
      updatedAt: mock.updatedAt,
      eventMarkers: markers,
    };
  }

  const result = await fetchGraphList(
    async () => getDailyNotesApiV1GraphsDailyNotesGet({ period, status }),
    getDailyNotesApiV1GraphsDailyNotesGetResponse,
  );

  if (!result.ok) return result;

  return {
    ok: true,
    data: toDailyNotesCreationData(result.data),
    updatedAt: result.updatedAt,
    eventMarkers: getEventMarkersForRelativePeriod(period),
  };
};

export const fetchDailyPostsGraph = async ({
  range,
  status,
}: {
  range: PeriodRangeValue;
  status: StatusValue;
}): Promise<GraphFetchResultWithMarkers<DailyPostCountDataItem[]>> => {
  if (GRAPH_DATA_SOURCE === "mock") {
    const mock = createDailyPostsMockResponse(range);
    const markers =
      mock.eventMarkers ?? getEventMarkersForRangePeriod(range);
    return {
      ok: true,
      data: mock.data,
      updatedAt: mock.updatedAt,
      eventMarkers: markers,
    };
  }

  const result = await fetchGraphList(
    async () => getDailyPostsApiV1GraphsDailyPostsGet({ range, status }),
    getDailyPostsApiV1GraphsDailyPostsGetResponse,
  );

  if (!result.ok) return result;

  return {
    ok: true,
    data: toDailyPostCountData(result.data),
    updatedAt: result.updatedAt,
    eventMarkers: getEventMarkersForRangePeriod(range),
  };
};

export const fetchNotesAnnualGraph = async ({
  range,
  status,
}: {
  range: PeriodRangeValue;
  status: StatusValue;
}): Promise<GraphFetchResult<MonthlyNoteData[]>> => {
  if (GRAPH_DATA_SOURCE === "mock") {
    const mock = createNotesAnnualMockResponse(range);
    return {
      ok: true,
      data: mock.data,
      updatedAt: mock.updatedAt,
    };
  }

  const result = await fetchGraphList(
    async () => getNotesAnnualApiV1GraphsNotesAnnualGet({ range, status }),
    getNotesAnnualApiV1GraphsNotesAnnualGetResponse,
  );

  if (!result.ok) return result;

  return {
    ok: true,
    data: toMonthlyNoteData(result.data),
    updatedAt: result.updatedAt,
  };
};

export const fetchNotesEvaluationGraph = async ({
  period,
  status,
  limit,
}: {
  period: RelativePeriodValue;
  status: StatusValue;
  limit: number;
}): Promise<GraphFetchResult<NoteEvaluationData[]>> => {
  if (GRAPH_DATA_SOURCE === "mock") {
    const mock = createNotesEvaluationMockResponse(period);
    return {
      ok: true,
      data: mock.data,
      updatedAt: mock.updatedAt,
    };
  }

  const result = await fetchGraphList(
    async () => getNotesEvaluationApiV1GraphsNotesEvaluationGet({ period, status, limit }),
    getNotesEvaluationApiV1GraphsNotesEvaluationGetResponse,
  );

  if (!result.ok) return result;

  return {
    ok: true,
    data: toNoteEvaluationData(result.data),
    updatedAt: result.updatedAt,
  };
};

export const fetchNotesEvaluationStatusGraph = async ({
  period,
  status,
  limit,
}: {
  period: RelativePeriodValue;
  status: StatusValue;
  limit: number;
}): Promise<GraphFetchResult<NoteEvaluationData[]>> => {
  if (GRAPH_DATA_SOURCE === "mock") {
    const mock = createNotesEvaluationStatusMockResponse();
    return {
      ok: true,
      data: mock.data,
      updatedAt: mock.updatedAt,
    };
  }

  const result = await fetchGraphList(
    async () =>
      getNotesEvaluationStatusApiV1GraphsNotesEvaluationStatusGet({
        period,
        status,
        limit,
      }),
    getNotesEvaluationStatusApiV1GraphsNotesEvaluationStatusGetResponse,
  );

  if (!result.ok) return result;

  return {
    ok: true,
    data: toNoteEvaluationData(result.data),
    updatedAt: result.updatedAt,
  };
};

export const fetchPostInfluenceGraph = async ({
  period,
  status,
  limit,
}: {
  period: RelativePeriodValue;
  status: StatusValue;
  limit: number;
}): Promise<GraphFetchResult<PostInfluenceData[]>> => {
  if (GRAPH_DATA_SOURCE === "mock") {
    const mock = createPostInfluenceMockResponse();
    return {
      ok: true,
      data: mock.data,
      updatedAt: mock.updatedAt,
    };
  }

  const result = await fetchGraphList(
    async () =>
      getPostInfluenceApiV1GraphsPostInfluenceGet({ period, status, limit }),
    getPostInfluenceApiV1GraphsPostInfluenceGetResponse,
  );

  if (!result.ok) return result;

  return {
    ok: true,
    data: toPostInfluenceData(result.data),
    updatedAt: result.updatedAt,
  };
};

export const getDefaultDailyPostsRange = (): PeriodRangeValue =>
  getDefaultPeriodValue(getDailyPostCountPeriodOptions());

export const getDefaultNotesAnnualRange = (): PeriodRangeValue =>
  getDefaultPeriodValue(getNotesAnnualPeriodOptions());

export const getDefaultRelativePeriod = (): RelativePeriodValue =>
  getDefaultPeriodValue(RELATIVE_PERIOD_OPTIONS);

export const safeGraphFetch = async <T,>(
  action: () => Promise<GraphFetchResult<T>>
): Promise<GraphFetchResult<T>> => {
  try {
    return await action();
  } catch {
    return toNetworkError<T>();
  }
};

export const safeGraphFetchWithMarkers = async <T,>(
  action: () => Promise<GraphFetchResultWithMarkers<T>>
): Promise<GraphFetchResultWithMarkers<T>> => {
  try {
    return await action();
  } catch {
    return {
      ok: false,
      error: {
        kind: "network",
        message: DEFAULT_GRAPH_ERROR_MESSAGES.network,
      },
    };
  }
};
