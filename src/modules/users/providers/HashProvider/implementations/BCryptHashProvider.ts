import { compare, hash } from 'bcryptjs';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

export default class BCryptHashProvider implements IHashProvider {
  generateHash(payload: string): Promise<string> {
    return payload;
  }

  compareHash(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed;
  }
}
