import ShowUserProfileService from '@modules/users/services/ShowUserProfileService';
import UpdateUserProfileService from '@modules/users/services/UpdateUserProfileService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class ProfileController {
  public async show(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;
    const showUserProfileService = container.resolve(ShowUserProfileService);

    const user = await showUserProfileService.execute({ user_id });

    return res.json(user);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { name, email, password, old_password } = req.body;
    const updateUserProfileService = container.resolve(
      UpdateUserProfileService,
    );

    const updatedUser = await updateUserProfileService.execute({
      user_id: req.user.id,
      name,
      email,
      password,
      old_password,
    });

    return res.status(204).json(classToClass(updatedUser));
  }
}
