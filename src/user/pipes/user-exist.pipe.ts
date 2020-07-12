import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { UserService } from '~/user/user.service';
import { Fields, PropertyError } from '~/providers/property-error';
import { rpcJsonException } from '~/providers/rpc-json-exception';
import { RU } from '~/locale/ru';
import { User } from '~/user/entities/user.entity';
import { UserCredentialsDto } from '~/user/dto/user-credentials.dto';

@Injectable()
export class UserExistPipe implements PipeTransform {
  constructor(
    private readonly userService: UserService,
  ) {
  }

  async transform(value: UserCredentialsDto | ArgumentMetadata): Promise<UserCredentialsDto | ArgumentMetadata> {
    if (value instanceof UserCredentialsDto) {
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