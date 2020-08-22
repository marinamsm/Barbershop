import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from 'redis';
import cacheConfig from '@config/cache';
import AppError from '@shared/errors/AppError';

const { host, port } = cacheConfig.config.redis;

const redisClient = redis.createClient({
    host,
    port,
    enable_offline_queue: false,
});

const limiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'middleware',
    points: 5, // 5 requests is the limit
    duration: 1, // 5 requests is the limit per 1 second by IP
});

export default async function rateLimiter(
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> {
    try {
        await limiter.consume(request.ip);

        return next();
    } catch (error) {
        throw new AppError('Too many requests', 429);
    }
}
