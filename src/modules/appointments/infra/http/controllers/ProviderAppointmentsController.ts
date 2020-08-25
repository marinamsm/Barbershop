import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProvidersAppointmentsService from '@modules/appointments/services/ListProvidersAppointmentsService';
import { classToClass } from 'class-transformer';

/* eslint-disable class-methods-use-this */
export default class ProviderAppointmentsController {
    async index(request: Request, response: Response): Promise<Response> {
        const { id: providerId } = request.user;
        const { month, year, date } = request.query;

        const providerAppointmentsService = container.resolve(
            ListProvidersAppointmentsService,
        );

        const appointments = await providerAppointmentsService.execute({
            providerId,
            month: Number(month),
            year: Number(year),
            date: Number(date),
        });

        return response.json(classToClass(appointments));
    }
}
