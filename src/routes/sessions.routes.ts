import { Router } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserservice';

const sessionsRouter = Router();

// Para a autenticação do usuário precisamos de e-mail e senha

sessionsRouter.post('/', async (request, response) => {
    const { email, password } = request.body;

    const authenticateUser = new AuthenticateUserService();

    const { user, token } = await authenticateUser.execute({
        email,
        password,
    });

    return response.json({ user, token });
});

export default sessionsRouter;
