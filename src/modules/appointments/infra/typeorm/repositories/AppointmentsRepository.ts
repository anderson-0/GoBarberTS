import { getRepository, Raw, Repository } from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllAppointmentsFromProviderInMonthDTO from '@modules/appointments/dtos/IFindAllAppointmentsFromProviderInMonthDTO';
import IFindAllAppointmentsFromProviderInDayDTO from '@modules/appointments/dtos/IFindAllAppointmentsFromProviderInDayDTO';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  async create({
    date,
    provider_id,
    customer_id,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      date,
      provider_id,
      customer_id,
    });
    await this.ormRepository.save(appointment);

    return appointment;
  }

  public async findAllFromProviderInMonth({
    provider_id,
    month,
    year,
  }: IFindAllAppointmentsFromProviderInMonthDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    });

    return appointments;
  }

  public async findAllFromProviderInDay({
    provider_id,
    day,
    month,
    year,
  }: IFindAllAppointmentsFromProviderInDayDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const findAppointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName},'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
    });

    return findAppointments;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: {
        date,
      },
    });
    return findAppointment || undefined;
  }
}
export default AppointmentsRepository;
