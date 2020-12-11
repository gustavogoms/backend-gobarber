import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import Users from '../infra/typeorm/entities/User';
import authConfig from '../../../config/auth';
import AppError from '../../../shared/errors/AppError';

interface Request {
    email: string;
    password: string;
}
interface Response {
    user: Users;
    token: string;
}

class AuthenticateUserService {
    public async execute({ email, password }: Request): Promise<Response> {
        // Agora precisamos validar se o email é um email de um usuário valido

        const usersRepository = getRepository(Users);
        const user = await usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new AppError('incorrect email/password combination', 401);
        }
        const passwordMatched = await compare(password, user.password);
        // password = senha / user.password = senha criptografada
        if (!passwordMatched) {
            throw new AppError('incorrect email/password combination', 401);
        }
        const { secret, expiresIn } = authConfig.jwt;
        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });
        return {
            user,
            token,
        };
    }
}

export default AuthenticateUserService;
