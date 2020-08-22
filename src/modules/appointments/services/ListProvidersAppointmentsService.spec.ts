import 'reflect-metadata';
import ListProvidersAppointmentsService from '@modules/appointments/services/ListProvidersAppointmentsService';
import FakeAppointmentsRepository from '@modules/appointments/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeRepository: FakeAppointmentsRepository;
let listAppointmentsService: ListProvidersAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('List Provider Day Schedule', () => {
    beforeEach(() => {
        fakeRepository = new FakeAppointmentsRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listAppointmentsService = new ListProvidersAppointmentsService(
            fakeRepository,
            fakeCacheProvider,
        );
    });
    it("should list a provider's schedule in a date", async () => {
        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2020, 4, 19, 11).getTime();
        });

        const appointment1 = await fakeRepository.create({
            providerId: 'provider',
            userId: 'user',
            date: new Date(2020, 4, 20, 15),
        });

        const appointment2 = await fakeRepository.create({
            providerId: 'provider',
            userId: 'user',
            date: new Date(2020, 4, 20, 16),
        });

        const appointments = await listAppointmentsService.execute({
            providerId: 'provider',
            date: 20,
            month: 5,
            year: 2020,
        });

        expect(appointments).toEqual([appointment1, appointment2]);
    });
});
