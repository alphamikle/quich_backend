import { DefaultService }                                              from './default.service';
import { RequestUser }                                                 from '../user/user.decorator';
import { UserEntity }                                                  from '../user/entities/user.entity';
import { AllUserDataDto }                                              from './dto/AllUserData.dto';
import { GetAction, SecureGetAction, SecureHeadAction, TagController } from '../helpers/decorators';

@TagController('default')
export class DefaultController {
  constructor(
    private readonly defaultService: DefaultService,
  ) {
  }

  @GetAction('URL для проверки работоспособности сервера', String)
  pingAction(): string {
    return 'PONG';
  }

  @SecureHeadAction('Сервисный маршрут для внутренних нужд', null)
  async serviceAction() {
    return this.defaultService.doServiceWork();
  }

  @SecureGetAction('Получение всех данных пользователя в приложении', AllUserDataDto, 'data')
  async getAllUserData(@RequestUser() user: UserEntity): Promise<AllUserDataDto> {
    const data = await this.defaultService.getAllUserData(user.id);
    return data;
  }
}
