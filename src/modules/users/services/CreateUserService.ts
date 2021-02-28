import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import { hash } from 'bcryptjs';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  constructor(private usersRepository: IUsersRepository) {}

  public async execute({ name, email, password }: IRequestDTO): Promise<User> {
    const checkUserExists: User = await this.usersRepository.findByEmail(email);

    if (!checkUserExists) {
      throw new AppError('Email address already in use');
    }

    const hashedPassword = await hash(password, 8);

    const user: User = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUserService;
