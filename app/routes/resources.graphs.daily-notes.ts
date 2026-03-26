import type {
  DailyNotesCreationDataItem,
  GraphFetchResultWithMarkers,
} from "~/components/graph";
import {
  fetchDailyNotesGraph,
  resolveDateTimestamp,
  resolveStatus,
  safeGraphFetchWithMarkers,
} from "~/components/graph/graphFetchers";
import { relativePeriodToTimestamps } from "~/utils/dateRange";
import { buildGraphCacheKey, graphCache } from "~/utils/graphCache";

import type { Route } from "./+types/resources.graphs.daily-notes";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const params = new URL(request.url).searchParams;

  // start_date/end_dateパラメータを取得
  const startDateParam = resolveDateTimestamp(params.get("start_date"));
  const endDateParam = resolveDateTimestamp(params.get("end_date"));

  // パラメータがない場合はデフォルト期間（直近6ヶ月）を使用
  const { start_date, end_date } = startDateParam && endDateParam
    ? { start_date: startDateParam, end_date: endDateParam }
    : relativePeriodToTimestamps("6months");

  const status = resolveStatus(params.get("status"));
  const cacheKey = buildGraphCacheKey("daily-notes", {
    start_date,
    end_date,
    status,
  });
  const cached = graphCache.get(cacheKey) as
    | GraphFetchResultWithMarkers<DailyNotesCreationDataItem[]>
    | undefined;
  if (cached) return cached;

  const result = await safeGraphFetchWithMarkers(async () =>
    fetchDailyNotesGraph({ start_date, end_date, status })
  );
  if (result.ok) graphCache.set(cacheKey, result);
  return result;
};
