import { Request, Response, Router } from 'express';
import { parseISO } from 'date-fns';
import AppointmentsRepository from '@modules/appointments/repositories/AppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import { getCustomRepository } from 'typeorm';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', async (req: Request, res: Response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const appointments = await appointmentsRepository.find();
  return res.status(200).json(appointments);
});

appointmentsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { provider_id, date } = req.body;

    const parsedDate = parseISO(date);

    const createAppointmentService = new CreateAppointmentService();

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
