import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatarService', () => {
  describe('SHOULD be able to', () => {
    it('upload an avatar image file', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeStorageProvider = new FakeStorageProvider();

      const updateUserAvatarService = new UpdateUserAvatarService(
        fakeUsersRepository,
        fakeStorageProvider,
      );

      const user = await fakeUsersRepository.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123123',
      });

      await updateUserAvatarService.execute({
        user_id: user.id,
        avatarFilename: 'avatar.jpg',
      });

      expect(user.avatar).toBe('avatar.jpg');
    });

    it('delete old avatar when uploading a new one', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeStorageProvider = new FakeStorageProvider();

      const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

      const updateUserAvatarService = new UpdateUserAvatarService(
        fakeUsersRepository,
        fakeStorageProvider,
      );

      const user = await fakeUsersRepository.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123123',
      });

      await updateUserAvatarService.execute({
        user_id: user.id,
        avatarFilename: 'avatar.jpg',
      });

      await updateUserAvatarService.execute({
        user_id: user.id,
        avatarFilename: 'avatar2.jpg',
      });

      expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
      expect(user.avatar).toBe('avatar2.jpg');
    });
  });

  describe('SHOULD NOT be able to', () => {
    it('upload an avatar image file to a non-existing user', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeStorageProvider = new FakeStorageProvider();

      const updateUserAvatarService = new UpdateUserAvatarService(
        fakeUsersRepository,
        fakeStorageProvider,
      );

      await expect(
        updateUserAvatarService.execute({
          user_id: '21212121',
          avatarFilename: 'avatar.jpg',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });
  });
});
