import {
  DEFAULT_GRAPH_LIMIT,
  fetchNotesEvaluationGraph,
  resolveLimit,
  resolveRelativePeriod,
  resolveStatus,
  safeGraphFetch,
} from "~/components/graph/graphFetchers";

import type { Route } from "./+types/resources.graphs.notes-evaluation";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const params = new URL(request.url).searchParams;
  const period = resolveRelativePeriod(params.get("period"));
  const status = resolveStatus(params.get("status"));
  const limit = resolveLimit(params.get("limit"), DEFAULT_GRAPH_LIMIT);

  return safeGraphFetch(async () =>
    fetchNotesEvaluationGraph({ period, status, limit })
  );
};
