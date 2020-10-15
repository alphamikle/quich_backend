import { Controller } from '@nestjs/common';
import { Metadata } from 'grpc';
import { UserService } from '~/user/user.service';
import { Grpc, securedGrpc } from '~/providers/decorators';
import { Empty } from '~/providers/empty';
import * as generatedUser from '~/proto-generated/user';
import { EsiaAuthDto } from '~/user/dto/esia-auth.dto';

@Controller()
export class UserController implements generatedUser.UserController {
  constructor(
    private readonly userService: UserService,
  ) {
  }

  @Grpc
  async authWithEsia(request: EsiaAuthDto, metadata: Metadata): Promise<Empty> {
    const user = await this.userService.createOrFindUserByOAuthData(request);
    return new Empty();
  }

  @securedGrpc
  async increaseQueryLimit(request: Empty, { user }: Metadata): Promise<Empty> {
    await this.userService.increaseUserQueryLimit(user.id);
    return new Empty();
  }
}
