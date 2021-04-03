import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ProvidersController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user.id;

      const createAppointmentService = container.resolve(ListProvidersService);

      const appointment = await createAppointmentService.execute({
        user_id,
      });

      return res.json(appointment);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}
