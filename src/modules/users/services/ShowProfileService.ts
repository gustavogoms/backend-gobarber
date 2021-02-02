import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface Request {
    // eslint-disable-next-line camelcase
    user_id: string;

}
@injectable()
class ShowProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

    ) {}

    // eslint-disable-next-line camelcase
    public async execute({ user_id }: Request): Promise<User> {
        const user = await this.usersRepository.findById(user_id);
        if (!user) {
            throw new AppError('User not found');
        }
        return user;
    }
}

export default ShowProfileService;
