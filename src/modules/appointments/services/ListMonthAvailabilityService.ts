import { inject, injectable } from 'tsyringe';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { getDate, getDaysInMonth, isAfter } from 'date-fns';

interface IRequest {
    providerId: string;
    month: number;
    year: number;
}

type IResponse = Array<{
    day: number;
    available: boolean;
}>;

@injectable()
class ListMonthAvailability {
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
    }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentsRepository.findMonthAvailabilityByProvider(
            {
                providerId,
                month,
                year,
            },
        );

        const daysInMonth = getDaysInMonth(new Date(year, month - 1));

        const daysArray = Array.from(
            { length: daysInMonth },
            (_, index) => index + 1,
        );

        const availabilityMap = daysArray.map(day => {
            const appointmentsInDay = appointments.filter(
                appointment => getDate(appointment.date) === day,
            );

            const comparisonDate = new Date(year, month - 1, day, 23, 59, 59);

            return {
                day,
                available:
                    isAfter(comparisonDate, new Date()) &&
                    appointmentsInDay.length < 10,
            };
        });

        return availabilityMap;
    }
}

export default ListMonthAvailability;
