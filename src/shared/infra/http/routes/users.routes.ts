import { Request, Response, Router } from 'express';
import multer from 'multer';

import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from 'modules/users/services/UpdateUserAvatarService';
import uploadConfig from '@config/upload';
import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const createUserService = new CreateUserService();
  const user = await createUserService.execute({ name, email, password });

  return res.json(user);
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (req: Request, res: Response) => {
    const updateUserAvatar = new UpdateUserAvatarService();
    const user = await updateUserAvatar.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename,
    });

    delete user.password;

    return res.json(user);
  },
);

export default usersRouter;
