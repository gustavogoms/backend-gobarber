import { Router } from 'express';
import ProvidersController from '../controllers/ProviderController';
import {celebrate, Segments, Joi} from 'celebrate';
import ProviderMonthAvaiabilityController from '../controllers/ProviderMonthAvaiabilityController';
import ProviderDayAvaiabilityController from '../controllers/ProviderDayAvaiabilityController';

import ensureAuthenticated from '../../../../users/infra/http/middlewares/ensureAuthenticated';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerMonthAvaiabilityController = new ProviderMonthAvaiabilityController();
const providerDayAvaiabilityController = new ProviderDayAvaiabilityController();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.index);
providersRouter.get('/:provider_id/month-avaiability',
celebrate({
    [Segments.PARAMS]: {
        provider_id: Joi.string().uuid().required(),
    },
}),
providerMonthAvaiabilityController.index);
providersRouter.get('/:provider_id/day-avaiability',
celebrate({
    [Segments.PARAMS]: {
        provider_id: Joi.string().uuid().required(),
    },
}), providerDayAvaiabilityController.index);



export default providersRouter;
