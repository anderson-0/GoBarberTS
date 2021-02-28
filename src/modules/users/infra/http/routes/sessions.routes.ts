import { Request, Response, Router } from 'express';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

const sessionsRouter = Router();

sessionsRouter.post('/', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const usersRepository = new UsersRepository();

  const authenticateUserService = new AuthenticateUserService(usersRepository);
  const { user, token } = await authenticateUserService.execute({
    email,
    password,
  });

  // Deletes password property from object before returning it
  delete user.password;

  return res.json({ user, token });
});

export default sessionsRouter;
