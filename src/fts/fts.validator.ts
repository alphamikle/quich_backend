import { Injectable } from '@nestjs/common';
import { FtsService } from './fts.service';
import { FtsAccountDto } from './dto/ftsAccount.dto';

@Injectable()
export class FtsValidator {
  constructor(
    private readonly ftsService: FtsService,
  ) {}

  async isSignInDataValid(signInCredentials: FtsAccountDto): Promise<boolean> {
    return await this.ftsService.signIn(signInCredentials);
  }
}
