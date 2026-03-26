type CacheEntry<T> = {
  value: T;
  expiresAt: number;
  updatedAt: number;
};

type MemoryCacheOptions = {
  ttlMs: number;
  maxEntries: number;
};

export const createMemoryCache = <T>({ ttlMs, maxEntries }: MemoryCacheOptions) => {
  const cache = new Map<string, CacheEntry<T>>();

  const prune = () => {
    const now = Date.now();
    for (const [key, entry] of cache.entries()) {
      if (entry.expiresAt <= now) {
        cache.delete(key);
      }
    }

    if (cache.size <= maxEntries) return;

    const entries = Array.from(cache.entries()).sort(
      (a, b) => a[1].updatedAt - b[1].updatedAt
    );
    const excess = entries.length - maxEntries;
    entries.slice(0, excess).forEach(([key]) => cache.delete(key));
  };

  const get = (key: string): T | undefined => {
    const entry = cache.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= Date.now()) {
      cache.delete(key);
      return undefined;
    }
    return entry.value;
  };

  const set = (key: string, value: T) => {
    const now = Date.now();
    cache.set(key, {
      value,
      expiresAt: now + ttlMs,
      updatedAt: now,
    });
    prune();
  };

  const clear = () => {
    cache.clear();
  };

  return {
    get,
    set,
    clear,
  };
};
