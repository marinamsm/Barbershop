import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

/* eslint-disable class-methods-use-this */
export default class UserAvatarController {
    async update(request: Request, response: Response): Promise<Response> {
        // console.log(request.file);
        const updateAvatarService = container.resolve(UpdateUserAvatarService);
        const user = await updateAvatarService.execute({
            userId: request.user.id,
            avatarFilename: request.file.filename,
        });
        return response.json({ user });
    }
}
