import { Router } from 'express';

import multer from 'multer';

import uploadConfig from '@config/upload';

import CreateUserService from '@modules/users/services/CreateUserService';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();

const upload = multer(uploadConfig);

// eslint-disable-next-line no-shadow
usersRouter.post('/', async (request, response) => {
    try {
        const { email, name, password } = request.body;

        const createUser = new CreateUserService();
        const user = await createUser.execute({
            name,
            password,
            email,
        });

        return response.json(user);
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

// é utilizado o metodo 'patch' quando é necessário alterar uma unica informação do usuário. O put é usado quando vc quer alterar uma informaçao por completo
// eslint-disable-next-line no-shadow
usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (request, response) => {
        const updateUserAvatar = new UpdateUserAvatarService();

        const user = await updateUserAvatar.execute({
            user_id: request.user.id,
            avatarFileName: request.file.filename,
        });

        return response.json({ user });
    },
);

export default usersRouter;