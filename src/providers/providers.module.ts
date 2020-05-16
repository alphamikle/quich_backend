import { Global, Module } from '@nestjs/common';
import { Converter } from '~/providers/converter.provider';
import { DateProvider } from '~/providers/date.provider';
import { Loggable } from '~/providers/loggable.provider';

@Global()
@Module({
  providers: [
    Converter,
    DateProvider,
    Loggable,
  ],
  exports: [
    Converter,
    DateProvider,
    Loggable,
  ],
})
export class ProvidersModule {
}
