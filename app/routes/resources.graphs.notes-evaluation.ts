import {
  DEFAULT_GRAPH_LIMIT,
  fetchNotesEvaluationGraph,
  resolveLimit,
  resolveRelativePeriod,
  resolveStatus,
  safeGraphFetch,
} from "~/components/graph/graphFetchers";
import { buildGraphCacheKey, graphCache } from "~/utils/graphCache";

import type { Route } from "./+types/resources.graphs.notes-evaluation";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const params = new URL(request.url).searchParams;
  const period = resolveRelativePeriod(params.get("period"));
  const status = resolveStatus(params.get("status"));
  const limit = resolveLimit(params.get("limit"), DEFAULT_GRAPH_LIMIT);
  const cacheKey = buildGraphCacheKey("notes-evaluation", {
    period,
    status,
    limit,
  });
  const cached = graphCache.get(cacheKey);
  if (cached) return cached;

  const result = await safeGraphFetch(async () =>
    fetchNotesEvaluationGraph({ period, status, limit })
  );
  if (result.ok) graphCache.set(cacheKey, result);
  return result;
};
