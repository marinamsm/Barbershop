import { uuid } from 'uuidv4';
import {
    isEqual,
    getYear,
    getMonth,
    getDate,
    getHours,
    isBefore,
} from 'date-fns';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IMonthAvailabilityByProviderDTO from '@modules/appointments/dtos/IMonthAvailabilityByProviderDTO';
import IDayAvailabilityByProviderDTO from '@modules/appointments/dtos/IDayAvailabilityByProviderDTO';
import AppError from '@shared/errors/AppError';

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
        userId,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        const currentDate = new Date(Date.now());

        if (isBefore(date, currentDate)) {
            throw new AppError(
                `Invalid Date. Date: ${date} CurrentDate: ${currentDate}`,
            );
        }

        if (userId === providerId) {
            throw new AppError("Can't make an appointment with yourself.");
        }

        if (getHours(date) < 8 || getHours(date) > 17) {
            throw new AppError(
                "Can't make an appointment before 8am or after 5pm.",
            );
        }

        Object.assign(appointment, { id: uuid(), date, providerId, userId });

        this.appointments.push(appointment);

        return appointment;
    }

    public async find(): Promise<Appointment[]> {
        return this.appointments;
    }

    public async findMonthAvailabilityByProvider({
        providerId,
        month,
        year,
    }: IMonthAvailabilityByProviderDTO): Promise<Appointment[]> {
        const appointments = this.appointments.filter(
            appointment =>
                appointment.providerId === providerId &&
                getMonth(appointment.date) + 1 === month &&
                getYear(appointment.date) === year,
        );

        return appointments;
    }

    public async findDayAvailabilityByProvider({
        providerId,
        month,
        year,
        date,
    }: IDayAvailabilityByProviderDTO): Promise<Appointment[]> {
        const appointments = this.appointments.filter(
            appointment =>
                appointment.providerId === providerId &&
                getMonth(appointment.date) + 1 === month &&
                getYear(appointment.date) === year &&
                getDate(appointment.date) === date,
        );

        return appointments;
    }
}

export default AppointmentsRepository;
