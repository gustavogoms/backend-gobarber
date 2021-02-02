import ShowProfileService from '@modules/users/services/ShowProfileService';
import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentRepository';

let listProviderAppointments: ListProviderAppointmentsService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointments', () => {
    beforeEach(() => {
        fakeCacheProvider = new FakeCacheProvider();
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderAppointments = new ListProviderAppointmentsService(fakeAppointmentsRepository, fakeCacheProvider)});

    it ('should be able to list the appointments on a specific day', async () => {

       const appointment1 = await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2020, 4, 20, 8, 0, 0),
        });

        const appointment2 = await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2020, 4, 20, 9, 0, 0),
        });


        const appointments = await listProviderAppointments.execute({
            provider_id: 'provider',
            day: 20,
            year: 2020,
            month: 5,
        });

        expect(appointments).toEqual([
            appointment1, appointment2,
        ])


    });
})
