import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
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

    public async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Email/password invalid', 401);
        }

        const validPassword = await this.hashProvider.compareHash(
            password,
            user.password,
        );

        if (!validPassword) {
            throw new AppError('Email/password invalid', 401);
        }

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        return { user: classToClass(user), token };
    }
}

export default CreateUserService;
