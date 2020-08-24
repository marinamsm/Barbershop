import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IMonthAvailabilityByProviderDTO from '@modules/appointments/dtos/IMonthAvailabilityByProviderDTO';
import IDayAvailabilityByProviderDTO from '@modules/appointments/dtos/IDayAvailabilityByProviderDTO';

export default interface IAppointmentsRepository {
    create(data: ICreateAppointmentDTO): Promise<Appointment>;
    find(): Promise<Appointment[]>;
    findByDate(
        date: Date,
        providerId: string,
    ): Promise<Appointment | undefined>;
    findMonthAvailabilityByProvider(
        data: IMonthAvailabilityByProviderDTO,
    ): Promise<Appointment[]>;
    findDayAvailabilityByProvider(
        data: IDayAvailabilityByProviderDTO,
    ): Promise<Appointment[]>;
}
