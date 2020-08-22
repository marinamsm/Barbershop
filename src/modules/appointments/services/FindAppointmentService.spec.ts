import 'reflect-metadata';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import FindAppointmentService from '@modules/appointments/services/FindAppointmentService';
import FakeAppointmentsRepository from '@modules/appointments/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let findAppointmentService: FindAppointmentService;
let createAppointmentService: CreateAppointmentService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeRepository = new FakeAppointmentsRepository();
        fakeNotificationsRepository = new FakeNotificationsRepository();
        findAppointmentService = new FindAppointmentService(fakeRepository);
        fakeCacheProvider = new FakeCacheProvider();
        createAppointmentService = new CreateAppointmentService(
            fakeRepository,
            fakeNotificationsRepository,
            fakeCacheProvider,
        );
    });

    it('should receive an empty list of appointments', async () => {
        const appointments = await findAppointmentService.execute();

        expect(appointments).toHaveLength(0);
    });

    it('should receive a list of appointments', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 9, 0, 0).getTime();
        });
        await createAppointmentService.execute({
            providerId: '123456789',
            userId: 'hfiahoifoiaeo',
            date: new Date(2020, 4, 10, 11, 0, 0),
        });

        const appointments = await findAppointmentService.execute();

        expect(appointments).toHaveLength(1);
        expect(appointments[0].providerId).toBe('123456789');
    });
});
