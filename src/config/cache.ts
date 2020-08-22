import { RedisOptions } from 'ioredis';

interface ICacheConfig {
    driver: 'redis';
    config: {
        redis: RedisOptions;
    };
}

export default {
    driver: process.env.CACHE_DRIVER || 'redis',
    config: {
        redis: {
            host: '127.0.0.1',
            port: 6379,
            password: undefined,
        },
    },
} as ICacheConfig;
