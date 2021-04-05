import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointmentService: CreateAppointmentService;

describe('Create Appointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();

    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
    );
  });
  describe('SHOULD BE ABLE TO', () => {
    it('create a new appointment', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
        return new Date(2021, 5, 10, 11).getTime();
      });
      const appointment = await createAppointmentService.execute({
        date: new Date(2021, 5, 10, 13),
        customer_id: '111111111',
        provider_id: '121212121',
      });

      expect(appointment).toHaveProperty('id');
      expect(appointment.provider_id).toBe('121212121');
    });
  });

  describe('SHOULD NOT BE ABLE TO', () => {
    it('Create 2 appointments in the same date', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
        return new Date(2021, 4, 10, 9).getTime();
      });

      const appointmentDate = new Date(2021, 4, 10, 11);

      await createAppointmentService.execute({
        date: appointmentDate,
        customer_id: '111111111',
        provider_id: '121212121',
      });

      await expect(
        createAppointmentService.execute({
          date: appointmentDate,
          customer_id: '111111111',
          provider_id: '1212121221',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('Create an appointment before the current hour', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
        return new Date(2021, 5, 10, 11).getTime();
      });
      await expect(
        createAppointmentService.execute({
          date: new Date(2021, 5, 10, 10),
          customer_id: '111111111',
          provider_id: '1212121221',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('Create an appointment before 8am and after 5pm', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
        return new Date(2021, 5, 10, 11).getTime();
      });
      await expect(
        createAppointmentService.execute({
          date: new Date(2021, 5, 10, 7),
          customer_id: '111111111',
          provider_id: '1212121221',
        }),
      ).rejects.toBeInstanceOf(AppError);

      await expect(
        createAppointmentService.execute({
          date: new Date(2021, 5, 10, 18),
          customer_id: '111111111',
          provider_id: '1212121221',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('Create an appointment where customer and provider are the same person', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
        return new Date(2021, 5, 10, 11).getTime();
      });
      await expect(
        createAppointmentService.execute({
          date: new Date(2021, 5, 10, 12),
          customer_id: '111111111',
          provider_id: '111111111',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });
  });
});
