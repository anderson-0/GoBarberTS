/* eslint-disable no-restricted-syntax */
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviderAppointmentsService: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });
  describe('SHOULD BE ABLE TO', () => {
    it('List the appointents from a provider in a specific day', async () => {
      const app1 = await fakeAppointmentsRepository.create({
        provider_id: 'provider_id',
        customer_id: 'customer_id',
        date: new Date(2021, 4, 20, 8, 0, 0),
      });

      const app2 = await fakeAppointmentsRepository.create({
        provider_id: 'provider_id',
        customer_id: 'customer_id',
        date: new Date(2021, 4, 20, 11, 0, 0),
      });

      const availability = await listProviderAppointmentsService.execute({
        provider_id: 'provider_id',
        day: 20,
        year: 2021,
        month: 5,
      });

      expect(availability).toEqual([app1, app2]);
    });
  });
});
