import { startOfHour } from 'date-fns';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '@src/repositories/AppointmentsRepository';
import { getCustomRepository } from 'typeorm';

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
      throw Error('Schedule already taken');
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
