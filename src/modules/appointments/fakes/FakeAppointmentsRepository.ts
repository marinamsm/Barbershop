import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

class AppointmentsRepository implements IAppointmentsRepository {
    private appointments: Appointment[];

    constructor() {
        this.appointments = [];
    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const appointmentFound = this.appointments.find(appointment =>
            isEqual(appointment.date, date),
        );

        return appointmentFound;
    }

    public async create({
        providerId,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        Object.assign(appointment, { id: uuid(), date, providerId });

        this.appointments.push(appointment);

        return appointment;
    }

    public async find(): Promise<Appointment[]> {
        return this.appointments;
    }
}

export default AppointmentsRepository;
