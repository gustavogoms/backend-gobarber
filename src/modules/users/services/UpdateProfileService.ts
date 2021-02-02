import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';

interface Request {
    // eslint-disable-next-line camelcase
    user_id: string;
    name: string;
    email: string;
    old_password ?: string;
    password ?: string;
}
@injectable()
class UpdateProfile {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,

    ) {}

    // eslint-disable-next-line camelcase
    public async execute({ user_id, name, email, password, old_password }: Request): Promise<User> {
        const user = await this.usersRepository.findById(user_id);
        if (!user) {
            throw new AppError('User not found');
        }

        const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

        if(userWithUpdatedEmail && userWithUpdatedEmail.id != user_id) {
            throw new AppError('E-mail already in use ')
        }

        user.name = name;
        user.email = email;

        if (password && !old_password) {
            throw new AppError('You need the inform to set a new password')
        }

        if(password && old_password) {
            const checkOldPassword = await this.hashProvider.compareHash(
                old_password,
                user.password,
            );

            if (!checkOldPassword) {

                throw new AppError('old password does not match')
            }
            user.password = await this.hashProvider.generateHash(password);
        }

        return this.usersRepository.save(user);

    }
}

export default UpdateProfile;
