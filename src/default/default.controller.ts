import { Controller } from '@nestjs/common';
import { Metadata } from 'grpc';
import { DefaultService } from './default.service';
import { AllDataDto } from './dto/all-data.dto';
import { securedGrpc } from '~/providers/decorators';
import { Empty } from '~/providers/empty';
import * as defaultProto from '~/proto-generated/default';

@Controller()
export class DefaultController implements defaultProto.DefaultController {
  constructor(
    private readonly defaultService: DefaultService,
  ) {
  }

  @securedGrpc
  async serviceAction(): Promise<Empty> {
    await this.defaultService.doServiceWork();
    return new Empty();
  }

  @securedGrpc
  async getAllUserData(request: Empty, { user }: Metadata): Promise<AllDataDto> {
    return this.defaultService.getAllUserData(user.id);
  }
}
