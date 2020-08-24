import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ProviderAppointmentsController from '@modules/appointments/infra/http/controllers/ProviderAppointmentsController';
import authenticate from '@modules/users/infra/http/middlewares/authentication';

const appointmentsRouter = Router();

appointmentsRouter.use(authenticate);

const appointmentsCtrl = new AppointmentsController();
const providerAppointmentsCtrl = new ProviderAppointmentsController();

appointmentsRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            providerId: Joi.string().uuid().required(),
            date: Joi.date(),
        },
    }),
    appointmentsCtrl.create,
);

appointmentsRouter.get('/', appointmentsCtrl.index);

appointmentsRouter.get(
    '/me',
    celebrate({
        [Segments.QUERY]: {
            month: Joi.number().required(),
            year: Joi.number().required(),
            date: Joi.number().required(),
        },
    }),
    providerAppointmentsCtrl.index,
);

export default appointmentsRouter;
