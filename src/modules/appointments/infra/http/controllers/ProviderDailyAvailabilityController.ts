import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ProviderDaylyAvailabilityController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { provider_id } = req.params;
      const { day, month, year } = req.body;

      const listProviderDayAvailability = container.resolve(
        ListProviderDayAvailabilityService,
      );

      const appointment = await listProviderDayAvailability.execute({
        provider_id,
        day,
        month,
        year,
      });

      return res.json(appointment);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}
