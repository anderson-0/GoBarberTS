import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ProviderMonthlyAvailabilityController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { provider_id } = req.params;

      const { month, year } = req.body;

      const listProviderDayAvailability = container.resolve(
        ListProviderMonthAvailabilityService,
      );

      const appointment = await listProviderDayAvailability.execute({
        provider_id,
        month,
        year,
      });

      return res.json(appointment);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}
