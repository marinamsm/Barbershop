import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
    userId?: string;
}

@injectable()
class ListProvidersService {
    private usersRepository: IUsersRepository;

    private cacheProvider: ICacheProvider;

    constructor(
        @inject('UsersRepository')
        usersRepository: IUsersRepository,
        @inject('CacheProvider')
        cacheProvider: ICacheProvider,
    ) {
        this.usersRepository = usersRepository;
        this.cacheProvider = cacheProvider;
    }

    public async execute({ userId }: IRequest): Promise<User[]> {
        const indexKey = `providers-list:${userId}`;

        let providers = await this.cacheProvider.recover<User[]>(indexKey);

        if (!providers) {
            console.log('------QUERY-------');
            providers = await this.usersRepository.findAllProviders({
                exceptOwnId: userId,
            });

            await this.cacheProvider.save(indexKey, classToClass(providers));
        }

        return providers;
    }
}

export default ListProvidersService;
