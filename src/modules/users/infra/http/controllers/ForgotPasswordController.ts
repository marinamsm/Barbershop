import { Request, Response } from 'express';
import { container } from 'tsyringe';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';

/* eslint-disable class-methods-use-this */
export default class ForgotPasswordController {
    async create(request: Request, response: Response): Promise<Response> {
        const { email } = request.body;

        const sendEmail = container.resolve(SendForgotPasswordEmailService);

        await sendEmail.execute({ email });

        return response.status(204).send();
    }
}
