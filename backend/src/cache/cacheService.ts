import Redis from 'ioredis';

export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  flush(): Promise<void>;
  isRedisConnected(): boolean;
}

export class HybridCacheService implements ICacheService {
  private redisClient: Redis | null = null;
  private memoryCache: Map<string, { value: string; expiry: number | null }> = new Map();
  private redisAvailable: boolean = false;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    try {
      this.redisClient = new Redis(redisUrl, {
        lazyConnect: true,
        connectTimeout: 2000,
        maxRetriesPerRequest: 1,
        retryStrategy: () => null, // Do not infinite retry if Redis is not available
      });

      this.redisClient.connect()
        .then(() => {
          this.redisAvailable = true;
          console.log('[Cache] Successfully connected to Redis at', redisUrl);
        })
        .catch((err) => {
          this.redisAvailable = false;
          console.log('[Cache] Redis unavailable, seamlessly using High-Performance In-Memory Cache layer.', err.message);
        });

      this.redisClient.on('error', () => {
        this.redisAvailable = false;
      });
    } catch {
      this.redisAvailable = false;
      console.log('[Cache] Operating in In-Memory Cache mode.');
    }
  }

  public isRedisConnected(): boolean {
    return this.redisAvailable;
  }

  async get<T>(key: string): Promise<T | null> {
    if (this.redisAvailable && this.redisClient) {
      try {
        const data = await this.redisClient.get(key);
        if (data) return JSON.parse(data) as T;
      } catch (err) {
        console.warn(`[Cache] Redis GET failed for key ${key}, falling back to memory:`, err);
      }
    }

    const item = this.memoryCache.get(key);
    if (!item) return null;
    if (item.expiry && Date.now() > item.expiry) {
      this.memoryCache.delete(key);
      return null;
    }
    return JSON.parse(item.value) as T;
  }

  async set(key: string, value: unknown, ttlSeconds: number = 300): Promise<void> {
    const serialized = JSON.stringify(value);

    if (this.redisAvailable && this.redisClient) {
      try {
        if (ttlSeconds > 0) {
          await this.redisClient.set(key, serialized, 'EX', ttlSeconds);
        } else {
          await this.redisClient.set(key, serialized);
        }
      } catch (err) {
        console.warn(`[Cache] Redis SET failed for key ${key}, falling back to memory:`, err);
      }
    }

    const expiry = ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : null;
    this.memoryCache.set(key, { value: serialized, expiry });
  }

  async del(key: string): Promise<void> {
    if (this.redisAvailable && this.redisClient) {
      try {
        await this.redisClient.del(key);
      } catch (err) {
        console.warn(`[Cache] Redis DEL failed for key ${key}:`, err);
      }
    }
    this.memoryCache.delete(key);
  }

  async flush(): Promise<void> {
    if (this.redisAvailable && this.redisClient) {
      try {
        await this.redisClient.flushdb();
      } catch (err) {
        console.warn('[Cache] Redis flush failed:', err);
      }
    }
    this.memoryCache.clear();
  }
}

export const cacheService = new HybridCacheService();
