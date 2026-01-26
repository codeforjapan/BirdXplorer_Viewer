import {
  fetchNotesAnnualGraph,
  resolveRangePeriod,
  resolveStatus,
  safeGraphFetch,
} from "~/components/graph/graphFetchers";
import { getNotesAnnualPeriodOptions } from "~/components/graph/periodOptions";

import type { Route } from "./+types/resources.graphs.notes-annual";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const params = new URL(request.url).searchParams;
  const range = resolveRangePeriod(
    params.get("range"),
    getNotesAnnualPeriodOptions()
  );
  const status = resolveStatus(params.get("status"));

  return safeGraphFetch(async () => fetchNotesAnnualGraph({ range, status }));
};
