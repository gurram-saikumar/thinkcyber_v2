"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// In-memory cache for fallback when Redis is not available
class InMemoryCache {
    constructor() {
        this.cache = new Map();
    }
    // Set value with optional expiration
    async set(key, value, expiryType, expiryValue) {
        try {
            let expiry;
            // Calculate expiry timestamp if provided
            if (expiryType && expiryValue) {
                if (expiryType === 'EX') { // Seconds
                    expiry = Date.now() + (expiryValue * 1000);
                }
                else if (expiryType === 'PX') { // Milliseconds
                    expiry = Date.now() + expiryValue;
                }
            }
            this.cache.set(key, { value, expiry });
            return 'OK';
        }
        catch (error) {
            console.error('InMemoryCache set error:', error);
            return null;
        }
    }
    // Get value
    async get(key) {
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
        }
        catch (error) {
            console.error('InMemoryCache get error:', error);
            return null;
        }
    }
    // Delete key
    async del(key) {
        try {
            const deleted = this.cache.delete(key);
            return deleted ? 1 : 0;
        }
        catch (error) {
            console.error('InMemoryCache del error:', error);
            return 0;
        }
    }
    // Check if key exists
    async exists(key) {
        try {
            return this.cache.has(key) ? 1 : 0;
        }
        catch (error) {
            console.error('InMemoryCache exists error:', error);
            return 0;
        }
    }
    // Flush all keys
    async flushAll() {
        try {
            this.cache.clear();
            return true;
        }
        catch (error) {
            console.error('InMemoryCache flushAll error:', error);
            return false;
        }
    }
    // No-op since there's no connection to close
    async quit() {
        return true;
    }
}
// Redis wrapper class implementing CacheInterface
class RedisCache {
    constructor(url) {
        this.connected = false;
        this.client = (0, redis_1.createClient)({ url });
        this.client.on('error', (err) => {
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
        }
        else {
            console.log('Redis is disabled in development mode. Set ENABLE_REDIS=true to enable.');
        }
        // Handle process termination
        process.on('SIGINT', async () => {
            await this.quit();
            process.exit(0);
        });
    }
    async connect() {
        if (!this.connected) {
            try {
                await this.client.connect();
                this.connected = true;
            }
            catch (error) {
                console.error('Redis connection failed:', error);
                this.connected = false;
                throw error;
            }
        }
    }
    // Set value with optional expiration
    async set(key, value, expiryType, expiryValue) {
        try {
            await this.connect();
            if (expiryType && expiryValue) {
                return await this.client.set(key, value, {
                    [expiryType]: expiryValue
                });
            }
            else {
                return await this.client.set(key, value);
            }
        }
        catch (error) {
            console.error('Redis set error:', error);
            return null;
        }
    }
    // Get value
    async get(key) {
        try {
            await this.connect();
            return await this.client.get(key);
        }
        catch (error) {
            console.error('Redis get error:', error);
            return null;
        }
    }
    // Delete key
    async del(key) {
        try {
            await this.connect();
            return await this.client.del(key);
        }
        catch (error) {
            console.error('Redis del error:', error);
            return 0;
        }
    }
    // Check if key exists
    async exists(key) {
        try {
            await this.connect();
            return await this.client.exists(key);
        }
        catch (error) {
            console.error('Redis exists error:', error);
            return 0;
        }
    }
    // Flush all keys (use with caution)
    async flushAll() {
        try {
            await this.connect();
            await this.client.flushAll();
            return true;
        }
        catch (error) {
            console.error('Redis flushAll error:', error);
            return false;
        }
    }
    // Close connection
    async quit() {
        try {
            if (this.connected) {
                await this.client.quit();
                this.connected = false;
                console.log('Redis connection closed');
            }
            return true;
        }
        catch (error) {
            console.error('Redis quit error:', error);
            return false;
        }
    }
}
// Determine if Redis should be used
const useRedis = process.env.NODE_ENV === 'production' || process.env.ENABLE_REDIS === 'true';
let redis;
// Initialize the appropriate cache implementation
if (useRedis) {
    try {
        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
        exports.redis = redis = new RedisCache(redisUrl);
        console.log('Using Redis cache');
    }
    catch (error) {
        console.error('Error initializing Redis:', error);
        console.log('Falling back to in-memory cache');
        exports.redis = redis = new InMemoryCache();
    }
}
else {
    console.log('Redis is disabled. Using in-memory cache instead.');
    exports.redis = redis = new InMemoryCache();
}
exports.default = redis;
