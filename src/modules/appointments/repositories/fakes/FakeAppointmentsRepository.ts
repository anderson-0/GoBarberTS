import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllAppointmentsFromProviderInDayDTO from '@modules/appointments/dtos/IFindAllAppointmentsFromProviderInDayDTO';
import IFindAllAppointmentsFromProviderInMonthDTO from '@modules/appointments/dtos/IFindAllAppointmentsFromProviderInMonthDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';
import { uuid } from 'uuidv4';
import IAppointmentsRepository from '../IAppointmentsRepository';

export default class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      (appointment: Appointment) => {
        return isEqual(appointment.date, date);
      },
    );

    return findAppointment;
  }

  public async findAllFromProviderInMonth({
    provider_id,
    month,
    year,
  }: IFindAllAppointmentsFromProviderInMonthDTO): Promise<Appointment[]> {
    const findAppointment = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return findAppointment;
  }

  public async findAllFromProviderInDay({
    provider_id,
    day,
    month,
    year,
  }: IFindAllAppointmentsFromProviderInDayDTO): Promise<Appointment[]> {
    const findAppointment = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return findAppointment;
  }

  public async create({
    provider_id,
    customer_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), date, provider_id, customer_id });

    this.appointments.push(appointment);

    return appointment;
  }
}
