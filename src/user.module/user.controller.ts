import { BadRequestException, Body, Controller, ForbiddenException, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCredentialsDTO } from './dto/userCredentials.dto';
import { UserValidator } from './user.validator';
import { UserEntity } from './entities/user.entity';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { SIGN_UP_SUCCESS, REG_ERROR, SIGN_IN_BAD_PASSWORD, SIGN_IN_NO_USER } from '../text/text';

@ApiUseTags('user')
@Controller({ path: 'user' })
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userValidator: UserValidator,
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
    await this.userService.signUp({ email, password });
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
    const isPasswordValid: boolean = await this.userValidator.isPasswordValid({ user, password });
    if (!isPasswordValid) {
      throw new ForbiddenException({ password: SIGN_IN_BAD_PASSWORD });
    }
    return await this.userService.signIn(user);
  }
}
