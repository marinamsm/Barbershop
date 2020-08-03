import { Router } from 'express';
import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import authenticate from '@modules/users/infra/http/middlewares/authentication';

const appointmentsRouter = Router();

appointmentsRouter.use(authenticate);

const appointmentsCtrl = new AppointmentsController();

appointmentsRouter.post('/', appointmentsCtrl.create);

appointmentsRouter.get('/', appointmentsCtrl.index);

export default appointmentsRouter;
