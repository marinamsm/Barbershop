import 'reflect-metadata';
import ListMonthAvailability from '@modules/appointments/services/ListMonthAvailabilityService';
import FakeAppointmentsRepository from '@modules/appointments/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError';

let fakeRepository: FakeAppointmentsRepository;
let listAvailabilityService: ListMonthAvailability;

describe('List Month Availability', () => {
    beforeEach(() => {
        fakeRepository = new FakeAppointmentsRepository();
        listAvailabilityService = new ListMonthAvailability(fakeRepository);
    });
    it('should list availability for each day in the month', async () => {
        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2020, 4, 19, 11).getTime();
        });

        for (let hour = 8; hour < 18; hour++) {
            await fakeRepository.create({
                date: new Date(2020, 4, 21, hour, 0, 0),
                userId: 'any-user',
                providerId: 'any-provider',
            });
        }

        await fakeRepository.create({
            date: new Date(2020, 4, 20, 10, 0, 0),
            userId: 'any-user',
            providerId: 'any-provider',
        });

        const availabilityByDay = await listAvailabilityService.execute({
            month: 5,
            providerId: 'any-provider',
            year: 2020,
        });

        expect(availabilityByDay).toEqual(
            expect.arrayContaining([
                {
                    day: 19,
                    available: true,
                },
                {
                    day: 20,
                    available: true,
                },
                {
                    day: 21,
                    available: false,
                },
                {
                    day: 22,
                    available: true,
                },
            ]),
        );
    });
});
