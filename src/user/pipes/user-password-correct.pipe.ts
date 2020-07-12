import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { rpcJsonException } from '~/providers/rpc-json-exception';
import { Fields, PropertyError } from '~/providers/property-error';
import { RU } from '~/locale/ru';
import { AuthService } from '~/auth/auth.service';
import { UserService } from '~/user/user.service';
import { User } from '~/user/entities/user.entity';

@Injectable()
export class UserPasswordCorrectPipe implements PipeTransform {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
  }

  async transform(value: any | ArgumentMetadata): Promise<ArgumentMetadata> {
    let user: User;
    if (value.email) {
      user = await this.userService.getUserByEmail(value.email) as User;
      const correct = this.authService.isHashValid(user.password, value.password);
      if (!correct) {
        throw rpcJsonException(PropertyError.manual(RU.incorrectPassword, Fields.PASSWORD));
      }
    }
    return value;
  }

}