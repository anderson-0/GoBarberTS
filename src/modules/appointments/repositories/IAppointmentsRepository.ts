import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllAppointmentsFromProviderInMonthDTO from '@modules/appointments/dtos/IFindAllAppointmentsFromProviderInMonthDTO';
import IFindAllAppointmentsFromProviderInDayDTO from '../dtos/IFindAllAppointmentsFromProviderInDayDTO';

interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findAllFromProviderInMonth(
    data: IFindAllAppointmentsFromProviderInMonthDTO,
  ): Promise<Appointment[]>;
  findAllFromProviderInDay(
    data: IFindAllAppointmentsFromProviderInDayDTO,
  ): Promise<Appointment[]>;
}

export default IAppointmentsRepository;
