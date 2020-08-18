import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import FakeUsersRepository from '@modules/users/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

let fakeRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('Update Profile', () => {
    beforeEach(() => {
        fakeRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        updateProfileService = new UpdateProfileService(
            fakeRepository,
            fakeHashProvider,
        );
    });
    it('should update the profile', async () => {
        const newUser = await fakeRepository.create({
            name: 'Jhon Doe',
            email: 'jd@gmail.com',
            password: '123456789',
        });

        const userUpdated = await updateProfileService.execute({
            userId: newUser.id,
            name: 'Jane Doe',
            email: 'janed@gmail.com',
        });

        expect(userUpdated.name).toBe('Jane Doe');
        expect(userUpdated.email).toBe('janed@gmail.com');
    });
    it('should not update the email', async () => {
        await fakeRepository.create({
            name: 'Jhon Doe',
            email: 'jd@gmail.com',
            password: '123456789',
        });

        const newUser = await fakeRepository.create({
            name: 'Test Doe',
            email: 'testdoe@gmail.com',
            password: '123456789',
        });

        await expect(
            updateProfileService.execute({
                userId: newUser.id,
                name: 'Jhon Doe',
                email: 'jd@gmail.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
    it('should update the password', async () => {
        const newUser = await fakeRepository.create({
            name: 'Jhon Doe',
            email: 'jd@gmail.com',
            password: '123456789',
        });

        const newPassword = '123123123';
        const userUpdated = await updateProfileService.execute({
            userId: newUser.id,
            name: 'Jhon Doe',
            email: 'jd@gmail.com',
            oldPassword: '123456789',
            password: newPassword,
        });

        const compareHash = await fakeHashProvider.compareHash(
            newPassword,
            userUpdated.password,
        );

        expect(compareHash).toBe(true);
    });
    it('should not update the password without the oldPassword', async () => {
        const newUser = await fakeRepository.create({
            name: 'Jhon Doe',
            email: 'jd@gmail.com',
            password: '123456789',
        });

        await expect(
            updateProfileService.execute({
                userId: newUser.id,
                name: 'Jhon Doe',
                email: 'jd@gmail.com',
                password: '123123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
    it('should not update the password with wrong oldPassword', async () => {
        const newUser = await fakeRepository.create({
            name: 'Jhon Doe',
            email: 'jd@gmail.com',
            password: '123456789',
        });

        await expect(
            updateProfileService.execute({
                userId: newUser.id,
                name: 'Jhon Doe',
                email: 'jd@gmail.com',
                oldPassword: 'wrong-pass',
                password: '123123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
    it('should not update the profile of non-existing user', async () => {
        await expect(
            updateProfileService.execute({
                userId: 'invalid-id',
                name: 'Jhon Doe',
                email: 'jd@gmail.com',
                oldPassword: 'wrong-pass',
                password: '123123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
