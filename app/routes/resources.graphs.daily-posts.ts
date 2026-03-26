import {
  fetchDailyPostsGraph,
  resolveDateTimestamp,
  resolveStatus,
  safeGraphFetchWithMarkers,
} from "~/components/graph/graphFetchers";
import { periodRangeToTimestamps } from "~/utils/dateRange";
import { buildGraphCacheKey, graphCache } from "~/utils/graphCache";

import type { Route } from "./+types/resources.graphs.daily-posts";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const params = new URL(request.url).searchParams;

  // start_date/end_dateパラメータを取得
  const startDateParam = resolveDateTimestamp(params.get("start_date"));
  const endDateParam = resolveDateTimestamp(params.get("end_date"));

  // パラメータがない場合はデフォルト期間（2025-02_2026-01）を使用
  const { start_date, end_date } =
    startDateParam && endDateParam
      ? { start_date: startDateParam, end_date: endDateParam }
      : periodRangeToTimestamps("2025-02_2026-01");

  const status = resolveStatus(params.get("status"));
  const cacheKey = buildGraphCacheKey("daily-posts", {
    start_date,
    end_date,
    status,
  });
  const cached = graphCache.get(cacheKey);
  if (cached) return cached;

  const result = await safeGraphFetchWithMarkers(async () =>
    fetchDailyPostsGraph({ start_date, end_date, status }),
  );
  if (result.ok) graphCache.set(cacheKey, result);
  return result;
};
