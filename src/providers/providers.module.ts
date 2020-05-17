import { Global, Module } from '@nestjs/common';
import { Converter } from '~/providers/converter.provider';
import { DateProvider } from '~/providers/date.provider';
import { Loggable } from '~/providers/loggable.provider';
import { DateHelper } from '~/helpers/date.helper';

@Global()
@Module({
  providers: [
    Converter,
    DateProvider,
    DateHelper,
    Loggable,
  ],
  exports: [
    Converter,
    DateProvider,
    DateHelper,
    Loggable,
  ],
})
export class ProvidersModule {
}
