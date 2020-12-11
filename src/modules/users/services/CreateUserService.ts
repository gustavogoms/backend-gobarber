import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import AppError from '@shared/errors/AppError';
import Users from '../infra/typeorm/entities/User';

interface Request {
    name: string;
    password: string;
    email: string;
}

class CreateUserService {
    public async execute({ name, password, email }: Request): Promise<Users> {
        const usersRepository = getRepository(Users);

        const checkUserExist = await usersRepository.findOne({
            where: { email },
        });

        if (checkUserExist) {
            throw new AppError('Email address already used.');
        }

        const hashedPassword = await hash(password, 8);

        const user = usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });
        await usersRepository.save(user);
        return user;
    }
}

export default CreateUserService;
