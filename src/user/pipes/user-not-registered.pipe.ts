import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { UserService } from '~/user/user.service';
import { rpcJsonException } from '~/providers/rpc-json-exception';
import { PropertyError } from '~/providers/property-error';
import { RU } from '~/locale/ru';
import { SignUpCredentials } from '~/user/dto/sign-up-credentials.dto';

@Injectable()
export class UserNotRegisteredPipe implements PipeTransform {
  constructor(
    private readonly userService: UserService,
  ) {
  }

  async transform(value: SignUpCredentials | ArgumentMetadata): Promise<SignUpCredentials | ArgumentMetadata> {
    if (value instanceof SignUpCredentials) {
      const user = await this.userService.getUserByEmail(value.email);
      if (user !== null) {
        throw rpcJsonException(PropertyError.fromString(RU.userRegistered));
      }
    }
    return value;
  }

}