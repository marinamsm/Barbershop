import path from 'path';
import fs from 'fs';
import {getRepository} from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

interface Request {
    userId: string;
    avatarFilename: string;
}

export default class UpdateUserAvatarService {
    public async execute({userId, avatarFilename}: Request) : Promise<User> {
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne(userId);

        if (!user) {
            throw new AppError('Only authenticated users can change their avatar', 401);
        }

        if (user.avatar) {
            const avatarFilePath = path.resolve(uploadConfig.destinationPath, user.avatar);
            const fileExists = await fs.promises.stat(avatarFilePath);

            if (fileExists) {
                await fs.promises.unlink(avatarFilePath);
            }
        }

        user.avatar = avatarFilename;

        await usersRepository.save(user);

        delete user.password;

        return user;
    }
}
