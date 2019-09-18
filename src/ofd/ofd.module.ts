import { Module } from '@nestjs/common';
import { OfdService } from './ofd.service';

@Module({
  providers: [ OfdService ],
  exports: [ OfdService ],
})
export class OfdModule {
}
