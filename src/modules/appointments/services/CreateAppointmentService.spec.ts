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
  });
  it('SHOULD be able to create a new appointment', async () => {
    const appointment = await createAppointmentService.execute({
      date: new Date(),
      customer_id: '111111111',
      provider_id: '121212121',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('121212121');
  });

  it('SHOULD NOT be able to create 2 appointments in the same date', async () => {
    const appointment = await createAppointmentService.execute({
      date: new Date(),
      customer_id: '111111111',
      provider_id: '121212121',
    });

    expect(
      createAppointmentService.execute({
        date: new Date(),
        customer_id: '111111111',
        provider_id: '1212121221',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('SHOULD NOT be able to create 2 appointments in the same date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 12).getTime();
    });
  });
});
