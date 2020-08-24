import { startOfHour, format, getYear, getMonth, getDate } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import getDatePattern from '@shared/container/utils/getDatePattern';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
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

    private cacheProvider: ICacheProvider;

    constructor(
        @inject('AppointmentsRepository')
        appointmentRepository: IAppointmentsRepository,
        @inject('NotificationsRepository')
        notificationsRepository: INotificationsRepository,
        @inject('CacheProvider')
        cacheProvider: ICacheProvider,
    ) {
        this.appointmentRepository = appointmentRepository;
        this.notificationsRepository = notificationsRepository;
        this.cacheProvider = cacheProvider;
    }

    public async execute({
        providerId,
        userId,
        date,
    }: IRequestDTO): Promise<Appointment> {
        const rightDate = startOfHour(date);

        const existentAppointment = await this.appointmentRepository.findByDate(
            rightDate,
            providerId,
        );

        if (existentAppointment) {
            throw new AppError(
                'Someone already made an appointment at this date and time',
            );
        }

        const newAppointment = await this.appointmentRepository.create({
            providerId,
            userId,
            date: rightDate,
        });

        const formattedDate = format(rightDate, "dd/MM/yyyy 'às' HH:mm'h'");

        await this.notificationsRepository.create({
            content: `Novo agendamento para ${formattedDate}`,
            recipientId: providerId,
        });

        const { year, month, day } = getDatePattern(rightDate);

        const indexKey = `provider-appointments:${providerId}:${year}:${month}:${day}`;

        await this.cacheProvider.invalidate(indexKey);

        return newAppointment;
    }
}

export default CreateAppointmentService;
