import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashprovider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUserService: CreateUserService;
let authenticateUserService: AuthenticateUserService;
describe('AuthenticateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashprovider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashprovider,
      fakeCacheProvider,
    );
    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashprovider,
    );
  });
  describe('SHOULD BE ABLE TO', () => {
    it('Authenticate', async () => {
      const user = await createUserService.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123123',
      });

      const response = await authenticateUserService.execute({
        email: 'johndoe@example.com',
        password: '123123',
      });
      expect(response).toHaveProperty('token');
      expect(response.user).toEqual(user);
    });
  });

  describe('SHOULD NOT BE ABLE TO', () => {
    it('Authenticate with non-existing user', async () => {
      await expect(
        authenticateUserService.execute({
          email: 'johndoe@example.com',
          password: '123123',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('Authenticate with incorrect user', async () => {
      const user = await createUserService.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123123',
      });

      await expect(
        authenticateUserService.execute({
          email: 'johndoe@example.com',
          password: '123124 ',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });
  });
});
