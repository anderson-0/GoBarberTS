import { getHours, isBefore, startOfHour } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequestDTO {
  date: Date;
  provider_id: string;
  customer_id: string;
}
@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  async execute({
    provider_id,
    customer_id,
    date,
  }: IRequestDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date);
    const appointmentHour = getHours(appointmentDate);
    if (isBefore(appointmentDate.getTime(), Date.now())) {
      throw new AppError("You can't create an appointment in a past date");
    }

    if (provider_id === customer_id) {
      throw new AppError("You can't create an appointment with yourself");
    }

    if (appointmentHour < 8 || appointmentHour > 17) {
      throw new AppError(
        'You can only create appointments between 8am and 5pm',
      );
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('Schedule already taken');
    }
    const appointment = await this.appointmentsRepository.create({
      provider_id,
      customer_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
