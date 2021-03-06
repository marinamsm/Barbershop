import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeUsersRepository from '@modules/users/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();
        createUserService = new CreateUserService(
            fakeRepository,
            fakeHashProvider,
            fakeCacheProvider,
        );
    });

    it('should create a new user', async () => {
        const newUser = await createUserService.execute({
            name: 'Jhon Doe',
            email: 'jd@gmail.com',
            password: '123456789',
        });

        expect(newUser).toHaveProperty('id');
        expect(newUser.email).toBe('jd@gmail.com');
    });

    it("shouldn't create another user with the same email", async () => {
        const email = 'jd@gmail.com';
        await createUserService.execute({
            name: 'Jhon Doe',
            email,
            password: '123456789',
        });

        await expect(
            createUserService.execute({
                name: 'Jane Doe',
                email,
                password: '123456333',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
