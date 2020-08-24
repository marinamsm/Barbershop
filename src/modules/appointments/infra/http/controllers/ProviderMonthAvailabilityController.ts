import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListMonthAvailabilityService from '@modules/appointments/services/ListMonthAvailabilityService';

/* eslint-disable class-methods-use-this */
export default class ProvidersController {
    async index(request: Request, response: Response): Promise<Response> {
        const { id: providerId } = request.params;
        const { month, year } = request.query;

        const monthAvailabilityService = container.resolve(
            ListMonthAvailabilityService,
        );

        const providers = await monthAvailabilityService.execute({
            providerId,
            month: Number(month),
            year: Number(year),
        });

        return response.json(providers);
    }
}
