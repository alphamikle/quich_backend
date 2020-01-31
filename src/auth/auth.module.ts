import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthValidator } from './auth.validator';
import { BearerStrategy } from './strategies/bearer.strategy';
import { UserModule } from '../user/user.module';
import { SessionEntity } from '../user/entities/session.entity';
import { DateHelper } from '../helpers/date.helper';

@Module({
  imports: [ TypeOrmModule.forFeature([ SessionEntity ]), forwardRef(() => UserModule), PassportModule ],
  providers: [ AuthService, AuthValidator, BearerStrategy, DateHelper ],
  exports: [ AuthService, AuthValidator ],
})
export class AuthModule {
}
