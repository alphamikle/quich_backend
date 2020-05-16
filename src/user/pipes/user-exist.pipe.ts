import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { UserService } from '~/user/user.service';
import { SignInCredentials } from '~/user/dto/sign-in-credentials.dto';
import { Fields, PropertyError } from '~/providers/property-error';
import { rpcJsonException } from '~/providers/rpc-json-exception';
import { RU } from '~/locale/ru';
import { User } from '~/user/entities/user';

@Injectable()
export class UserExistPipe implements PipeTransform {
  constructor(
    private readonly userService: UserService,
  ) {
  }

  async transform(value: SignInCredentials | ArgumentMetadata): Promise<SignInCredentials | ArgumentMetadata> {
    if (value instanceof SignInCredentials) {
      let user: User | null;
      if (value.email) {
        user = await this.userService.getUserByEmail(value.email);
      }
      if (user === null) {
        throw rpcJsonException(PropertyError.manual(RU.userUnregistered, value.email ? Fields.EMAIL : Fields.PHONE));
      }
    }
    return value;
  }

}