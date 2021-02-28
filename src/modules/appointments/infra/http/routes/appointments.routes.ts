import { Request, Response, Router } from 'express';
import { parseISO } from 'date-fns';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get('/', async (req: Request, res: Response) => {
//   const appointments = await appointmentsRepository.find();
//   return res.status(200).json(appointments);
// });

appointmentsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { provider_id, date } = req.body;

    const parsedDate = parseISO(date);
    const appointmentsRepository = new AppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      appointmentsRepository,
    );

    const appointment = await createAppointmentService.execute({
      date: parsedDate,
      provider_id,
    });

    return res.json(appointment);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export default appointmentsRouter;
