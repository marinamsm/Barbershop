import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import FakeUsersRepository from '@modules/users/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

let fakeRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatarService: UpdateUserAvatarService;

describe('Update User Avatar', () => {
    beforeEach(() => {
        fakeRepository = new FakeUsersRepository();
        fakeStorageProvider = new FakeStorageProvider();
        updateUserAvatarService = new UpdateUserAvatarService(
            fakeRepository,
            fakeStorageProvider,
        );
    });
    it("should add user's avatar", async () => {
        const newUser = await fakeRepository.create({
            name: 'Jhon Doe',
            email: 'jd@gmail.com',
            password: '123456789',
        });

        const userUpdated = await updateUserAvatarService.execute({
            userId: newUser.id,
            avatarFilename: 'avatar-test.jpg',
        });

        expect(userUpdated.avatar).toContain('avatar-test.jpg');
    });

    it('should update old avatar to new one', async () => {
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
        expect(userUpdated.avatar).toContain('avatar-test-new.jpg');
    });

    it("should not add user's avatar in unlogged user", async () => {
        await expect(
            updateUserAvatarService.execute({
                userId: '987654321',
                avatarFilename: 'avatar-test.jpg',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
