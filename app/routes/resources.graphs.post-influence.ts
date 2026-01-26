import {
  DEFAULT_GRAPH_LIMIT,
  fetchPostInfluenceGraph,
  resolveLimit,
  resolveRelativePeriod,
  resolveStatus,
  safeGraphFetch,
} from "~/components/graph/graphFetchers";
import { DEFAULT_EVALUATION_PERIOD } from "~/components/graph/periodOptions";

import type { Route } from "./+types/resources.graphs.post-influence";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const params = new URL(request.url).searchParams;
  const period = resolveRelativePeriod(
    params.get("period"),
    DEFAULT_EVALUATION_PERIOD
  );
  const status = resolveStatus(params.get("status"));
  const limit = resolveLimit(params.get("limit"), DEFAULT_GRAPH_LIMIT);

  return safeGraphFetch(async () =>
    fetchPostInfluenceGraph({ period, status, limit })
  );
};
