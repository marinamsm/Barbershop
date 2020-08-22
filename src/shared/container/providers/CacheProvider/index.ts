import { container } from 'tsyringe';
import RedisCacheProvider from '@shared/container/providers/CacheProvider/implementations/RedisCacheProvider';
import cacheConfig from '@config/cache';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

const cacheDriver = {
    redis: RedisCacheProvider,
};

container.registerSingleton<ICacheProvider>(
    'CacheProvider',
    cacheDriver[cacheConfig.driver],
);
