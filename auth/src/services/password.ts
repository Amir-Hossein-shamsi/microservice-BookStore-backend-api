import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString('hex')}.${salt}`;
  }
  static async compare(storepassword: string, suppliedpassword: string) {
    const [hasedPassword, salt] = storepassword.split('.');
    const buf = (await scryptAsync(suppliedpassword, salt, 64)) as Buffer;
    return buf.toString('hex') === hasedPassword;
  }
}
