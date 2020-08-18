import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';

/* eslint-disable class-methods-use-this */
export default class ProvidersController {
    async index(request: Request, response: Response): Promise<Response> {
        const { id } = request.user;

        const providerListing = container.resolve(ListProvidersService);

        const providers = await providerListing.execute({
            userId: id,
        });

        return response.json(providers);
    }
}
