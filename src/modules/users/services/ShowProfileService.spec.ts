import 'reflect-metadata';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import FakeUsersRepository from '@modules/users/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

let fakeRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('Show Profile', () => {
    beforeEach(() => {
        fakeRepository = new FakeUsersRepository();
        showProfileService = new ShowProfileService(fakeRepository);
    });
    it('should show the profile', async () => {
        const newUser = await fakeRepository.create({
            name: 'Jhon Doe',
            email: 'jd@gmail.com',
            password: '123456789',
        });

        const userUpdated = await showProfileService.execute(newUser.id);

        expect(userUpdated.name).toBe('Jhon Doe');
        expect(userUpdated.email).toBe('jd@gmail.com');
    });
    it('should not show the profile of non-existing user', async () => {
        await expect(
            showProfileService.execute('invalid-id'),
        ).rejects.toBeInstanceOf(AppError);
    });
});
