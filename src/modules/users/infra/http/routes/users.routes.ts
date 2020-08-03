import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import authenticate from '@modules/users/infra/http/middlewares/authentication';
import UsersController from '@modules/users/infra/http/controllers/UsersController';
import UserAvatarController from '@modules/users/infra/http/controllers/UserAvatarController';

const usersRouter = Router();
const upload = multer(uploadConfig);
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

usersRouter.post('/', usersController.create);

usersRouter.use(authenticate);

usersRouter.patch(
    '/avatar',
    upload.single('avatar'),
    userAvatarController.update,
);

export default usersRouter;
