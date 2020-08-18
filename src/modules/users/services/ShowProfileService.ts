import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

@injectable()
export default class ShowProfileService {
    private usersRepository: IUsersRepository;

    constructor(@inject('UsersRepository') usersRepository: IUsersRepository) {
        this.usersRepository = usersRepository;
    }

    public async execute(userId: string): Promise<User> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new AppError(
                'Only authenticated users can update their profile',
                401,
            );
        }

        return user;
    }
}
