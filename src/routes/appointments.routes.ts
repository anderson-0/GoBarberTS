import { Request, Response, Router } from 'express';
import { parseISO } from 'date-fns';
import AppointmentsRepository from '@src/repositories/AppointmentsRepository';
import CreateAppointmentService from '@src/services/CreateAppointmentService';

const appointmentsRouter = Router();
const appointmentsRepository = new AppointmentsRepository();

appointmentsRouter.get('/', (req: Request, res: Response) => {
  const appointments = appointmentsRepository.all();
  return res.status(200).json(appointments);
});

appointmentsRouter.post('/', (req: Request, res: Response) => {
  try {
    const { provider, date } = req.body;

    const parsedDate = parseISO(date);

    const createAppointmentService = new CreateAppointmentService(
      appointmentsRepository,
    );

    const appointment = createAppointmentService.execute({
      provider,
      date: parsedDate,
    });

    return res.json(appointment);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export default appointmentsRouter;
