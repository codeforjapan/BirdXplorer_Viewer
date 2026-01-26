import {
  fetchDailyPostsGraph,
  resolveRangePeriod,
  resolveStatus,
  safeGraphFetchWithMarkers,
} from "~/components/graph/graphFetchers";
import { getDailyPostCountPeriodOptions } from "~/components/graph/periodOptions";

import type { Route } from "./+types/resources.graphs.daily-posts";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const params = new URL(request.url).searchParams;
  const range = resolveRangePeriod(
    params.get("range"),
    getDailyPostCountPeriodOptions()
  );
  const status = resolveStatus(params.get("status"));

  return safeGraphFetchWithMarkers(async () =>
    fetchDailyPostsGraph({ range, status })
  );
};
