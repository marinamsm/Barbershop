import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

/* eslint-disable class-methods-use-this */
export default class ProfileController {
    async show(request: Request, response: Response): Promise<Response> {
        const userId = request.user.id;

        const profileView = container.resolve(ShowProfileService);

        const user = await profileView.execute(userId);

        delete user.password;

        return response.json(user);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const { name, email, oldPassword, password } = request.body;
        const userId = request.user.id;

        const profileUpdate = container.resolve(UpdateProfileService);

        const user = await profileUpdate.execute({
            userId,
            name,
            email,
            oldPassword,
            password,
        });

        delete user.password;

        return response.json(user);
    }
}
