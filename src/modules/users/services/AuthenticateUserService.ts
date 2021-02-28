import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  email: string;
  password: string;
}

interface IResponseDTO {
  user: User;
  token: string;
}

class AuthenticateUserService {
  constructor(private usersRepository: IUsersRepository) {}

  public async execute({
    email,
    password,
  }: IRequestDTO): Promise<IResponseDTO> {
    const wrongEmailPasswordMessage = 'Incorret Email/Password combination';
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError(wrongEmailPasswordMessage, 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError(wrongEmailPasswordMessage, 401);
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
