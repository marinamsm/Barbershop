import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import FakeAppointmentsRepository from '@modules/appointments/fakes/FakeAppointmentsRepository';

let fakeRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeRepository = new FakeAppointmentsRepository();
        createAppointmentService = new CreateAppointmentService(fakeRepository);
    });

    it('should create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 10, 0, 0).getTime();
        });
        const newAppointment = await createAppointmentService.execute({
            providerId: '123456789',
            userId: 'hfiahoifoiaeo',
            date: new Date(2020, 4, 10, 11, 0, 0),
        });

        expect(newAppointment).toHaveProperty('id');
        expect(newAppointment.providerId).toBe('123456789');
    });

    it("shouldn't create another appointment at the same date-time", async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 10, 0, 0).getTime();
        });
        const date = new Date(2020, 4, 10, 11, 0, 0);

        await createAppointmentService.execute({
            providerId: '123456789',
            userId: 'hfiahoifoiaeo',
            date,
        });

        await expect(
            createAppointmentService.execute({
                providerId: '987654321',
                userId: 'hfiahoifoiaeo',
                date,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it("shouldn't not create an appointment in past time", async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() =>
            new Date(2020, 4, 10, 11, 0, 0).getTime(),
        );
        await expect(
            createAppointmentService.execute({
                providerId: '123456789',
                userId: 'hfiahoifoiaeo',
                date: new Date(2020, 4, 10, 10, 0, 0),
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it("shouldn't not create an appointment with yourself", async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() =>
            new Date(2020, 4, 10, 10, 0, 0).getTime(),
        );

        await expect(
            createAppointmentService.execute({
                providerId: '123456789',
                userId: '123456789',
                date: new Date(2020, 4, 10, 11, 0, 0),
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it("shouldn't not create an appointment before 8am or after 5pm", async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() =>
            new Date(2020, 4, 10, 9, 0, 0).getTime(),
        );

        await expect(
            createAppointmentService.execute({
                providerId: '123456789',
                userId: 'user-id',
                date: new Date(2020, 4, 11, 7, 0, 0),
            }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointmentService.execute({
                providerId: '123456789',
                userId: 'user-id',
                date: new Date(2020, 4, 11, 18, 0, 0),
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
