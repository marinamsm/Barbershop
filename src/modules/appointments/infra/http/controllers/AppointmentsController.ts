import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import FindAppointmentService from '@modules/appointments/services/FindAppointmentService';

/* eslint-disable class-methods-use-this */
export default class AppointmentsController {
    async create(request: Request, response: Response): Promise<Response> {
        const { providerId, date } = request.body;

        const parsedDate = parseISO(date);

        const appointmentCreation = container.resolve(CreateAppointmentService);

        const newAppointment = await appointmentCreation.execute({
            providerId,
            date: parsedDate,
        });

        return response.json(newAppointment);
    }

    async index(request: Request, response: Response): Promise<Response> {
        const appointmentFind = container.resolve(FindAppointmentService);

        const appointments = await appointmentFind.execute();

        return response.json(appointments);
    }
}
