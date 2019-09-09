import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { wrapErrors } from '../helpers/response.helper';
import { OK } from '../helpers/text';
import { FtsRegistrationDto } from './dto/fts-registration.dto';
import { FtsService } from './fts.service';
import { FtsValidator } from './fts.validator';
import { FtsRemindDto } from './dto/fts-remind.dto';

@ApiUseTags('fts')
@Controller('fts')
export class FtsController {
  constructor(
    private readonly ftsService: FtsService,
    private readonly ftsValidator: FtsValidator,
  ) {
  }

  @Post('sign-up')
  @ApiOperation({ title: 'Создание аккаунта ФНС' })
  @ApiResponse({
    status: 201,
    type: String,
  })
  async signUp(@Body() regDto: FtsRegistrationDto): Promise<string> {
    const validationInfo = this.ftsValidator.validateRegistrationDto(regDto);
    if (validationInfo !== true) {
      throw new BadRequestException(wrapErrors(validationInfo));
    }
    const response = await this.ftsService.signUp(regDto);
    if (response !== true) {
      throw new BadRequestException(wrapErrors({ push: response }));
    }
    return OK;
  }

  @Post('remind')
  @ApiOperation({ title: 'Восстановление пароля от аккаунта ФНС' })
  @ApiResponse({
    status: 201,
    type: String,
  })
  async remindPassword(@Body() remindDto: FtsRemindDto): Promise<string> {
    const validationInfo = this.ftsValidator.validateRemindDto(remindDto);
    if (validationInfo !== true) {
      throw new BadRequestException(wrapErrors(validationInfo));
    }
    const response = await this.ftsService.remindPassword(remindDto);
    if (response !== true) {
      throw new BadRequestException(wrapErrors({ push: response }));
    }
    return OK;
  }
}
