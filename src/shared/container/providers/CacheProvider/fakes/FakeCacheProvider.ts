import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface ICacheData {
    [key: string]: string;
}

export default class FakeCacheProvider implements ICacheProvider {
    private cache: ICacheData;

    constructor() {
        this.cache = {};
    }

    public async save(key: string, value: any): Promise<void> {
        this.cache[key] = JSON.stringify(value);
    }

    public async recover<T>(key: string): Promise<T | null> {
        return this.cache[key] ? (JSON.parse(this.cache[key]) as T) : null;
    }

    public async invalidate(key: string): Promise<number> {
        try {
            delete this.cache[key];

            return 1;
        } catch (error) {
            console.error(error);

            return 0;
        }
    }

    public async invalidateByPrefix(prefix: string): Promise<void> {
        const keys = Object.keys(this.cache).filter(key =>
            key.startsWith(`${prefix}:`),
        );

        keys.forEach(key => {
            delete this.cache[key];
        });
    }
}
