import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

const { ROUNDS } = process.env;

@Injectable()
export class AuthService {
  async getHashOf(value: string): Promise<string> {
    return await hash(value, Number(ROUNDS) || 5);
  }

  async isHashValid(value: string, encrypted: string): Promise<boolean> {
    return await compare(value, encrypted);
  }

  async generateAuthToken({ dateMark, email }: { dateMark: number, email: string }): Promise<string> {
    return await this.getHashOf(dateMark.toString() + email);
  }
}
