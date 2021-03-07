import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateUserProfileService from './UpdateUserProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateUserProfileService: UpdateUserProfileService;

describe('UpdateUserProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateUserProfileService = new UpdateUserProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  describe('SHOULD be able to', () => {
    it('update user profile information', async () => {
      const user = await fakeUsersRepository.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123123',
      });

      const updatedUser = await updateUserProfileService.execute({
        user_id: user.id,
        name: 'Jane Doe',
        email: 'janedoe@example.com',
      });

      expect(updatedUser.name).toBe('Jane Doe');
    });

    it('update the password', async () => {
      const user = await fakeUsersRepository.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123123',
      });

      const updatedUser = await updateUserProfileService.execute({
        user_id: user.id,
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        old_password: user.password,
        password: '12312',
      });

      expect(updatedUser.password).toBe('12312');
    });
  });

  describe('SHOULD NOT be able to', () => {
    it('update user profile information from a non-exiting user', async () => {
      await expect(
        updateUserProfileService.execute({
          user_id: 'non-existing-user-id',
          name: 'Jane Doe',
          email: 'janedoe@example.com',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });
    it('update email to an email already in use by another use', async () => {
      const user1 = await fakeUsersRepository.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123123',
      });

      const user2 = await fakeUsersRepository.create({
        name: 'jane Doe',
        email: 'jane@example.com',
        password: '123123',
      });

      await expect(
        updateUserProfileService.execute({
          user_id: user1.id,
          name: user2.name,
          email: user2.email,
        }),
      ).rejects.toBeInstanceOf(AppError);
    });
    it('update the password without informing the old one', async () => {
      const user = await fakeUsersRepository.create({
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        password: '123123',
      });
      await expect(
        updateUserProfileService.execute({
          user_id: user.id,
          name: 'Jane Doe',
          email: 'janedoe@example.com',
          password: '12312',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('update the password with wrong old password', async () => {
      const user = await fakeUsersRepository.create({
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        password: '123123',
      });
      await expect(
        updateUserProfileService.execute({
          user_id: user.id,
          name: 'Jane Doe',
          email: 'janedoe@example.com',
          old_password: '1111',
          password: '12312',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });
  });
});
