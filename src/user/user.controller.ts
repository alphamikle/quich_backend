import { Controller, ForbiddenException, forwardRef, Inject } from '@nestjs/common';
import { Metadata } from 'grpc';
import { UserService } from '~/user/user.service';
import { UserCredentialsDto } from '~/user/dto/user-credentials.dto';
import { UserValidator } from '~/user/user.validator';
import { User } from '~/user/entities/user.entity';
import { BAD_FTS_SIGN_IN_DATA, DUPLICATE_FTS_PHONE, NOT_EXIST_FTS_PHONE, REG_ERROR, SENDING_FTS_SMS, SIGN_IN_BAD_PASSWORD, SIGN_IN_NO_USER } from '~/helpers/text';
import { FtsAccount } from '~/user/entities/fts-account.entity';
import { AuthService } from '~/auth/auth.service';
import { AuthValidator } from '~/auth/auth.validator';
import { FtsAccountDto } from '~/fts/dto/fts-account.dto';
import { FtsValidator } from '~/fts/fts.validator';
import { FtsAccountModifyDto } from '~/user/dto/fts-account-modify.dto';
import { FtsService } from '~/fts/fts.service';
import { EmailService, RestoreEmailCredentials } from '~/email/email.service';
import { FtsRegistrationDto } from '~/fts/dto/fts-registration.dto';
import { Grpc, securedGrpc } from '~/providers/decorators';
import { Empty } from '~/providers/empty';
import * as generatedUser from '~/proto-generated/user';
import { EmailDto } from '~/user/dto/email.dto';
import { TokenDto } from '~/user/dto/token.dto';
import { Accounts } from '~/user/entities/accounts.dto';
import { PhoneDto } from '~/user/dto/phone.dto';
import { rpcJsonException } from '~/providers/rpc-json-exception';
import { PropertyError } from '~/providers/property-error';

@Controller()
export class UserController implements generatedUser.UserController {
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

  @Grpc
  async signUp({ email, password }: UserCredentialsDto): Promise<Empty> {
    const isUserExits = await this.userValidator.isUserExist(email);
    if (isUserExits) {
      throw rpcJsonException(PropertyError.fromObject({ email: REG_ERROR }));
    }
    await this.authService.signUp({
      email,
      password,
    });
    return new Empty();
  }

  @Grpc
  async restore({ email }: EmailDto): Promise<Empty> {
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
    return new Empty();
  }

  @Grpc
  async signIn({ email, password }: UserCredentialsDto): Promise<TokenDto> {
    const isUserExits = await this.userValidator.isUserExist(email);
    if (!isUserExits) {
      throw rpcJsonException(PropertyError.fromObject({ email: SIGN_IN_NO_USER }));
    }
    const user: User = await this.userService.getUserByEmail(email);
    const isPasswordValid: boolean = await this.authValidator.isPasswordValid({
      user,
      password,
    });
    if (!isPasswordValid) {
      throw new ForbiddenException({ password: SIGN_IN_BAD_PASSWORD });
    }
    return new TokenDto(await this.authService.signIn(user));
  }

  @securedGrpc
  async getFtsAccountsList(request: Empty, { user }: Metadata): Promise<Accounts> {
    return new Accounts(await this.userService.getFtsAccountsByUserId(user.id));
  }

  @securedGrpc
  async addFtsAccountToUser(ftsAccountData: FtsAccountDto, { user }: Metadata): Promise<FtsAccount> {
    if (ftsAccountData.password === null || ftsAccountData.password === undefined) {
      const ftsRegistrationDto = new FtsRegistrationDto({
        email: user.email,
        phone: ftsAccountData.phone,
      });
      const result = await this.ftsService.signUp(ftsRegistrationDto);
      if (result === true) {
        throw rpcJsonException(PropertyError.fromObject({ push: SENDING_FTS_SMS }));
      } else {
        await this.ftsService.remindPassword({ phone: ftsAccountData.phone });
        throw rpcJsonException(PropertyError.fromObject({ push: SENDING_FTS_SMS }));
      }
    }
    const isCredentialsValid = await this.ftsValidator.isSignInDataValid(ftsAccountData);
    if (!isCredentialsValid) {
      throw rpcJsonException(PropertyError.fromObject({ push: BAD_FTS_SIGN_IN_DATA }));
    }
    const isAccountExist = await this.userValidator.isFtsAccountExistOnUser({
      user,
      phone: ftsAccountData.phone,
    });
    if (isAccountExist) {
      throw rpcJsonException(PropertyError.fromObject({ phone: DUPLICATE_FTS_PHONE }));
    }
    return this.userService.addFtsAccountToUser({
      user,
      ftsAccountData,
    });
  }

  @securedGrpc
  async deleteFtsAccountFromUser({ phone }: PhoneDto, { user }: Metadata): Promise<Empty> {
    const isAccountExist = await this.userValidator.isFtsAccountExistOnUser({
      user,
      phone,
    });
    if (!isAccountExist) {
      throw rpcJsonException(PropertyError.fromObject({ phone: NOT_EXIST_FTS_PHONE }));
    }
    await this.userService.deleteFtsAccountFromUser({
      userId: user.id,
      phone,
    });
    return new Empty();
  }

  @securedGrpc
  async modifyFtsAccount({ password, phone }: FtsAccountModifyDto, { user }: Metadata): Promise<FtsAccount> {
    const isAccountExist = await this.userValidator.isFtsAccountExistOnUser({
      user,
      phone,
    });
    if (!isAccountExist) {
      throw rpcJsonException(PropertyError.fromObject({ phone: NOT_EXIST_FTS_PHONE }));
    }
    const ftsAccountValidation = await this.ftsValidator.validateFtsAccountDto({
      phone,
      password,
    });
    if (ftsAccountValidation !== true) {
      throw rpcJsonException(PropertyError.fromObject(ftsAccountValidation));
    }
    return this.ftsService.changeFtsAccountPassword({
      password,
      phone,
    });
  }

  @securedGrpc
  async increaseQueryLimit(request: Empty, { user }: Metadata): Promise<Empty> {
    await this.userService.increaseUserQueryLimit(user.id);
    return new Empty();
  }
}
