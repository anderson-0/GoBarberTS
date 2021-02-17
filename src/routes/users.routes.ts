import { Request, Response, Router } from 'express';
import CreateUserService from '@src/services/CreateUserService';

const usersRouter = Router();

usersRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const createUserService = new CreateUserService();
    const user = await createUserService.execute({ name, email, password });

    return res.json(user);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export default usersRouter;
