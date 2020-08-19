import { startOfHour, format } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import AppError from '@shared/errors/AppError';

interface IRequestDTO {
    providerId: string;
    userId: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    private appointmentRepository: IAppointmentsRepository;

    private notificationsRepository: INotificationsRepository;

    constructor(
        @inject('AppointmentsRepository')
        appointmentRepository: IAppointmentsRepository,
        @inject('NotificationsRepository')
        notificationsRepository: INotificationsRepository,
    ) {
        this.appointmentRepository = appointmentRepository;
        this.notificationsRepository = notificationsRepository;
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

        const newAppointment = this.appointmentRepository.create({
            providerId,
            userId,
            date: rightDate,
        });

        const formattedDate = format(rightDate, "dd/MM/yyyy 'às' HH:mm'h'");

        await this.notificationsRepository.create({
            content: `Novo agendamento para ${formattedDate}`,
            recipientId: providerId,
        });

        return newAppointment;
    }
}

export default CreateAppointmentService;
