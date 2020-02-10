import { Module }            from '@nestjs/common';
import { TypeOrmModule }     from '@nestjs/typeorm';
import { OfdService }        from './ofd.service';
import { BillRequestEntity } from '../bill-request/entities/bill-request.entity';
import { OfdController }     from './ofd.controller';
import { DateHelper }        from '../helpers/date.helper';
import { ProxyModule }       from '../proxy/proxy.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BillRequestEntity]),
    ProxyModule,
  ],
  providers: [
    OfdService,
    DateHelper,
  ],
  exports: [OfdService],
  controllers: [OfdController],
})
export class OfdModule {
}
