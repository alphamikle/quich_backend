import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserValidator } from './user.validator';
import { AuthService } from './auth.service';
import { SessionEntity } from './entities/session.entity';
import { FtsAccountEntity } from './entities/ftsAccount.entity';
import { DateHelper } from '../common/date.helper';

@Module({
  imports: [ TypeOrmModule.forFeature([ UserEntity, SessionEntity, FtsAccountEntity ]) ],
  controllers: [ UserController ],
  providers: [ UserService, AuthService, UserValidator, DateHelper ],
})
export class UserModule {
}
