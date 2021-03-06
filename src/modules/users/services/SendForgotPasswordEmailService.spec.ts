import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokenRepository from '../repositories/fakes/FakeUsersTokenRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeEmailProvider';


let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;


describe('SendoForgotPasswordEmail', () => {

    beforeEach(()=> {

         fakeUsersRepository = new FakeUsersRepository();
         fakeMailProvider = new FakeMailProvider();
         fakeUserTokenRepository = new FakeUserTokenRepository();

         sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUsersRepository, fakeMailProvider, fakeUserTokenRepository
        );

    });
    it('should be able to recover the password using the email ', async () => {

        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');


        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })

        await sendForgotPasswordEmail.execute({

            email: 'johndoe@example.com',

         });

         expect(sendMail).toHaveBeenCalled();

    });

    it('should not be able to recover a non-existing user password ', async () => {

        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

         expect(sendForgotPasswordEmail.execute({

            email: 'johndoe@example.com',

         }),).rejects.toBeInstanceOf(AppError);

    });

    it('should generate a forgot password token ', async () => {


        const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

       const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })

        await sendForgotPasswordEmail.execute({

            email: 'johndoe@example.com',

         });

         expect(generateToken).toHaveBeenCalledWith(user.id);

    })



});
