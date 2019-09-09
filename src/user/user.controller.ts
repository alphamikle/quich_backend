import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  forwardRef,
  Get,
  Inject,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { UserValidator } from './user.validator';
import { UserEntity } from './entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import {
  BAD_FTS_SIGN_IN_DATA,
  DUPLICATE_FTS_PHONE,
  FTS_PHONE_DELETION_COMPLETE,
  NOT_EXIST_FTS_PHONE,
  OK,
  REG_ERROR,
  SIGN_IN_BAD_PASSWORD,
  SIGN_IN_NO_USER,
  SIGN_UP_SUCCESS,
} from '../helpers/text';
import { FtsAccountEntity } from './entities/fts-account.entity';
import { AuthService } from '../auth/auth.service';
import { AuthValidator } from '../auth/auth.validator';
import { Guards } from '../helpers/guards';
import { RequestUser } from './user.decorator';
import { FtsAccountDto } from '../fts/dto/fts-account.dto';
import { FtsValidator } from '../fts/fts.validator';
import { wrapErrors } from '../helpers/response.helper';

@ApiUseTags('user')
@Controller({ path: 'user' })
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userValidator: UserValidator,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => AuthValidator))
    private readonly authValidator: AuthValidator,
    private readonly ftsValidator: FtsValidator,
  ) {
  }

  @Post('sign-up')
  @ApiOperation({ title: 'Регистрация пользователя' })
  @ApiResponse({
    status: 201,
    type: String,
  })
  async signUp(@Body() { email, password }: UserCredentialsDto): Promise<string> {
    const isUserExits = await this.userValidator.isUserExist(email);
    if (isUserExits) {
      throw new BadRequestException(wrapErrors({ email: REG_ERROR }));
    }
    await this.authService.signUp({ email, password });
    return SIGN_UP_SUCCESS;
  }

  @Post('sign-in')
  @ApiOperation({ title: 'Авторизация пользователя' })
  @ApiResponse({
    status: 201,
    type: String,
  })
  async signIn(@Body() { email, password }: UserCredentialsDto): Promise<string> {
    const isUserExits = await this.userValidator.isUserExist(email);
    if (!isUserExits) {
      throw new BadRequestException(wrapErrors({ email: SIGN_IN_NO_USER }));
    }
    const user: UserEntity = await this.userService.getUserByEmail(email);
    const isPasswordValid: boolean = await this.authValidator.isPasswordValid({ user, password });
    if (!isPasswordValid) {
      throw new ForbiddenException(wrapErrors({ password: SIGN_IN_BAD_PASSWORD }));
    }
    return await this.authService.signIn(user);
  }

  @UseGuards(Guards)
  @ApiBearerAuth()
  @Get('fts-accounts')
  @ApiOperation({ title: 'Получение списка аккаунтов ФНС' })
  @ApiResponse({
    status: 200,
    type: FtsAccountEntity,
    isArray: true,
  })
  async getFtsAccountsList(@RequestUser() user: UserEntity): Promise<FtsAccountEntity[]> {
    return await this.userService.getFtsAccountsByUserId(user.id);
  }

  @UseGuards(Guards)
  @ApiBearerAuth()
  @Post('fts-accounts')
  @ApiOperation({ title: 'Добавление нового аккаунта ФНС к пользователю' })
  @ApiResponse({
    status: 201,
    type: FtsAccountEntity,
  })
  async addFtsAccountToUser(@RequestUser() user: UserEntity, @Body() ftsAccountData: FtsAccountDto): Promise<FtsAccountEntity> {
    const isCredentialsValid = await this.ftsValidator.isSignInDataValid(ftsAccountData);
    if (!isCredentialsValid) {
      throw new BadRequestException(wrapErrors({ push: BAD_FTS_SIGN_IN_DATA }));
    }
    const isAccountExist = await this.userValidator.isFtsAccountExistOnUser({ user, phone: ftsAccountData.phone });
    if (isAccountExist) {
      throw new BadRequestException(wrapErrors({ phone: DUPLICATE_FTS_PHONE }));
    }
    return await this.userService.addFtsAccountToUser({ user, ftsAccountData });
  }

  @UseGuards(Guards)
  @ApiBearerAuth()
  @Delete('fts-accounts')
  @ApiOperation({ title: 'Удаление аккаунта ФНС из учетной записи пользователя' })
  @ApiResponse({
    status: 200,
    type: String,
  })
  async deleteFtsAccountFromUser(@RequestUser() user: UserEntity, @Query('phone') phone: string): Promise<string> {
    const isAccountExist = await this.userValidator.isFtsAccountExistOnUser({ user, phone });
    if (!isAccountExist) {
      throw new BadRequestException(wrapErrors({ phone: NOT_EXIST_FTS_PHONE }));
    }
    await this.userService.deleteFtsAccountFromUser({ user, phone });
    return FTS_PHONE_DELETION_COMPLETE;
  }

  @UseGuards(Guards)
  @ApiBearerAuth()
  @Patch('fts-accounts')
  @ApiOperation({ title: 'Модификация аккаунта ФНС в главный' })
  @ApiResponse({
    status: 200,
    type: String,
  })
  async makeFtsAccountMain(@RequestUser() user: UserEntity, @Query('phone') phone: string): Promise<string> {
    const isAccountExist = await this.userValidator.isFtsAccountExistOnUser({ user, phone });
    if (!isAccountExist) {
      throw new BadRequestException(wrapErrors({ phone: NOT_EXIST_FTS_PHONE }));
    }
    await this.userService.makeFtsAccountMain({ user, phone });
    return OK;
  }
}
