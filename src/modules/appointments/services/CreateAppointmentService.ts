import { startOfHour } from 'date-fns';
import Appointment from '@modules/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/dtos/ICreateAppointmentDTO';
import AppError from '../../../shared/errors/AppError';

/**
 * Recebimento das informações
 * Tratativa de erros e exceções
 * Acesso ao repositório
 */
interface IResquest {
    // eslint-disable-next-line camelcase
    provider_id: string;
    date: Date;
}

/**
 * Dependency Inversion (SOLID)
 */

class CreateAppointmentService {
    constructor(private appointmentsRepository: IAppointmentsRepository) {}

    public async execute({
        date,
        // eslint-disable-next-line camelcase
        provider_id,
    }: IResquest): Promise<Appointment> {
        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
        );

        if (findAppointmentInSameDate) {
            throw new AppError('This appointment is already booked');
        }
        const appointment = await this.appointmentsRepository.create({
            provider_id,
            date: appointmentDate,
        });

        return appointment;
    }
}

export default CreateAppointmentService;
