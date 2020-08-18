import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateSessionService from '@modules/users/services/CreateSessionService';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeUsersRepository from '@modules/users/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

let fakeRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createSessionService: CreateSessionService;

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        createSessionService = new CreateSessionService(
            fakeRepository,
            fakeHashProvider,
        );
    });
    it('should authenticate the user', async () => {
        const email = 'jd@gmail.com';
        const password = '123456789';
        const newUser = await fakeRepository.create({
            name: 'Jhon Doe',
            email,
            password,
        });

        const newSession = await createSessionService.execute({
            email,
            password,
        });

        expect(newSession).toHaveProperty('token');
        expect(newSession.user).toEqual(newUser);
    });

    it('should not authenticate with non existing the user', async () => {
        await expect(
            createSessionService.execute({
                email: 'fiuahefihef@gmail.com',
                password: '123456789',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not authenticate with wrong password', async () => {
        const email = 'jd@gmail.com';
        await fakeRepository.create({
            name: 'Jhon Doe',
            email,
            password: '123456789',
        });

        await expect(
            createSessionService.execute({
                email,
                password: '987654321',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
