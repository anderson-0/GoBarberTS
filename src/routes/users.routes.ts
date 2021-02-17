import { Request, Response, Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';
import CreateUserService from '@src/services/CreateUserService';
import UpdateUserAvatarService from '@src/services/UpdateUserAvatarService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

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

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (req: Request, res: Response) => {
    try {
      const updateUserAvatar = new UpdateUserAvatarService();
      const user = await updateUserAvatar.execute({
        user_id: req.user.id,
        avatarFilename: req.file.filename,
      });

      delete user.password;

      return res.json(user);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
    return res.json({ ok: true });
  },
);

export default usersRouter;
