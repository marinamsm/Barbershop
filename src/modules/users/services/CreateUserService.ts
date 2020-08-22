import { inject, injectable } from 'tsyringe';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

interface IRequestDTO {
    name: string;
    email: string;
    password: string;
}

@injectable()
class CreateUserService {
    private usersRepository: IUsersRepository;

    private hashProvider: IHashProvider;

    private cacheProvider: ICacheProvider;

    constructor(
        @inject('UsersRepository') usersRepository: IUsersRepository,
        @inject('HashProvider') hashProvider: IHashProvider,
        @inject('CacheProvider') cacheProvider: ICacheProvider,
    ) {
        this.usersRepository = usersRepository;
        this.hashProvider = hashProvider;
        this.cacheProvider = cacheProvider;
    }

    public async execute({
        name,
        email,
        password,
    }: IRequestDTO): Promise<User> {
        const existentUser = await this.usersRepository.findByEmail(email);

        if (existentUser) {
            throw new AppError('Someone is already using this email');
        }

        const hashedPassword = await this.hashProvider.generateHash(password);

        const newUser = this.usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        await this.cacheProvider.invalidateByPrefix('providers-list');

        return newUser;
    }
}

export default CreateUserService;
