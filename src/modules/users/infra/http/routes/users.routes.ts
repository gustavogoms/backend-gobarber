import { Router } from 'express';

import multer from 'multer';

import uploadConfig from '@config/upload';

import {celebrate, Segments, Joi} from 'celebrate';


import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

const upload = multer(uploadConfig.multer);

// eslint-disable-next-line no-shadow
usersRouter.post('/',
celebrate({
    [Segments.BODY]: {
        name: Joi.string().required(),
        email: Joi.string().email().required(),
    password: Joi.string().required(),
    },
}),
usersController.create);

// é utilizado o metodo 'patch' quando é necessário alterar uma unica informação do usuário. O put é usado quando vc quer alterar uma informaçao por completo
// eslint-disable-next-line no-shadow
usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    userAvatarController.update,
);

export default usersRouter;
