import {
  DEFAULT_GRAPH_LIMIT,
  fetchPostInfluenceGraph,
  resolveDateTimestamp,
  resolveLimit,
  resolveStatus,
  safeGraphFetch,
} from "~/components/graph/graphFetchers";
import { relativePeriodToTimestamps } from "~/utils/dateRange";
import { buildGraphCacheKey, graphCache } from "~/utils/graphCache";

import type { Route } from "./+types/resources.graphs.post-influence";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const params = new URL(request.url).searchParams;

  // start_date/end_dateパラメータを取得
  const startDateParam = resolveDateTimestamp(params.get("start_date"));
  const endDateParam = resolveDateTimestamp(params.get("end_date"));

  // パラメータがない場合はデフォルト期間（直近6ヶ月）を使用
  const { start_date, end_date } =
    startDateParam && endDateParam
      ? { start_date: startDateParam, end_date: endDateParam }
      : relativePeriodToTimestamps("6months");

  const status = resolveStatus(params.get("status"));
  const limit = resolveLimit(params.get("limit"), DEFAULT_GRAPH_LIMIT);
  const cacheKey = buildGraphCacheKey("post-influence", {
    start_date,
    end_date,
    status,
    limit,
  });
  const cached = graphCache.get(cacheKey);
  if (cached) return cached;

  const result = await safeGraphFetch(async () =>
    fetchPostInfluenceGraph({ start_date, end_date, status, limit }),
  );
  if (result.ok) graphCache.set(cacheKey, result);
  return result;
};
