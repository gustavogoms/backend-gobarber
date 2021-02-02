import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import Users from '../infra/typeorm/entities/User';
import authConfig from '../../../config/auth';
import AppError from '../../../shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';


interface Request {
    email: string;
    password: string;
}
interface Response {
    user: Users;
    token: string;
}
@injectable()
class AuthenticateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ email, password }: Request): Promise<Response> {
        // Agora precisamos validar se o email é um email de um usuário valido

        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            throw new AppError('incorrect email/password combination', 401);
        }
        const passwordMatched = await this.hashProvider.compareHash(password, user.password);
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
