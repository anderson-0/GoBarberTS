import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;
describe('Create Appointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
  });
  describe('SHOULD BE ABLE TO', () => {
    it('create a new appointment', async () => {
      const appointment = await createAppointmentService.execute({
        date: new Date(2020, 4, 10, 13),
        customer_id: '111111111',
        provider_id: '121212121',
      });

      expect(appointment).toHaveProperty('id');
      expect(appointment.provider_id).toBe('121212121');
    });
  });

  describe('SHOULD NOT BE ABLE TO', () => {
    it('Create 2 appointments in the same date', async () => {
      const appointment = await createAppointmentService.execute({
        date: new Date(),
        customer_id: '111111111',
        provider_id: '121212121',
      });

      await expect(
        createAppointmentService.execute({
          date: new Date(),
          customer_id: '111111111',
          provider_id: '1212121221',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('Create an appointment before the current hour', async () => {
      await expect(
        createAppointmentService.execute({
          date: new Date(2020, 4, 10, 11),
          customer_id: '111111111',
          provider_id: '1212121221',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('Create an appointment before 8am and after 5pm', async () => {
      await expect(
        createAppointmentService.execute({
          date: new Date(2020, 4, 10, 7),
          customer_id: '111111111',
          provider_id: '1212121221',
        }),
      ).rejects.toBeInstanceOf(AppError);

      await expect(
        createAppointmentService.execute({
          date: new Date(2020, 4, 10, 18),
          customer_id: '111111111',
          provider_id: '1212121221',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('Create an appointment where customer and provider are the same person', async () => {
      await expect(
        createAppointmentService.execute({
          date: new Date(2020, 4, 10, 11),
          customer_id: '111111111',
          provider_id: '1212121221',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });
  });
});
