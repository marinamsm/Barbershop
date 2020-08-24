import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListDayAvailabilityService from '@modules/appointments/services/ListDayAvailabilityService';

/* eslint-disable class-methods-use-this */
export default class ProvidersController {
    async index(request: Request, response: Response): Promise<Response> {
        const { id: providerId } = request.params;
        const { month, year, date } = request.query;

        const dayAvailabilityService = container.resolve(
            ListDayAvailabilityService,
        );

        const providers = await dayAvailabilityService.execute({
            providerId,
            month: Number(month),
            year: Number(year),
            date: Number(date),
        });

        return response.json(providers);
    }
}
