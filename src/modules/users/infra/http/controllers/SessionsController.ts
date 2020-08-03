import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateSessionService from '@modules/users/services/CreateSessionService';

/* eslint-disable class-methods-use-this */
export default class SessionsController {
    async create(request: Request, response: Response): Promise<Response> {
        const { email, password } = request.body;

        const userSession = container.resolve(CreateSessionService);

        const { user, token } = await userSession.execute({ email, password });

        return response.json({ user, token });
    }
}
