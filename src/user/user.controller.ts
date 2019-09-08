import { BadRequestException, Body, Controller, ForbiddenException, forwardRef, Get, Inject, Post, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCredentialsDTO } from './dto/userCredentials.dto';
import { UserValidator } from './user.validator';
import { UserEntity } from './entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { SIGN_UP_SUCCESS, REG_ERROR, SIGN_IN_BAD_PASSWORD, SIGN_IN_NO_USER } from '../helpers/text';
import { FtsAccountEntity } from './entities/ftsAccount.entity';
import { AuthService } from '../auth/auth.service';
import { AuthValidator } from '../auth/auth.validator';
import { Guards } from '../helpers/guards';
import { RequestUser } from './user.decorator';

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
  ) {
  }

  @Post('sign-up')
  @ApiOperation({ title: 'Регистрация пользователя' })
  @ApiResponse({
    status: 201,
    type: String,
  })
  async signUp(@Body() { email, password }: UserCredentialsDTO): Promise<string> {
    const isUserExits = await this.userValidator.isUserExist(email);
    if (isUserExits) {
      throw new BadRequestException({ email: REG_ERROR });
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
  async signIn(@Body() { email, password }: UserCredentialsDTO): Promise<string> {
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

}
