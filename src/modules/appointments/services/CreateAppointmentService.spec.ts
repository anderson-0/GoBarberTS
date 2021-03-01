import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('Create Appointment', () => {
  it('SHOULD be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: '121212121',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('121212121');
  });

  it('SHOULD NOT be able to create 2 appointments in the same date', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: '121212121',
    });

    expect(
      createAppointmentService.execute({
        date: new Date(),
        provider_id: '1212121221',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
