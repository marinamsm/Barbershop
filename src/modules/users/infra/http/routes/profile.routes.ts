import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import authenticate from '@modules/users/infra/http/middlewares/authentication';
import ProfileController from '@modules/users/infra/http/controllers/ProfileController';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(authenticate);

profileRouter.get('/', profileController.show);
profileRouter.put(
    '/',
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().email().required(),
            name: Joi.string().required(),
            oldPassword: Joi.string(),
            password: Joi.string(),
            passwordConfirmation: Joi.string()
                .required()
                .valid(Joi.ref('password')),
        },
    }),
    profileController.update,
);

export default profileRouter;
