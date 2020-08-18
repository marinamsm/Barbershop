import 'reflect-metadata';
import ListProvidersAppointmentsService from '@modules/appointments/services/ListProvidersAppointmentsService';
import FakeAppointmentsRepository from '@modules/appointments/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError';

let fakeRepository: FakeAppointmentsRepository;
let listAppointmentsService: ListProvidersAppointmentsService;

describe('List Provider Day Schedule', () => {
    beforeEach(() => {
        fakeRepository = new FakeAppointmentsRepository();
        listAppointmentsService = new ListProvidersAppointmentsService(
            fakeRepository,
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
