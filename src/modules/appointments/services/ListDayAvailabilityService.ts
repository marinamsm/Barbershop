import { inject, injectable } from 'tsyringe';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { getHours, isAfter } from 'date-fns';

interface IRequest {
    providerId: string;
    month: number;
    year: number;
    date: number;
}

type IResponse = Array<{
    hour: number;
    available: boolean;
}>;

@injectable()
class ListDayAvailability {
    private appointmentsRepository: IAppointmentsRepository;

    constructor(
        @inject('AppointmentsRepository')
        appointmentsRepository: IAppointmentsRepository,
    ) {
        this.appointmentsRepository = appointmentsRepository;
    }

    public async execute({
        providerId,
        month,
        year,
        date,
    }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentsRepository.findDayAvailabilityByProvider(
            {
                providerId,
                month,
                year,
                date,
            },
        );

        const hourStart = 8;

        const hoursArray = Array.from(
            { length: 10 },
            (_, index) => hourStart + index,
        );

        const currentDate = new Date(Date.now());

        const availabilityMap = hoursArray.map(hour => {
            const appointmentsInHour = appointments.find(
                appointment => getHours(appointment.date) === hour,
            );

            const desiredDate = new Date(year, month - 1, date, hour);

            return {
                hour,
                available:
                    !appointmentsInHour && isAfter(desiredDate, currentDate),
            };
        });

        return availabilityMap;
    }
}

export default ListDayAvailability;
