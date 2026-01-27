import type { GraphFetchResult, GraphFetchResultWithMarkers } from "~/components/graph";

import { createMemoryCache } from "./memoryCache";

export const GRAPH_CACHE_TTL_MS = 30_000;
const GRAPH_CACHE_MAX_ENTRIES = 100;

type GraphCacheValue =
  | GraphFetchResult<unknown>
  | GraphFetchResultWithMarkers<unknown>;

export const graphCache = createMemoryCache<GraphCacheValue>({
  ttlMs: GRAPH_CACHE_TTL_MS,
  maxEntries: GRAPH_CACHE_MAX_ENTRIES,
});

export const buildGraphCacheKey = (
  graphType: string,
  params: Record<string, string | number | undefined>
): string => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return;
    search.set(key, String(value));
  });

  const query = search.toString();
  return query ? `${graphType}?${query}` : graphType;
};
