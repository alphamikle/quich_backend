import { BadRequestException, Body, ForbiddenException, forwardRef, Inject, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { UserValidator } from './user.validator';
import { User } from './entities/user';
import {
  BAD_FTS_SIGN_IN_DATA,
  DUPLICATE_FTS_PHONE,
  EMAIL_RESTORE_SUCCESS,
  FTS_PHONE_DELETION_COMPLETE,
  NOT_EXIST_FTS_PHONE,
  REG_ERROR,
  SENDING_FTS_SMS,
  SIGN_IN_BAD_PASSWORD,
  SIGN_IN_NO_USER,
  SIGN_UP_SUCCESS,
} from '../helpers/text';
import { FtsAccountEntity } from './entities/fts-account.entity';
import { AuthService } from '../auth/auth.service';
import { AuthValidator } from '../auth/auth.validator';
import { RequestUser } from './user.decorator';
import { FtsAccountDto } from '../fts/dto/fts-account.dto';
import { FtsValidator } from '../fts/fts.validator';
import { FtsAccountModifyDto } from './dto/fts-account-modify.dto';
import { FtsService } from '../fts/fts.service';
import { EmailService, RestoreEmailCredentials } from '../email/email.service';
import { FtsRegistrationDto } from '../fts/dto/fts-registration.dto';
import { GetAction, PostAction, SecureDeleteAction, SecureGetAction, SecurePatchAction, SecurePostAction, TagController } from '../helpers/decorators';

@TagController('user')
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

  @PostAction('Регистрация пользователя', String, 'sign-up')
  async signUp(@Body() { email, password }: UserCredentialsDto): Promise<string> {
    const isUserExits = await this.userValidator.isUserExist(email);
    if (isUserExits) {
      throw new BadRequestException({ email: REG_ERROR });
    }
    const user: User = await this.authService.signUp({
      email,
      password,
    });
    return SIGN_UP_SUCCESS;
  }

  @GetAction('Восстановление пароля пользователя', String, 'restore/:email')
  async restore(@Param('email') email: string): Promise<string> {
    const isUserExits = await this.userValidator.isUserExist(email);
    if (isUserExits) {
      const user = await this.userService.getUserByEmail(email);
      const newPassword = this.authService.generateNewPassword();
      const newHash = await this.authService.getHashOf(newPassword);
      await this.userService.setUserPassword({
        user,
        password: newHash,
      });
      const credentials: RestoreEmailCredentials = {
        to: email,
      };
      await this.emailService.sendRestoreEmail({
        credentials,
        newPassword,
      });
    }
    return EMAIL_RESTORE_SUCCESS;
  }

  @PostAction('Авторизация пользователя', String, 'sign-in')
  async signIn(@Body() { email, password }: UserCredentialsDto): Promise<string> {
    const isUserExits = await this.userValidator.isUserExist(email);
    if (!isUserExits) {
      throw new BadRequestException({ email: SIGN_IN_NO_USER });
    }
    const user: User = await this.userService.getUserByEmail(email);
    const isPasswordValid: boolean = await this.authValidator.isPasswordValid({
      user,
      password,
    });
    if (!isPasswordValid) {
      throw new ForbiddenException({ password: SIGN_IN_BAD_PASSWORD });
    }
    return this.authService.signIn(user);
  }

  @SecureGetAction('Получение списка аккаунтов ФНС', [FtsAccountEntity], 'fts-accounts')
  async getFtsAccountsList(@RequestUser() user: User): Promise<FtsAccountEntity[]> {
    return this.userService.getFtsAccountsByUserId(user.id);
  }

  @SecurePostAction('Добавление нового аккаунта ФНС к пользователю', FtsAccountEntity, 'fts-accounts')
  async addFtsAccountToUser(@RequestUser() user: User, @Body() ftsAccountData: FtsAccountDto): Promise<FtsAccountEntity> {
    if (ftsAccountData.password === null || ftsAccountData.password === undefined) {
      const ftsRegistrationDto = new FtsRegistrationDto({
        email: user.email,
        phone: ftsAccountData.phone,
      });
      const result = await this.ftsService.signUp(ftsRegistrationDto);
      if (result === true) {
        throw new BadRequestException({ push: SENDING_FTS_SMS });
      } else {
        await this.ftsService.remindPassword({ phone: ftsAccountData.phone });
        throw new BadRequestException({ push: SENDING_FTS_SMS });
      }
    }
    const isCredentialsValid = await this.ftsValidator.isSignInDataValid(ftsAccountData);
    if (!isCredentialsValid) {
      throw new BadRequestException({ push: BAD_FTS_SIGN_IN_DATA });
    }
    const isAccountExist = await this.userValidator.isFtsAccountExistOnUser({
      user,
      phone: ftsAccountData.phone,
    });
    if (isAccountExist) {
      throw new BadRequestException({ phone: DUPLICATE_FTS_PHONE });
    }
    return this.userService.addFtsAccountToUser({
      user,
      ftsAccountData,
    });
  }

  @SecureDeleteAction('Удаление аккаунта ФНС из учетной записи пользователя', String, 'fts-accounts')
  async deleteFtsAccountFromUser(@RequestUser() user: User, @Query('phone') phone: string): Promise<string> {
    const isAccountExist = await this.userValidator.isFtsAccountExistOnUser({
      user,
      phone,
    });
    if (!isAccountExist) {
      throw new BadRequestException({ phone: NOT_EXIST_FTS_PHONE });
    }
    await this.userService.deleteFtsAccountFromUser({
      userId: user.id,
      phone,
    });
    return FTS_PHONE_DELETION_COMPLETE;
  }

  @SecurePatchAction('Изменение данных аккаунта ФНС', FtsAccountEntity, 'fts-accounts')
  async modifyFtsAccount(@RequestUser() user: User, @Body() { password, phone }: FtsAccountModifyDto): Promise<FtsAccountEntity> {
    const isAccountExist = await this.userValidator.isFtsAccountExistOnUser({
      user,
      phone,
    });
    if (!isAccountExist) {
      throw new BadRequestException({ phone: NOT_EXIST_FTS_PHONE });
    }
    const ftsAccountValidation = await this.ftsValidator.validateFtsAccountDto({
      phone,
      password,
    });
    if (ftsAccountValidation !== true) {
      throw new BadRequestException(ftsAccountValidation);
    }
    return this.ftsService.changeFtsAccountPassword({
      password,
      phone,
    });
  }

  @SecurePostAction('Увеличение лимита на сканирования', null, 'increase-limit')
  async increaseQueryLimit(@RequestUser() user: User) {
    await this.userService.increaseUserQueryLimit(user.id);
  }
}
