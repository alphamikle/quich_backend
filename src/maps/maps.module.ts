import { Module } from '@nestjs/common';
import { MapsService } from './maps.service';

@Module({
  providers: [ MapsService ],
  exports: [ MapsService ],
})
export class MapsModule {
}
