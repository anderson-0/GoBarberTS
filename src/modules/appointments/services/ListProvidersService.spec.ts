import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;

describe('ListProvidersService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProvidersService = new ListProvidersService(fakeUsersRepository);
  });
  describe('SHOULD be able to', () => {
    it('update user profile information', async () => {
      const user1 = await fakeUsersRepository.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123123',
      });

      const user2 = await fakeUsersRepository.create({
        name: 'John Tree',
        email: 'johntree@example.com',
        password: '123123',
      });

      const loggedUser = await fakeUsersRepository.create({
        name: 'John Qua',
        email: 'johnqua@example.com',
        password: '123123',
      });

      const providers = await listProvidersService.execute({
        user_id: loggedUser.id,
      });

      expect(providers).toEqual([user1, user2]);
    });
  });
});
