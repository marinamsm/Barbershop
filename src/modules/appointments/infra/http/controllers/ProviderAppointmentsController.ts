import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProvidersAppointmentsService from '@modules/appointments/services/ListProvidersAppointmentsService';

/* eslint-disable class-methods-use-this */
export default class ProviderAppointmentsController {
    async index(request: Request, response: Response): Promise<Response> {
        const { id: providerId } = request.user;
        const { month, year, date } = request.body;

        const providerAppointmentsService = container.resolve(
            ListProvidersAppointmentsService,
        );

        const appointments = await providerAppointmentsService.execute({
            providerId,
            month,
            year,
            date,
        });

        return response.json(appointments);
    }
}
