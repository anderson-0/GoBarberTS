import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;
let sendMailSpy: any;
let generateTokenSPy: any;

describe('SendForgotPasswordEmailService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
    sendMailSpy = jest.spyOn(fakeMailProvider, 'sendMail');
    generateTokenSPy = jest.spyOn(fakeUserTokensRepository, 'generate');
  });
  describe('SHOULD BE ABLE TO', () => {
    it('Recover the password using the email', async () => {
      const user = await fakeUsersRepository.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123123',
      });

      await sendForgotPasswordEmailService.execute({
        email: user.email,
      });

      expect(sendMailSpy).toHaveBeenCalled();
    });

    it('Generate a forgot password token', async () => {
      const user = await fakeUsersRepository.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123123',
      });

      await sendForgotPasswordEmailService.execute({
        email: user.email,
      });

      expect(generateTokenSPy).toHaveBeenLastCalledWith(user.id);
    });
  });
  describe('SHOULD NOT BE ABLE TO', () => {
    it('Recover the password from a non-existing user', async () => {
      await expect(
        sendForgotPasswordEmailService.execute({
          email: 'johndoe@example.com',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });
  });
});
