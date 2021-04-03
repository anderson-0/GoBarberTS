import { getDate, getDaysInMonth, getHours, isAfter } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequestDTO {
  day: number;
  month: number;
  year: number;
  provider_id: string;
}

type IResponseDTO = {
  hour: number;
  available: boolean;
};

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequestDTO): Promise<IResponseDTO[]> {
    const appointments = await this.appointmentsRepository.findAllFromProviderInDay(
      {
        provider_id,
        day,
        month,
        year,
      },
    );

    const hourStart = 8;
    const availableHoursInADay = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );
    const currentDate = new Date(Date.now());

    const availability = availableHoursInADay.map((hour: number) => {
      const hasAppointmentInHour = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      const appointmentDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available:
          !hasAppointmentInHour && isAfter(appointmentDate, currentDate),
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
