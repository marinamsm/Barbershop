import 'reflect-metadata';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import FakeUsersRepository from '@modules/users/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

let fakeRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;

describe('List Providers', () => {
    beforeEach(() => {
        fakeRepository = new FakeUsersRepository();
        listProvidersService = new ListProvidersService(fakeRepository);
    });
    it('should list all providers except logged user', async () => {
        const user1 = await fakeRepository.create({
            name: 'Jhon Doe',
            email: 'jd@gmail.com',
            password: '123456789',
        });

        const user2 = await fakeRepository.create({
            name: 'Jane Doe',
            email: 'janed@gmail.com',
            password: '123456789',
        });

        const loggedUser = await fakeRepository.create({
            name: 'Log Doe',
            email: 'logd@gmail.com',
            password: '123456789',
        });

        const providers = await listProvidersService.execute({
            userId: loggedUser.id,
        });

        expect(providers).toEqual([user1, user2]);
    });
});
