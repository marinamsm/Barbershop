import { Router } from 'express';
import CreateUserService from '../services/CreateUserService';
import authenticate from '../middlewares/authentication';
import multer from 'multer';
import uploadConfig from '../config/upload';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
    const { name, email, password } = request.body;

    const userCreation = new CreateUserService();

    const newUser = await userCreation.execute({name, email, password});

    return response.json(newUser);
});

usersRouter.use(authenticate);

usersRouter.patch('/avatar', upload.single('avatar'), async (request, response) => {
    console.log(request.file);
    const updateAvatarService = new UpdateUserAvatarService();
    const user = await updateAvatarService.execute({
        userId: request.user.id,
        avatarFilename: request.file.filename
    });
    return response.json({user});
})

export default usersRouter;
