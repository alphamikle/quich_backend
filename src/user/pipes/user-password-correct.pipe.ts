import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { rpcJsonException } from '~/providers/rpc-json-exception';
import { Fields, PropertyError } from '~/providers/property-error';
import { RU } from '~/locale/ru';
import { AuthService } from '~/auth/auth.service';
import { SignInCredentials } from '~/user/dto/sign-in-credentials.dto';
import { UserService } from '~/user/user.service';
import { User } from '~/user/entities/user.entity';

@Injectable()
export class UserPasswordCorrectPipe implements PipeTransform {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
  }

  async transform(value: SignInCredentials | ArgumentMetadata): Promise<SignInCredentials | ArgumentMetadata> {
    if (value instanceof SignInCredentials) {
      let user: User;
      if (value.email) {
        user = await this.userService.getUserByEmail(value.email) as User;
      } else {
        user = await this.userService.getUserByPhone(value.phone) as User;
      }
      const correct = this.authService.isHashValid(user.hash, value.password);
      if (!correct) {
        throw rpcJsonException(PropertyError.manual(RU.incorrectPassword, Fields.PASSWORD));
      }
    }
    return value;
  }

}