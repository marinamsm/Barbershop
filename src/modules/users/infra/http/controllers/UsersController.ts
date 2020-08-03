import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/CreateUserService';

/* eslint-disable class-methods-use-this */
export default class UsersController {
    async create(request: Request, response: Response): Promise<Response> {
        const { name, email, password } = request.body;

        const userCreation = container.resolve(CreateUserService);

        const newUser = await userCreation.execute({ name, email, password });

        return response.json(newUser);
    }
}
