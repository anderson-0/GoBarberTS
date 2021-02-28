import { startOfHour } from 'date-fns';
import AppointmentsRepository from '@modules/appointments/repositories/AppointmentsRepository';
import { getCustomRepository } from 'typeorm';
import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

interface RequestDTO {
  date: Date;
  provider_id: string;
}
class CreateAppointmentService {
  async execute({ provider_id, date }: RequestDTO): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('Schedule already taken');
    }
    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });
    appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
