interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class TtlCache {
  private store = new Map<string, CacheEntry<unknown>>();

  constructor(private defaultTtlMs: number = 60_000) {}

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);

    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs?: number): void {
    this.store.set(key, {
      data,
      expiresAt: Date.now() + (ttlMs ?? this.defaultTtlMs),
    });
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  async fetch<T>(key: string, fetcher: () => Promise<T>, ttlMs?: number): Promise<T> {
    const cached = this.get<T>(key);

    if (cached !== undefined) return cached;

    const data = await fetcher();
    this.set(key, data, ttlMs);

    return data;
  }

  clear(): void {
    this.store.clear();
  }
}
