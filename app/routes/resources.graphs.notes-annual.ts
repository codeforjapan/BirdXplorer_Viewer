import {
  fetchNotesAnnualGraph,
  resolveRangePeriod,
  resolveStatus,
  safeGraphFetch,
} from "~/components/graph/graphFetchers";
import { getNotesAnnualPeriodOptions } from "~/components/graph/periodOptions";
import { buildGraphCacheKey, graphCache } from "~/utils/graphCache";

import type { Route } from "./+types/resources.graphs.notes-annual";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const params = new URL(request.url).searchParams;
  const range = resolveRangePeriod(
    params.get("range"),
    getNotesAnnualPeriodOptions()
  );
  const status = resolveStatus(params.get("status"));
  const cacheKey = buildGraphCacheKey("notes-annual", { range, status });
  const cached = graphCache.get(cacheKey);
  if (cached) return cached;

  const result = await safeGraphFetch(async () =>
    fetchNotesAnnualGraph({ range, status })
  );
  if (result.ok) graphCache.set(cacheKey, result);
  return result;
};
