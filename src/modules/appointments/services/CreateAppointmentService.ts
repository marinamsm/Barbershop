import { startOfHour } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppError from '@shared/errors/AppError';

interface IRequestDTO {
    providerId: string;
    userId: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    private appointmentRepository: IAppointmentsRepository;

    constructor(
        @inject('AppointmentsRepository')
        appointmentRepository: IAppointmentsRepository,
    ) {
        this.appointmentRepository = appointmentRepository;
    }

    public async execute({
        providerId,
        userId,
        date,
    }: IRequestDTO): Promise<Appointment> {
        const rightDate = startOfHour(date);

        const existentAppointment = await this.appointmentRepository.findByDate(
            rightDate,
        );

        if (existentAppointment) {
            throw new AppError(
                'Someone already made an appointment at this date and time',
            );
        }

        return this.appointmentRepository.create({
            providerId,
            userId,
            date: rightDate,
        });
    }
}

export default CreateAppointmentService;
