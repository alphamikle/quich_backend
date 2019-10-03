import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DefaultService } from './default.service';

@Controller('default')
export class DefaultController {
  constructor(
    private readonly defaultService: DefaultService,
  ) {}

  @Get('ping')
  @ApiResponse({
    status: 200,
    type: String,
  })
  @ApiOperation({ title: 'URL для проверки работоспособности сервера' })
  pingAction(): string {
    return 'PONG';
  }

  @Get('import')
  @ApiResponse({
    status: 200,
  })
  @ApiOperation({ title: 'Импорт старых данных quich' })
  async importAction() {
    return await this.defaultService.importOldData();
  }
}
