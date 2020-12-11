import { Router } from 'express';
import { parseISO } from 'date-fns';
import AppointmentsRepository from '@modules/infra/typeorm/repositories/AppointmentsRepository';
import CreateAppointmentService from '../../../appointments/services/CreateAppointmentService';
import ensureAuthenticated from '../../../users/infra/http/middlewares/ensureAuthenticated';

const appointmentsRouter = Router();
const appointmentRepository = new AppointmentsRepository();

appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get('/', async (request, response) => {
//  const appointments = await appointmentsRepository.find();

// return response.json(appointments);
// });

appointmentsRouter.post('/', async (request, response) => {
    // eslint-disable-next-line camelcase
    const { provider_id, date } = request.body;

    const parsedDate = parseISO(date);

    const createAppointment = new CreateAppointmentService(
        appointmentRepository,
    );
    const appointment = await createAppointment.execute({
        date: parsedDate,
        provider_id,
    });

    return response.json(appointment);
});

export default appointmentsRouter;
