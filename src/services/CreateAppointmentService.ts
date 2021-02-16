import AppointmentsRepository from '@src/repositories/AppointmentsRepository';
import { startOfHour } from 'date-fns';
import Appointment from '../models/Appointment';

interface RequestDTO {
  date: Date;
  provider: string;
}

class CreateAppointmentService {
  constructor(private appointmentsRepository: AppointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }

  execute({ provider, date }: RequestDTO): Appointment {
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw Error('Schedule already taken');
    }
    const appointment = this.appointmentsRepository.create({
      provider,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
