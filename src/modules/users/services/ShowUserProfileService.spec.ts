import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowUserProfileService from './ShowUserProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showUserProfileService: ShowUserProfileService;

describe('ShowUserProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showUserProfileService = new ShowUserProfileService(fakeUsersRepository);
  });
  describe('SHOULD be able to', () => {
    it('update user profile information', async () => {
      const user = await fakeUsersRepository.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123123',
      });

      const foundUser = await showUserProfileService.execute({
        user_id: user.id,
      });

      expect(foundUser.name).toBe(user.name);
      expect(foundUser.email).toBe(user.email);
    });
  });

  describe('SHOULD NOT be able to', () => {
    it('show profile of not non-existing user', async () => {
      await expect(
        showUserProfileService.execute({
          user_id: 'non-existing-user-id',
        }),
      );
    });
  });
});
