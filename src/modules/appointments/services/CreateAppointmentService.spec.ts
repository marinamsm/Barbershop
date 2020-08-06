import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import FindAppointmentService from '@modules/appointments/services/FindAppointmentService';
import FakeAppointmentsRepository from '@modules/appointments/fakes/FakeAppointmentsRepository';

describe('CreateAppointment', () => {
    it('should create a new appointment', async () => {
        const fakeRepository = new FakeAppointmentsRepository();
        const createAppointmentService = new CreateAppointmentService(
            fakeRepository,
        );

        const newAppointment = await createAppointmentService.execute({
            providerId: '123456789',
            date: new Date(),
        });

        expect(newAppointment).toHaveProperty('id');
        expect(newAppointment.providerId).toBe('123456789');
    });

    it("shouldn't create another appointment at the same date-time", async () => {
        const fakeRepository = new FakeAppointmentsRepository();
        const createAppointmentService = new CreateAppointmentService(
            fakeRepository,
        );

        const today = new Date();

        await createAppointmentService.execute({
            providerId: '123456789',
            date: today,
        });

        expect(
            createAppointmentService.execute({
                providerId: '987654321',
                date: today,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should receive an empty list of appointments', async () => {
        const fakeRepository = new FakeAppointmentsRepository();
        const findAppointmentService = new FindAppointmentService(
            fakeRepository,
        );

        const appointments = await findAppointmentService.execute();

        expect(appointments).toHaveLength(0);
    });

    it('should receive a list of appointments', async () => {
        const fakeRepository = new FakeAppointmentsRepository();
        const findAppointmentService = new FindAppointmentService(
            fakeRepository,
        );
        const createAppointmentService = new CreateAppointmentService(
            fakeRepository,
        );

        await createAppointmentService.execute({
            providerId: '123456789',
            date: new Date(),
        });

        const appointments = await findAppointmentService.execute();

        expect(appointments).toHaveLength(1);
        expect(appointments[0].providerId).toBe('123456789');
    });
});
