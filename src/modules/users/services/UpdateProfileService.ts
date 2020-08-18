import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

interface IRequest {
    userId: string;
    name: string;
    email: string;
    oldPassword?: string;
    password?: string;
}

@injectable()
export default class UpdateProfileService {
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
        userId,
        name,
        email,
        oldPassword,
        password,
    }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new AppError(
                'Only authenticated users can update their profile',
                401,
            );
        }

        const existingUser = await this.usersRepository.findByEmail(email);

        if (existingUser && existingUser.id !== user.id) {
            throw new AppError('This email is already being used');
        }

        user.email = email;
        user.name = name;

        if (password && !oldPassword) {
            throw new AppError('Old password must be provided as well');
        }

        if (password && oldPassword) {
            const oldPasswordCheck = await this.hashProvider.compareHash(
                oldPassword,
                user.password,
            );

            if (!oldPasswordCheck) {
                throw new AppError('Old password mismatch');
            }
            user.password = await this.hashProvider.generateHash(password);
        }

        return this.usersRepository.save(user);
    }
}
