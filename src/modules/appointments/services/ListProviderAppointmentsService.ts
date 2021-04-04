import { inject, injectable } from 'tsyringe';
import Appointment from '../infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequestDTO {
  day: number;
  month: number;
  year: number;
  provider_id: string;
}

@injectable()
export default class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequestDTO): Promise<Appointment[]> {
    const appointments = await this.appointmentsRepository.findAllFromProviderInDay(
      {
        provider_id,
        day,
        month,
        year,
      },
    );

    return appointments;
  }
}
