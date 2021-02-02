import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../../users/providers/HashProvider/fakes/FakeHashProvider'
import AuthenticateUserService from './AuthenticateUserservice';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
    it('should be able to authenticate', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository, fakeHashProvider
        );

        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })

        const response = await authenticateUser.execute({
           email: 'johndoe@example.com',
            password: '123456'
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual('token');


    });
    it('should not be able to authenticate with non existing user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository, fakeHashProvider
        );



        expect(authenticateUser.execute({
            email: 'johndoe@example.com',
             password: '123456'
         })).rejects.toBeInstanceOf(AppError);


    });

    it('should not be able to authenticate with wrong password', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository, fakeHashProvider
        );

        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })


        expect(authenticateUser.execute({
            email: 'johndoe@example.com',
             password: 'wrong-password'
         })).rejects.toBeInstanceOf(AppError);


    });




});
