import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashprovider: FakeHashProvider;
let createUserService: CreateUserService;
describe('CreateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashprovider = new FakeHashProvider();

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashprovider,
    );
  });
  describe('SHOULD be able to', () => {
    it('create a new user', async () => {
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
