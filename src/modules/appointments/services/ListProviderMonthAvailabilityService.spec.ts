/* eslint-disable no-restricted-syntax */
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailabilityService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });
  describe('SHOULD be able to', () => {
    it("list the provider's availability for any given month", async () => {
      const listOfScheduleHours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

      listOfScheduleHours.forEach(hour => {
        fakeAppointmentsRepository.create({
          provider_id: 'user_id',
          date: new Date(2020, 4, 20, hour, 0, 0),
        });
      });

      await Promise.all(listOfScheduleHours);

      await fakeAppointmentsRepository.create({
        provider_id: 'user_id',
        date: new Date(2020, 4, 21, 8, 0, 0),
      });

      const availability = await listProviderMonthAvailabilityService.execute({
        provider_id: 'user_id',
        month: 5,
        year: 2020,
      });

      expect(availability).toEqual(
        expect.arrayContaining([
          { day: 20, available: false },
          { day: 21, available: true },
        ]),
      );
    });
  });
});
