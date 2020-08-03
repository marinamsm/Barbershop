import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: object;
    token: string;
}

@injectable()
class CreateUserService {
    private usersRepository: IUsersRepository;

    constructor(@inject('UsersRepository') usersRepository: IUsersRepository) {
        this.usersRepository = usersRepository;
    }

    public async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Email/password invalid', 401);
        }

        const validPassword = await compare(password, user.password);

        if (!validPassword) {
            throw new AppError('Email/password invalid', 401);
        }

        delete user.password;

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        return { user, token };
    }
}

export default CreateUserService;
