import { inject, injectable } from 'tsyringe';
import { startOfHour } from 'date-fns';
import getDatePattern from '@shared/container/utils/getDatePattern';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IDayAvailabilityByProviderDTO from '@modules/appointments/dtos/IDayAvailabilityByProviderDTO';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

@injectable()
class ListProvidersAppointmentsService {
    private appointmentRepository: IAppointmentsRepository;

    private cacheProvider: ICacheProvider;

    constructor(
        @inject('AppointmentsRepository')
        appointmentRepository: IAppointmentsRepository,
        @inject('CacheProvider')
        cacheProvider: ICacheProvider,
    ) {
        this.appointmentRepository = appointmentRepository;
        this.cacheProvider = cacheProvider;
    }

    public async execute({
        providerId,
        date,
        month,
        year,
    }: IDayAvailabilityByProviderDTO): Promise<Appointment[]> {
        const fullDate = new Date(year, month - 1, date);
        const rightDate = startOfHour(fullDate);
        const { year: yearPattern, month: monthPattern, day } = getDatePattern(
            rightDate,
        );
        const indexKey = `provider-appointments:${providerId}:${yearPattern}:${monthPattern}:${day}`;

        const cachedAppointments = await this.cacheProvider.recover<
            Appointment[]
        >(indexKey);

        let appointments = cachedAppointments;

        if (!appointments) {
            console.log('------QUERY-------');
            appointments = await this.appointmentRepository.findDayAvailabilityByProvider(
                {
                    providerId,
                    date,
                    month,
                    year,
                },
            );

            await this.cacheProvider.save(indexKey, appointments);
        }

        return appointments;
    }
}

export default ListProvidersAppointmentsService;
