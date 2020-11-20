import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentsReposiroty from '../repositories/AppointmentsRepository';
import AppError from '../errors/AppError';

/**
 * Recebimento das informações
 * Tratativa de erros e exceções
 * Acesso ao repositório
 */
interface Resquest {
    // eslint-disable-next-line camelcase
    provider_id: string;
    date: Date;
}

/**
 * Dependency Inversion (SOLID)
 */

class CreateAppointmentService {
    public async execute({
        date,
        // eslint-disable-next-line camelcase
        provider_id,
    }: Resquest): Promise<Appointment> {
        const appointmentsRepository = getCustomRepository(
            AppointmentsReposiroty,
        );
        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = appointmentsRepository.findByDate(
            appointmentDate,
        );

        if (findAppointmentInSameDate) {
            throw new AppError('This appointment is already booked');
        }
        const appointment = appointmentsRepository.create({
            provider_id,
            date: appointmentDate,
        });

        await appointmentsRepository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentService;
