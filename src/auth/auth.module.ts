import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from '~/user/entities/session';
import { UserModule } from '~/user/user.module';
import { SubscriptionModule } from '~/subscription/subscription.module';
import { AuthService } from '~/auth/auth.service';
import { AuthValidator } from '~/auth/auth.validator';

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
    AuthValidator,
  ],
  exports: [
    AuthService,
    AuthValidator,
  ],
})
export class AuthModule {
}
