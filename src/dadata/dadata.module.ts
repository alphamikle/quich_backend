import { Module }        from '@nestjs/common';
import { DadataService } from './dadata.service';

@Module({
  providers: [DadataService],
  exports: [DadataService],
})
export class DadataModule {
}
