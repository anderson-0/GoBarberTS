import User from '@src/models/User';
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
      throw Error('Email address already in use');
    }
    const user: User = usersRepository.create({
      name,
      email,
      password,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
