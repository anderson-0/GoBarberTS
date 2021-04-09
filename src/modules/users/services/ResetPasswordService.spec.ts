import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();
    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });
  describe('SHOULD BE ABLE TO', () => {
    it('Reset the password for a valid token', async () => {
      const user = await fakeUsersRepository.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123123',
      });

      const { token } = await fakeUserTokensRepository.generate(user.id);

      const generateHashSpy = jest.spyOn(fakeHashProvider, 'generateHash');

      const newPassword = '1231234';
      await resetPasswordService.execute({
        token,
        password: newPassword,
      });

      const updatedUser = await fakeUsersRepository.findById(user.id);

      expect(generateHashSpy).toHaveBeenCalledWith(newPassword);
      expect(updatedUser.password).toBe(newPassword);
    });
  });

  describe('SHOULD NOT BE ABLE TO', () => {
    it('Reset the password for a non-existing token', async () => {
      await expect(
        resetPasswordService.execute({
          token: 'sdsadasdsa',
          password: 'dsadsadas',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('Reset the password for non-existing user', async () => {
      const { token } = await fakeUserTokensRepository.generate(
        'non-existing-user-id',
      );

      await expect(
        resetPasswordService.execute({
          token,
          password: 'dsadsadas',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('Reset the password after expiration time is over (2h)', async () => {
      const { token } = await fakeUserTokensRepository.generate(
        'non-existing-user-id',
      );

      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
        const customDate = new Date();
        return customDate.setHours(customDate.getHours() + 2);
      });

      await expect(
        resetPasswordService.execute({
          token,
          password: 'dsadsadas',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });
  });
});
