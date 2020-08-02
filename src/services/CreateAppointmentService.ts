import {startOfHour} from 'date-fns';
import {getCustomRepository} from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import AppError from '../errors/AppError';

interface RequestDTO {
    providerId: string;
    date: Date;
}

class CreateAppointmentService {
    public async execute({providerId, date}: RequestDTO): Promise<Appointment> {
        const appointmentRepository = getCustomRepository(AppointmentsRepository);
        const rightDate = startOfHour(date);

        const existentAppointment = await appointmentRepository.findByDate(rightDate);

        if (existentAppointment) {
            throw new AppError('Someone already made an appointment at this date and time');
        }

        const appointment = appointmentRepository.create({providerId, date: rightDate});

        await appointmentRepository.save(appointment);

        return appointment;
    }

}

export default CreateAppointmentService;
