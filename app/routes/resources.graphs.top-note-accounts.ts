import type { GraphFetchResult } from "~/components/graph";
import {
  fetchTopNoteAccountsGraph,
  resolveDateTimestamp,
  safeGraphFetch,
} from "~/components/graph/graphFetchers";
import type { TopNoteAccountDataItem } from "~/generated/api/schemas/topNoteAccountDataItem";
import type { AccountRankingPeriod } from "~/utils/dateRange";
import { rankingPeriodToTimestamps } from "~/utils/dateRange";
import { buildGraphCacheKey, graphCache } from "~/utils/graphCache";

const VALID_PERIODS: AccountRankingPeriod[] = ["1week", "2weeks", "1month"];

const resolvePeriod = (value: string | null): AccountRankingPeriod => {
  if (value && VALID_PERIODS.includes(value as AccountRankingPeriod)) {
    return value as AccountRankingPeriod;
  }
  return "1week";
};

export const loader = async ({ request }: { request: Request }) => {
  const params = new URL(request.url).searchParams;

  const startDateParam = resolveDateTimestamp(params.get("start_date"));
  const endDateParam = resolveDateTimestamp(params.get("end_date"));

  const { start_date, end_date } =
    startDateParam && endDateParam
      ? { start_date: startDateParam, end_date: endDateParam }
      : rankingPeriodToTimestamps(resolvePeriod(params.get("period")));

  const cacheKey = buildGraphCacheKey("top-note-accounts", {
    start_date,
    end_date,
  });
  const cached = graphCache.get(cacheKey) as
    | GraphFetchResult<TopNoteAccountDataItem[]>
    | undefined;
  if (cached) return cached;

  const result = await safeGraphFetch(() =>
    fetchTopNoteAccountsGraph({ start_date, end_date }),
  );
  if (result.ok) graphCache.set(cacheKey, result);
  return result;
};
