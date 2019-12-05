import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from './email.service';
import { EmailContentEntity } from './entities/email-content.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ EmailContentEntity ]) ],
  providers: [ EmailService ],
  exports: [ EmailService ],
})
export class EmailModule {
}
