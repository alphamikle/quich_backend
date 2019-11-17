import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  forwardRef,
  Get, Head,
  Inject, Param,
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
  DUPLICATE_FTS_PHONE, EMAIL_RESTORE_SUCCESS,
  FTS_PHONE_DELETION_COMPLETE,
  NOT_EXIST_FTS_PHONE,
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
import { FtsAccountModifyDto } from './dto/fts-account-modify.dto';
import { FtsService } from '../fts/fts.service';
import { EmailService, RestoreEmailCredentials } from '../email/email.service';

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
    @Inject(forwardRef(() => FtsValidator))
    private readonly ftsValidator: FtsValidator,
    @Inject(forwardRef(() => FtsService))
    private readonly ftsService: FtsService,
    private readonly emailService: EmailService,
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
      throw new BadRequestException({ email: REG_ERROR });
    }
    await this.authService.signUp({ email, password });
    return SIGN_UP_SUCCESS;
  }

  @Get('restore/:email')
  @ApiOperation({ title: 'Восстановление пароля пользователя' })
  @ApiResponse({
    status: 201,
    type: String,
  })
  async restore(@Param('email') email: string): Promise<string> {
    const isUserExits = await this.userValidator.isUserExist(email);
    if (isUserExits) {
      const user = await this.userService.getUserByEmail(email);
      const newPassword = this.authService.generateNewPassword();
      const newHash = await this.authService.getHashOf(newPassword);
      await this.userService.setUserPassword({ user, password: newHash });
      const credentials: RestoreEmailCredentials = {
        to: email,
      };
      await this.emailService.sendRestoreEmail({ credentials, newPassword });
    }
    return EMAIL_RESTORE_SUCCESS;
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
      throw new BadRequestException({ email: SIGN_IN_NO_USER });
    }
    const user: UserEntity = await this.userService.getUserByEmail(email);
    const isPasswordValid: boolean = await this.authValidator.isPasswordValid({ user, password });
    if (!isPasswordValid) {
      throw new ForbiddenException({ password: SIGN_IN_BAD_PASSWORD });
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
      throw new BadRequestException({ push: BAD_FTS_SIGN_IN_DATA });
    }
    const isAccountExist = await this.userValidator.isFtsAccountExistOnUser({ user, phone: ftsAccountData.phone });
    if (isAccountExist) {
      throw new BadRequestException({ phone: DUPLICATE_FTS_PHONE });
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
      throw new BadRequestException({ phone: NOT_EXIST_FTS_PHONE });
    }
    await this.userService.deleteFtsAccountFromUser({ userId: user.id, phone });
    return FTS_PHONE_DELETION_COMPLETE;
  }

  @UseGuards(Guards)
  @ApiBearerAuth()
  @Patch('fts-accounts')
  @ApiOperation({ title: 'Изменение данных аккаунта ФНС' })
  @ApiResponse({
    status: 200,
    type: FtsAccountEntity,
  })
  async modifyFtsAccount(@RequestUser() user: UserEntity, @Body() { isMain, password, phone }: FtsAccountModifyDto): Promise<FtsAccountEntity> {
    const isAccountExist = await this.userValidator.isFtsAccountExistOnUser({ user, phone });
    if (!isAccountExist) {
      throw new BadRequestException({ phone: NOT_EXIST_FTS_PHONE });
    }
    const ftsAccountValidation = await this.ftsValidator.validateFtsAccountDto({ phone, password });
    if (ftsAccountValidation !== true) {
      throw new BadRequestException(ftsAccountValidation);
    }
    if (isMain) {
      await this.userService.makeFtsAccountMain({ user, phone });
    }
    return await this.ftsService.changeFtsAccountPassword({ password, phone });
  }
}
