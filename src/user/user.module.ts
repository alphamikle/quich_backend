import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserValidator } from './user.validator';
import { SessionEntity } from './entities/session.entity';
import { FtsAccountEntity } from './entities/ftsAccount.entity';
import { DateHelper } from '../helpers/date.helper';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ TypeOrmModule.forFeature([ UserEntity, SessionEntity, FtsAccountEntity ]), forwardRef(() => AuthModule) ],
  controllers: [ UserController ],
  providers: [ UserService, UserValidator, DateHelper ],
  exports: [ UserService ],
})
export class UserModule {
}
