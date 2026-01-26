import {
  fetchDailyNotesGraph,
  resolveRelativePeriod,
  resolveStatus,
  safeGraphFetchWithMarkers,
} from "~/components/graph/graphFetchers";

import type { Route } from "./+types/resources.graphs.daily-notes";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const params = new URL(request.url).searchParams;
  const period = resolveRelativePeriod(params.get("period"));
  const status = resolveStatus(params.get("status"));

  return safeGraphFetchWithMarkers(async () =>
    fetchDailyNotesGraph({ period, status })
  );
};
