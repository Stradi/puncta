import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

@Injectable()
export class PasswordService {
  comparePassword(password: string, hashedPassword: string) {
    return compare(password, hashedPassword);
  }

  hashPassword(password: string) {
    // TODO: We should store saltRound in .env variable
    return hash(password, 10);
  }
}
