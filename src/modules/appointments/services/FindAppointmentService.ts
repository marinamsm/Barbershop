import { inject, injectable } from 'tsyringe';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

@injectable()
class FindAppointmentService {
    private appointmentRepository: IAppointmentsRepository;

    constructor(
        @inject('AppointmentsRepository')
        appointmentRepository: IAppointmentsRepository,
    ) {
        this.appointmentRepository = appointmentRepository;
    }

    public async execute(): Promise<Appointment[]> {
        return this.appointmentRepository.find();
    }
}

export default FindAppointmentService;
