import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import FakeUsersRepository from '@modules/users/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/fakes/FakeUserTokensRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

let fakeRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPassword', () => {
    beforeEach(() => {
        fakeRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();
        resetPasswordService = new ResetPasswordService(
            fakeRepository,
            fakeUserTokensRepository,
            fakeHashProvider,
        );
    });

    it('should reset the password using the token', async () => {
        const password = '123456';
        const newUser = await fakeRepository.create({
            name: 'John Doe',
            email: 'jd@gmail.com',
            password,
        });

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        const { token } = await fakeUserTokensRepository.generate(newUser.id);

        const newPass = 'novasenha';

        await resetPasswordService.execute({
            password: newPass,
            token,
        });

        const userUpdated = await fakeRepository.findById(newUser.id);

        expect(userUpdated?.password).toBe(newPass);
        expect(generateHash).toHaveBeenCalledWith(newPass);
    });

    it('should not reset the password with non-existing token', async () => {
        await expect(
            resetPasswordService.execute({
                password: '123123123',
                token: 'token-invalido',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not reset the password with non-existing user', async () => {
        const userToken = await fakeUserTokensRepository.findByToken(
            'token-invalido',
        );

        await expect(
            resetPasswordService.execute({
                password: '123123123',
                token: userToken?.token || '',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not reset the password 2 hours after the token is generated', async () => {
        const password = '123456';
        const newUser = await fakeRepository.create({
            name: 'John Doe',
            email: 'jd@gmail.com',
            password,
        });

        const { token } = await fakeUserTokensRepository.generate(newUser.id);

        jest.spyOn(Date, 'now').mockImplementation(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(
            resetPasswordService.execute({
                password: '123123123',
                token,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
