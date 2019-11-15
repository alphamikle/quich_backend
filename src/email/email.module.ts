import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailContentEntity } from './entities/email-content.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ EmailContentEntity ]) ],
  providers: [ EmailService ],
  exports: [ EmailService ],
})
export class EmailModule {
}
