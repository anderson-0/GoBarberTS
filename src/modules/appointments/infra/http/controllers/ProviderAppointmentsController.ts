import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ProviderAppointmentsController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const provider_id = req.user.id;
      const { day, month, year } = req.body;

      const listProviderAppointmentsService = container.resolve(
        ListProviderAppointmentsService,
      );

      const appointments = await listProviderAppointmentsService.execute({
        provider_id,
        day,
        month,
        year,
      });

      return res.json(appointments);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}
