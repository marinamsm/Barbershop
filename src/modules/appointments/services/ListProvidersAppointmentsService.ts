import { inject, injectable } from 'tsyringe';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IDayAvailabilityByProviderDTO from '@modules/appointments/dtos/IDayAvailabilityByProviderDTO';

@injectable()
class ListProvidersAppointmentsService {
    private appointmentRepository: IAppointmentsRepository;

    constructor(
        @inject('AppointmentsRepository')
        appointmentRepository: IAppointmentsRepository,
    ) {
        this.appointmentRepository = appointmentRepository;
    }

    public async execute({
        providerId,
        date,
        month,
        year,
    }: IDayAvailabilityByProviderDTO): Promise<Appointment[]> {
        return this.appointmentRepository.findDayAvailabilityByProvider({
            providerId,
            date,
            month,
            year,
        });
    }
}

export default ListProvidersAppointmentsService;
