import { Controller, Get, Head, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DefaultService } from './default.service';
import { RequestUser } from '../user/user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { Guards } from '../helpers/guards';
import { AllUserDataDto } from './dto/AllUserData.dto';

@Controller('default')
export class DefaultController {
  constructor(
    private readonly defaultService: DefaultService,
  ) {
  }

  @Get('ping')
  @ApiResponse({
    status: 200,
    type: String,
  })
  @ApiOperation({ title: 'URL для проверки работоспособности сервера' })
  pingAction(): string {
    return 'PONG';
  }

  @Head('service')
  @ApiResponse({
    status: 200,
  })
  @UseGuards(Guards)
  @ApiBearerAuth()
  @ApiOperation({ title: 'Сервисный маршрут для внутренних нужд' })
  async serviceAction() {
    return this.defaultService.doServiceWork();
  }

  @UseGuards(Guards)
  @ApiBearerAuth()
  @Get('data')
  @ApiResponse({
    status: 200,
    type: AllUserDataDto,
  })
  @ApiOperation({ title: 'Получение всех данных пользователя в приложении' })
  async getAllUserData(@RequestUser() user: UserEntity): Promise<AllUserDataDto> {
    const data = await this.defaultService.getAllUserData(user.id);
    return data;
  }
}
