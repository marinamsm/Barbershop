import 'reflect-metadata';
import ListDayAvailability from '@modules/appointments/services/ListDayAvailabilityService';
import FakeAppointmentsRepository from '@modules/appointments/fakes/FakeAppointmentsRepository';

let fakeRepository: FakeAppointmentsRepository;
let listAvailabilityService: ListDayAvailability;

describe('List Day Availability', () => {
    beforeEach(() => {
        fakeRepository = new FakeAppointmentsRepository();
        listAvailabilityService = new ListDayAvailability(fakeRepository);
    });
    it('should list availability for each hour in a day', async () => {
        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2020, 4, 19, 11).getTime();
        });

        await fakeRepository.create({
            date: new Date(2020, 4, 20, 14, 0, 0),
            userId: 'any-user',
            providerId: 'any-provider',
        });

        await fakeRepository.create({
            date: new Date(2020, 4, 20, 15, 0, 0),
            userId: 'any-user',
            providerId: 'any-provider',
        });

        const availabilityInDay = await listAvailabilityService.execute({
            providerId: 'any-provider',
            month: 5,
            year: 2020,
            date: 20,
        });

        expect(availabilityInDay).toEqual(
            expect.arrayContaining([
                {
                    hour: '13h',
                    available: true,
                },
                {
                    hour: '14h',
                    available: false,
                },
                {
                    hour: '15h',
                    available: false,
                },
                {
                    hour: '16h',
                    available: true,
                },
            ]),
        );
    });
});
