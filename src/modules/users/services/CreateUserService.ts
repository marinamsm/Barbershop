import { inject, injectable } from 'tsyringe';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
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

    constructor(
        @inject('UsersRepository') usersRepository: IUsersRepository,
        @inject('HashProvider') hashProvider: IHashProvider,
    ) {
        this.usersRepository = usersRepository;
        this.hashProvider = hashProvider;
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

        return this.usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });
    }
}

export default CreateUserService;
