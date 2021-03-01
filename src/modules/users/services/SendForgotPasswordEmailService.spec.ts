import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

describe('SendForgotPasswordEmailService', () => {
  describe('SHOULD be able to', () => {
    it('recover the password using the email', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeMailProvider = new FakeMailProvider();
      const sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
        fakeUsersRepository,
        fakeMailProvider,
      );

      const sendMailSpy = jest.spyOn(fakeMailProvider, 'sendMail');

      const user = await fakeUsersRepository.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123123',
      });

      await sendForgotPasswordEmailService.execute({
        email: 'johndoe@example.com',
      });

      expect(sendMailSpy).toHaveBeenCalled();
    });
  });
});
