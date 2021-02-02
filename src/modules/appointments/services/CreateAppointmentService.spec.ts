import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateAppointmentService from './CreateAppointmentService';

let fakeappointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeappointmentsRepository = new FakeAppointmentsRepository();
        fakeCacheProvider = new FakeCacheProvider();
        fakeNotificationsRepository = new FakeNotificationsRepository();

        createAppointment = new CreateAppointmentService(
            fakeappointmentsRepository,
            fakeNotificationsRepository,
            fakeCacheProvider,
        )
    })
    it('should be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        const appointment = await createAppointment.execute({
            date: new Date(2020, 4, 10, 13),
            user_id: 'user_id',
            provider_id: 'provider_id',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('provider_id');

    });


    it ('should not be able to create an appointment on a past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(createAppointment.execute({
            date: new Date(2020, 4, 10, 11),
            user_id: 'user_id',
            provider_id: 'provider_id',
        }),
        ).rejects.toBeInstanceOf(AppError);

    });

    it ('should not be able to create an appointment with same user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(createAppointment.execute({
            date: new Date(2020, 4, 10, 13),
            user_id: 'user_id',
            provider_id: 'user_id',
        }),
        ).rejects.toBeInstanceOf(AppError);

    });

    it ('should not be able to create an appointment before 8am and after', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(createAppointment.execute({
            date: new Date(2020, 4, 11, 7),
            user_id: 'user_id',
            provider_id: 'provider_id',
        }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(createAppointment.execute({
            date: new Date(2020, 4, 11, 18),
            user_id: 'user_id',
            provider_id: 'provider_id',
        }),
        ).rejects.toBeInstanceOf(AppError);

    });
});