import { Router } from 'express';
import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ProviderAppointmentsController from '@modules/appointments/infra/http/controllers/ProviderAppointmentsController';
import authenticate from '@modules/users/infra/http/middlewares/authentication';

const appointmentsRouter = Router();

appointmentsRouter.use(authenticate);

const appointmentsCtrl = new AppointmentsController();
const providerAppointmentsCtrl = new ProviderAppointmentsController();

appointmentsRouter.post('/', appointmentsCtrl.create);

appointmentsRouter.get('/', appointmentsCtrl.index);

appointmentsRouter.get('/me', providerAppointmentsCtrl.index);

export default appointmentsRouter;
