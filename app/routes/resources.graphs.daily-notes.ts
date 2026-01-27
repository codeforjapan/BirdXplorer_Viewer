import type {
  DailyNotesCreationDataItem,
  GraphFetchResultWithMarkers,
} from "~/components/graph";
import {
  fetchDailyNotesGraph,
  resolveRelativePeriod,
  resolveStatus,
  safeGraphFetchWithMarkers,
} from "~/components/graph/graphFetchers";
import { buildGraphCacheKey, graphCache } from "~/utils/graphCache";

import type { Route } from "./+types/resources.graphs.daily-notes";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const params = new URL(request.url).searchParams;
  const period = resolveRelativePeriod(params.get("period"));
  const status = resolveStatus(params.get("status"));
  const cacheKey = buildGraphCacheKey("daily-notes", { period, status });
  const cached = graphCache.get(cacheKey) as
    | GraphFetchResultWithMarkers<DailyNotesCreationDataItem[]>
    | undefined;
  if (cached) return cached;

  const result = await safeGraphFetchWithMarkers(async () =>
    fetchDailyNotesGraph({ period, status })
  );
  if (result.ok) graphCache.set(cacheKey, result);
  return result;
};
