import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { OfdService } from './ofd.service';

@ApiUseTags('ofd')
@Controller('ofd')
export class OfdController {
  constructor(private readonly ofdService: OfdService) {
  }

  @ApiOperation({ title: 'Проверка списка ОФД' })
  @Get()
  async checkOfdAvailability() {
    return this.ofdService.checkOfd();
  }
}
