import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from '~/email/email.service';
import { EmailContent } from '~/email/entities/email-content.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmailContent,
    ]),
  ],
  providers: [
    EmailService,
  ],
  exports: [
    EmailService,
  ],
})
export class EmailModule {
}
