import { forwardRef, Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from '~/user/entities/session.entity';
import { UserModule } from '~/user/user.module';
import { SubscriptionModule } from '~/subscription/subscription.module';
import { AuthService } from '~/auth/auth.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Session,
    ]),
    forwardRef(() => UserModule),
    PassportModule,
    SubscriptionModule,
  ],
  providers: [
    AuthService,
  ],
  exports: [
    AuthService,
  ],
})
export class AuthModule {
}
