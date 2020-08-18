import { inject, injectable } from 'tsyringe';
import { differenceInHours } from 'date-fns';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';

interface IRequestDTO {
    password: string;
    token: string;
}

@injectable()
class ResetPasswordService {
    private usersRepository: IUsersRepository;

    private userTokensRepository: IUserTokensRepository;

    private hashProvider: IHashProvider;

    constructor(
        @inject('UsersRepository') usersRepository: IUsersRepository,
        @inject('UserTokensRepository')
        userTokensRepository: IUserTokensRepository,
        @inject('HashProvider') hashProvider: IHashProvider,
    ) {
        this.usersRepository = usersRepository;
        this.userTokensRepository = userTokensRepository;
        this.hashProvider = hashProvider;
    }

    public async execute({ password, token }: IRequestDTO): Promise<void> {
        const userToken = await this.userTokensRepository.findByToken(token);

        if (!userToken) {
            throw new AppError('Invalid token');
        }

        const user = await this.usersRepository.findById(userToken.userId);

        if (!user) {
            throw new AppError('User does not exist');
        }

        // differenceInHours returns negative if the date from the left
        // is smaller
        const hoursDiff = differenceInHours(Date.now(), userToken.createdAt);

        if (hoursDiff > 2) {
            throw new AppError('This token has already expired');
        }

        user.password = await this.hashProvider.generateHash(password);
        await this.usersRepository.save(user);
    }
}

export default ResetPasswordService;
