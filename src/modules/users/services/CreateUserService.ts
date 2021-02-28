import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import { hash } from 'bcryptjs';
import { getRepository } from 'typeorm';

interface RequestDTO {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: RequestDTO): Promise<User> {
    const usersRepository = getRepository(User);
    const listOfUsersWithSameEmail: User[] = await usersRepository.find({
      where: {
        email,
      },
    });

    if (listOfUsersWithSameEmail.length > 0) {
      throw new AppError('Email address already in use');
    }

    const hashedPassword = await hash(password, 8);

    const user: User = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
