import { getDate, getDaysInMonth } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequestDTO {
  month: number;
  year: number;
  provider_id: string;
}

type IResponseDTO = {
  day: number;
  available: boolean;
};

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequestDTO): Promise<IResponseDTO[]> {
    const appointments = await this.appointmentsRepository.findAllFromProviderInMonth(
      {
        provider_id,
        month,
        year,
      },
    );

    console.log(appointments);

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));
    const listOfDaysInMonth = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    const availability = listOfDaysInMonth.map((day: number) => {
      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      return {
        day,
        available: appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
