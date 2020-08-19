import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';
import ProviderMonthAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderDayAvailabilityController';
import authenticate from '@modules/users/infra/http/middlewares/authentication';

const providersRouter = Router();

providersRouter.use(authenticate);

const providersCtrl = new ProvidersController();
const dayAvailabilityCtrl = new ProviderDayAvailabilityController();
const monthAvailabilityCtrl = new ProviderMonthAvailabilityController();

providersRouter.get('/', providersCtrl.index);
providersRouter.get(
    '/:id/day-availability',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
    }),
    dayAvailabilityCtrl.index,
);
providersRouter.get(
    '/:id/month-availability',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
    }),
    monthAvailabilityCtrl.index,
);

export default providersRouter;
