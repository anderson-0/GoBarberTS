import { compare, hash } from 'bcryptjs';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

export default class FakeHashProvider implements IHashProvider {
  generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
