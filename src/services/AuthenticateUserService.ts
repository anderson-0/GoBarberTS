import User from '@src/models/User';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import authConfig from '../config/auth';

interface RequestDTO {
  email: string;
  password: string;
}

interface ResponseDTO {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: RequestDTO): Promise<ResponseDTO> {
    const userRepository = getRepository(User);

    const wrongEmailPasswordMessage = 'Incorret Email/Password combination';
    const user = await userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw Error(wrongEmailPasswordMessage);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw Error(wrongEmailPasswordMessage);
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
