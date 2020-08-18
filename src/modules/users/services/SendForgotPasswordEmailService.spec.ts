import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import FakeUsersRepository from '@modules/users/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/fakes/FakeUserTokensRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

let fakeRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
    beforeEach(() => {
        fakeRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        sendEmailService = new SendForgotPasswordEmailService(
            fakeRepository,
            fakeMailProvider,
            fakeUserTokensRepository,
        );
    });

    it('should recover the password using the email', async () => {
        const sendEmail = jest.spyOn(fakeMailProvider, 'sendEmail');

        await fakeRepository.create({
            name: 'John Doe',
            email: 'jd@gmail.com',
            password: '123456',
        });

        await sendEmailService.execute({
            email: 'jd@gmail.com',
        });

        // expect(forgotPass).toBe('123456');
        expect(sendEmail).toHaveBeenCalled();
    });

    it('should not recover the password from non-existing email', async () => {
        await expect(
            sendEmailService.execute({
                email: 'test@gmail.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should generate a token when asked to recover the password', async () => {
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

        const newUser = await fakeRepository.create({
            name: 'John Doe',
            email: 'jd@gmail.com',
            password: '123456',
        });

        await sendEmailService.execute({
            email: 'jd@gmail.com',
        });

        // expect(forgotPass).toBe('123456');
        expect(generateToken).toHaveBeenCalledWith(newUser.id);
    });
});
