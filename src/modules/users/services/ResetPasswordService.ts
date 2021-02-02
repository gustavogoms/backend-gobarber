import AppError from '@shared/errors/AppError';
import {isAfter, addHours} from 'date-fns';
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokenRepository from '../repositories/IUsersTokenRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import { compare } from 'bcryptjs';

interface IRequest {

    password: string;
    token: string;

}

@injectable()
class ResetPasswordService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('UsersTokenRepository')
        private userTokensRepository: IUserTokenRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({token, password }: IRequest): Promise<void> {
        const userToken = await this.userTokensRepository.findByToken(token);

        if(!userToken) {

            throw new AppError('User token does not exists');
        }

        const user = await this.usersRepository.findById(userToken.user_id);

        if(!user) {
            throw new AppError('User does not exists');
        }

        const tokenCreatedAt = userToken.created_at;
        const compareDate = addHours(tokenCreatedAt, 2);

        if(isAfter(Date.now(), compareDate)) {
            throw new AppError('Token Expired');
        }


        user.password = await this.hashProvider.generateHash(password);

        await this.usersRepository.save(user);

        }
}

export default ResetPasswordService;
