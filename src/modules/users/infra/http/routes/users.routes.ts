import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import multer from 'multer';
import uploadConfig from '@config/upload';
import authenticate from '@modules/users/infra/http/middlewares/authentication';
import UsersController from '@modules/users/infra/http/controllers/UsersController';
import UserAvatarController from '@modules/users/infra/http/controllers/UserAvatarController';

const usersRouter = Router();
const upload = multer(uploadConfig);
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

usersRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().email().required(),
            name: Joi.string().required(),
            password: Joi.string().required(),
        },
    }),
    usersController.create,
);

usersRouter.use(authenticate);

usersRouter.patch(
    '/avatar',
    upload.single('avatar'),
    userAvatarController.update,
);

export default usersRouter;
