import {
  DEFAULT_GRAPH_LIMIT,
  fetchPostInfluenceGraph,
  resolveLimit,
  resolveRelativePeriod,
  resolveStatus,
  safeGraphFetch,
} from "~/components/graph/graphFetchers";
import { DEFAULT_EVALUATION_PERIOD } from "~/components/graph/periodOptions";
import { buildGraphCacheKey, graphCache } from "~/utils/graphCache";

import type { Route } from "./+types/resources.graphs.post-influence";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const params = new URL(request.url).searchParams;
  const period = resolveRelativePeriod(
    params.get("period"),
    DEFAULT_EVALUATION_PERIOD
  );
  const status = resolveStatus(params.get("status"));
  const limit = resolveLimit(params.get("limit"), DEFAULT_GRAPH_LIMIT);
  const cacheKey = buildGraphCacheKey("post-influence", {
    period,
    status,
    limit,
  });
  const cached = graphCache.get(cacheKey);
  if (cached) return cached;

  const result = await safeGraphFetch(async () =>
    fetchPostInfluenceGraph({ period, status, limit })
  );
  if (result.ok) graphCache.set(cacheKey, result);
  return result;
};
