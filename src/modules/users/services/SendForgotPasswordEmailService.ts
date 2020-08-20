import path from 'path';
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

interface IRequestDTO {
    email: string;
}

@injectable()
class SendForgotPasswordEmailService {
    private usersRepository: IUsersRepository;

    private mailProvider: IMailProvider;

    private userTokensRepository: IUserTokensRepository;

    constructor(
        @inject('UsersRepository') usersRepository: IUsersRepository,
        @inject('MailProvider') mailProvider: IMailProvider,
        @inject('UserTokensRepository')
        userTokensRepository: IUserTokensRepository,
    ) {
        this.usersRepository = usersRepository;
        this.mailProvider = mailProvider;
        this.userTokensRepository = userTokensRepository;
    }

    public async execute({ email }: IRequestDTO): Promise<void> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('E-mail não existe', 400);
        }

        const { token } = await this.userTokensRepository.generate(user.id);

        const templateFilePath = path.resolve(
            __dirname,
            '..',
            'views',
            'forgot_password.hbs',
        );

        return this.mailProvider.sendEmail({
            to: {
                name: user.name,
                email: user.email,
            },
            subject: '[GoBarber] Recuperação de senha',
            templateData: {
                file: templateFilePath,
                variables: {
                    name: user.name,
                    link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
                },
            },
        });
    }
}

export default SendForgotPasswordEmailService;
