import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProviderMonthlyAvailabilityController from '../controllers/ProviderMonthlyAvailabilityController';
import ProviderDaylyAvailabilityController from '../controllers/ProviderDailyAvailabilityController';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerMonthlyAvailabilityController = new ProviderMonthlyAvailabilityController();
const providerDailylyAvailabilityController = new ProviderDaylyAvailabilityController();
providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.create);
providersRouter.get(
  '/:provider_id/month-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerMonthlyAvailabilityController.create,
);
providersRouter.get(
  '/:provider_id/day-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerDailylyAvailabilityController.create,
);

export default providersRouter;
