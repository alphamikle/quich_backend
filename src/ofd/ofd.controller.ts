import { OfdService }               from './ofd.service';
import { GetAction, TagController } from '../helpers/decorators';

@TagController('ofd')
export class OfdController {
  constructor(private readonly ofdService: OfdService) {
  }

  @GetAction('Проверка списка ОФД', null)
  async checkOfdAvailability() {
    return this.ofdService.checkOfd();
  }
}
