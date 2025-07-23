import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Define the CacheInterface that both Redis and InMemoryCache will implement
interface CacheInterface {
    set(key: string, value: string, expiryType?: string, expiryValue?: number): Promise<string | null>;
    get(key: string): Promise<string | null>;
    del(key: string): Promise<number>;
    exists(key: string): Promise<number>;
    flushAll(): Promise<boolean>;
    quit(): Promise<boolean>;
}

// In-memory cache for fallback when Redis is not available
class InMemoryCache implements CacheInterface {
    private cache: Map<string, { value: string; expiry?: number }> = new Map();
    
    // Set value with optional expiration
    async set(key: string, value: string, expiryType?: string, expiryValue?: number): Promise<string | null> {
        try {
            let expiry: number | undefined;
            
            // Calculate expiry timestamp if provided
            if (expiryType && expiryValue) {
                if (expiryType === 'EX') { // Seconds
                    expiry = Date.now() + (expiryValue * 1000);
                } else if (expiryType === 'PX') { // Milliseconds
                    expiry = Date.now() + expiryValue;
                }
            }
            
            this.cache.set(key, { value, expiry });
            return 'OK';
        } catch (error) {
            console.error('InMemoryCache set error:', error);
            return null;
        }
    }
    
    // Get value
    async get(key: string): Promise<string | null> {
        try {
            const entry = this.cache.get(key);
            
            // Check if entry exists and not expired
            if (entry) {
                if (entry.expiry && entry.expiry < Date.now()) {
                    // Expired, delete and return null
                    this.cache.delete(key);
                    return null;
                }
                return entry.value;
            }
            return null;
        } catch (error) {
            console.error('InMemoryCache get error:', error);
            return null;
        }
    }
    
    // Delete key
    async del(key: string): Promise<number> {
        try {
            const deleted = this.cache.delete(key);
            return deleted ? 1 : 0;
        } catch (error) {
            console.error('InMemoryCache del error:', error);
            return 0;
        }
    }
    
    // Check if key exists
    async exists(key: string): Promise<number> {
        try {
            return this.cache.has(key) ? 1 : 0;
        } catch (error) {
            console.error('InMemoryCache exists error:', error);
            return 0;
        }
    }
    
    // Flush all keys
    async flushAll(): Promise<boolean> {
        try {
            this.cache.clear();
            return true;
        } catch (error) {
            console.error('InMemoryCache flushAll error:', error);
            return false;
        }
    }
    
    // No-op since there's no connection to close
    async quit(): Promise<boolean> {
        return true;
    }
}

// Redis wrapper class implementing CacheInterface
class RedisCache implements CacheInterface {
    private client;
    private connected = false;

    constructor(url: string) {
        this.client = createClient({ url });
        
        this.client.on('error', (err: Error) => {
            console.error('Redis connection error:', err);
            this.connected = false;
        });

        this.client.on('connect', () => {
            console.log('Redis connected successfully');
            this.connected = true;
        });

        // Connect only in production or if explicitly enabled
        if (process.env.NODE_ENV === 'production' || process.env.ENABLE_REDIS === 'true') {
            this.connect().catch(console.error);
        } else {
            console.log('Redis is disabled in development mode. Set ENABLE_REDIS=true to enable.');
        }
        
        // Handle process termination
        process.on('SIGINT', async () => {
            await this.quit();
            process.exit(0);
        });
    }

    private async connect(): Promise<void> {
        if (!this.connected) {
            try {
                await this.client.connect();
                this.connected = true;
            } catch (error) {
                console.error('Redis connection failed:', error);
                this.connected = false;
                throw error;
            }
        }
    }

    // Set value with optional expiration
    async set(key: string, value: string, expiryType?: string, expiryValue?: number): Promise<string | null> {
        try {
            await this.connect();
            
            if (expiryType && expiryValue) {
                return await this.client.set(key, value, {
                    [expiryType]: expiryValue
                });
            } else {
                return await this.client.set(key, value);
            }
        } catch (error) {
            console.error('Redis set error:', error);
            return null;
        }
    }

    // Get value
    async get(key: string): Promise<string | null> {
        try {
            await this.connect();
            return await this.client.get(key);
        } catch (error) {
            console.error('Redis get error:', error);
            return null;
        }
    }

    // Delete key
    async del(key: string): Promise<number> {
        try {
            await this.connect();
            return await this.client.del(key);
        } catch (error) {
            console.error('Redis del error:', error);
            return 0;
        }
    }

    // Check if key exists
    async exists(key: string): Promise<number> {
        try {
            await this.connect();
            return await this.client.exists(key);
        } catch (error) {
            console.error('Redis exists error:', error);
            return 0;
        }
    }

    // Flush all keys (use with caution)
    async flushAll(): Promise<boolean> {
        try {
            await this.connect();
            await this.client.flushAll();
            return true;
        } catch (error) {
            console.error('Redis flushAll error:', error);
            return false;
        }
    }

    // Close connection
    async quit(): Promise<boolean> {
        try {
            if (this.connected) {
                await this.client.quit();
                this.connected = false;
                console.log('Redis connection closed');
            }
            return true;
        } catch (error) {
            console.error('Redis quit error:', error);
            return false;
        }
    }
}

// Determine if Redis should be used
const useRedis = process.env.NODE_ENV === 'production' || process.env.ENABLE_REDIS === 'true';
let redis: CacheInterface;

// Initialize the appropriate cache implementation
if (useRedis) {
    try {
        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
        redis = new RedisCache(redisUrl);
        console.log('Using Redis cache');
    } catch (error) {
        console.error('Error initializing Redis:', error);
        console.log('Falling back to in-memory cache');
        redis = new InMemoryCache();
    }
} else {
    console.log('Redis is disabled. Using in-memory cache instead.');
    redis = new InMemoryCache();
}

export { redis };
export default redis;
