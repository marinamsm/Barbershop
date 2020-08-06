import path from 'path';
import fs from 'fs';
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
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

    private storageProvider: IStorageProvider;

    constructor(
        @inject('UsersRepository') usersRepository: IUsersRepository,
        @inject('StorageProvider') storageProvider: IStorageProvider,
    ) {
        this.usersRepository = usersRepository;
        this.storageProvider = storageProvider;
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
            await this.storageProvider.deleteFile(user.avatar);
        }

        const filename = await this.storageProvider.saveFile(avatarFilename);
        user.avatar = filename;

        user = await this.usersRepository.save(user);
        delete user.password;

        return user;
    }
}
