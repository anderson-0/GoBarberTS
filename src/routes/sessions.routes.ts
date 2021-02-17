import AppError from '@src/errors/AppError';
import { Request, Response, Router } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserService';
const sessionsRouter = Router();

sessionsRouter.post('/', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const authenticateUserService = new AuthenticateUserService();
  const { user, token } = await authenticateUserService.execute({
    email,
    password,
  });

  // Deletes password property from object before returning it
  delete user.password;

  return res.json({ user, token });
});

export default sessionsRouter;
