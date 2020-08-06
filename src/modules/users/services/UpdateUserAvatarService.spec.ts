import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import FakeUsersRepository from '@modules/users/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

describe('Update User Avatar', () => {
    it("should add user's avatar", async () => {
        const fakeRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();
        const updateUserAvatarService = new UpdateUserAvatarService(
            fakeRepository,
            fakeStorageProvider,
        );

        const newUser = await fakeRepository.create({
            name: 'Jhon Doe',
            email: 'jd@gmail.com',
            password: '123456789',
        });

        const userUpdated = await updateUserAvatarService.execute({
            userId: newUser.id,
            avatarFilename: 'avatar-test.jpg',
        });

        expect(userUpdated.avatar).toBe('avatar-test.jpg');
    });

    it('should update old avatar to new one', async () => {
        const fakeRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();
        const updateUserAvatarService = new UpdateUserAvatarService(
            fakeRepository,
            fakeStorageProvider,
        );
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
        const newUser = await fakeRepository.create({
            name: 'Jhon Doe',
            email: 'jd@gmail.com',
            password: '123456789',
        });

        await updateUserAvatarService.execute({
            userId: newUser.id,
            avatarFilename: 'avatar-test-old.jpg',
        });

        const userUpdated = await updateUserAvatarService.execute({
            userId: newUser.id,
            avatarFilename: 'avatar-test-new.jpg',
        });

        expect(deleteFile).toHaveBeenCalledWith('avatar-test-old.jpg');
        expect(userUpdated.avatar).toBe('avatar-test-new.jpg');
    });

    it("should not add user's avatar in unlogged user", async () => {
        const fakeRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();
        const updateUserAvatarService = new UpdateUserAvatarService(
            fakeRepository,
            fakeStorageProvider,
        );

        expect(
            updateUserAvatarService.execute({
                userId: '987654321',
                avatarFilename: 'avatar-test.jpg',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
