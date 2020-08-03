import path from 'path';
import fs from 'fs';
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

interface IRequest {
    userId: string;
    avatarFilename: string;
}

@injectable()
export default class UpdateUserAvatarService {
    private usersRepository: IUsersRepository;

    constructor(@inject('UsersRepository') usersRepository: IUsersRepository) {
        this.usersRepository = usersRepository;
    }

    public async execute({ userId, avatarFilename }: IRequest): Promise<User> {
        let user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new AppError(
                'Only authenticated users can change their avatar',
                401,
            );
        }

        if (user.avatar) {
            const avatarFilePath = path.resolve(
                uploadConfig.destinationPath,
                user.avatar,
            );
            const fileExists = await fs.promises.stat(avatarFilePath);

            if (fileExists) {
                await fs.promises.unlink(avatarFilePath);
            }
        }

        user.avatar = avatarFilename;

        user = await this.usersRepository.save(user);

        // delete user.password;

        return user;
    }
}
