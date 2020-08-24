import { getRepository, Repository, Between } from 'typeorm';
import { startOfDay, endOfDay, getHours, isBefore } from 'date-fns';
import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IMonthAvailabilityByProviderDTO from '@modules/appointments/dtos/IMonthAvailabilityByProviderDTO';
import IDayAvailabilityByProviderDTO from '@modules/appointments/dtos/IDayAvailabilityByProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository {
    private ormRepository: Repository<Appointment>;

    constructor() {
        this.ormRepository = getRepository(Appointment);
    }

    public async findByDate(
        date: Date,
        providerId: string,
    ): Promise<Appointment | undefined> {
        const findAppointment = await this.ormRepository.findOne({
            where: {
                date,
                providerId,
            },
        });

        return findAppointment;
    }

    public async create({
        providerId,
        userId,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({
            providerId,
            userId,
            date,
        });

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

        await this.ormRepository.save(appointment);

        return appointment;
    }

    public async find(): Promise<Appointment[]> {
        return this.ormRepository.find();
    }

    public async findMonthAvailabilityByProvider({
        providerId,
        month,
        year,
    }: IMonthAvailabilityByProviderDTO): Promise<Appointment[]> {
        const appointments = await this.ormRepository.find({
            where: {
                providerId,
                date: Between(
                    startOfDay(new Date(year, month - 1, 1)),
                    endOfDay(new Date(year, month - 1, 30)),
                ),
            },
        });

        return appointments;
    }

    public async findDayAvailabilityByProvider({
        providerId,
        month,
        year,
        date,
    }: IDayAvailabilityByProviderDTO): Promise<Appointment[]> {
        const appointments = await this.ormRepository.find({
            where: {
                providerId,
                date: Between(
                    startOfDay(new Date(year, month - 1, date)),
                    endOfDay(new Date(year, month - 1, date)),
                ),
            },
            order: {
                date: 'ASC',
            },
        });

        return appointments;
    }
}

export default AppointmentsRepository;
