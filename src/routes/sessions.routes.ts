import { Router } from 'express';
import CreateSessionService from '../services/CreateSessionService';

const usersRouter = Router();

usersRouter.post('/', async (request, response) => {
    const { email, password } = request.body;

    const userSession = new CreateSessionService();

    const {user, token} = await userSession.execute({email, password});

    return response.json({user, token});
});

export default usersRouter;
