import {getRepository} from 'typeorm';
import {compare} from 'bcryptjs';
import {sign} from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../config/auth';
import AppError from '../errors/AppError';

interface Request {
    email: string;
    password: string;
}

interface Response {
    user: object;
    token: string;
}

class CreateUserService {
    public async execute({email, password}: Request): Promise<Response> {
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne({
            where: {
                email
            }
        });

        if (!user) {
            throw new AppError('Email/password invalid', 401);
        }

        const validPassword = await compare(password, user.password);

        if (!validPassword) {
            throw new AppError('Email/password invalid', 401);
        }

        delete user.password;

        const {secret, expiresIn} = authConfig.jwt;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn
        })

        return {user, token};
    }

}

export default CreateUserService;
