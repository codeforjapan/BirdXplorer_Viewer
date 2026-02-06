import {
  fetchDailyPostsGraph,
  resolveRangePeriod,
  resolveStatus,
  safeGraphFetchWithMarkers,
} from "~/components/graph/graphFetchers";
import { getDailyPostCountPeriodOptions } from "~/components/graph/periodOptions";
import { buildGraphCacheKey, graphCache } from "~/utils/graphCache";

import type { Route } from "./+types/resources.graphs.daily-posts";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const params = new URL(request.url).searchParams;
  const range = resolveRangePeriod(
    params.get("range"),
    getDailyPostCountPeriodOptions()
  );
  const status = resolveStatus(params.get("status"));
  const cacheKey = buildGraphCacheKey("daily-posts", { range, status });
  const cached = graphCache.get(cacheKey);
  if (cached) return cached;

  const result = await safeGraphFetchWithMarkers(async () =>
    fetchDailyPostsGraph({ range, status })
  );
  if (result.ok) graphCache.set(cacheKey, result);
  return result;
};
