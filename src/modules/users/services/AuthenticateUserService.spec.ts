import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashprovider: FakeHashProvider;
let createUserService: CreateUserService;
let authenticateUserService: AuthenticateUserService;
describe('AuthenticateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashprovider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashprovider,
    );
    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashprovider,
    );
  });
  describe('SHOULD be able to', () => {
    it('authenticate', async () => {
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

  describe('SHOULD NOT be able to', () => {
    it('authenticate with non-existing user', async () => {
      await expect(
        authenticateUserService.execute({
          email: 'johndoe@example.com',
          password: '123123',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('authenticate with incorrect user', async () => {
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
