import { redisClient } from '../configs/redis';
import logger from '../configs/logger';
export default class CacheService {
    
    async store(key: string, value: string, ttl: number): Promise<void> {
        try {
            await redisClient.setEx(key, ttl, value);
        } catch (error) {
            logger.error(`Error storing value in Redis for key "${key}":`, error);
            throw new Error('Failed to store data in cache');
        }
    }

   
    async retrieve(key: string): Promise<string | null> {
        try {
            return await redisClient.get(key);
        } catch (error) {
            logger.error(`Error retrieving value from Redis for key "${key}":`, error);
            throw new Error('Failed to retrieve data from cache');
        }
    }

    async delete(key: string): Promise<void> {
        try {
            await redisClient.del(key);
        } catch (error) {
            logger.error(`Error deleting key "${key}" from Redis:`, error);
            throw new Error('Failed to delete data from cache');
        }
    }

   
    async exists(key: string): Promise<boolean> {
        try {
            const exists = await redisClient.exists(key);
            return exists > 0;
        } catch (error) {
            console.error(`Error checking existence of key "${key}" in Redis:`, error);
            throw new Error('Failed to check existence in cache');
        }
    }

   
    async extendTTL(key: string, ttl: number): Promise<void> {
        try {
            const result = await redisClient.expire(key, ttl);
            if (result) {
                throw new Error(`Key "${key}" does not exist or could not update TTL.`);
            }
        } catch (error) {
            console.error(`Error extending TTL for key "${key}" in Redis:`, error);
            throw new Error('Failed to extend TTL in cache');
        }
    }
}
