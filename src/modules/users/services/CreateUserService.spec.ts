import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('CreateUserService', () => {
  describe('SHOULD be able to', () => {
    it('create a new user', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeHashprovider = new FakeHashProvider();

      const createUserService = new CreateUserService(
        fakeUsersRepository,
        fakeHashprovider,
      );

      const user = await createUserService.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123123',
      });

      expect(user).toHaveProperty('id');
    });
  });

  describe('SHOULD NOT be able to', () => {
    it('create a new user with email from another', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeHashprovider = new FakeHashProvider();

      const createUserService = new CreateUserService(
        fakeUsersRepository,
        fakeHashprovider,
      );

      await createUserService.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123123',
      });

      await expect(
        createUserService.execute({
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: '123123',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });
  });
});
