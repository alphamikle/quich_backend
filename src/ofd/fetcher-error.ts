import { Logger } from '@nestjs/common';
import { OfdFetcherClass } from './base-ofd-fetcher';

class FetcherError extends Error {
  constructor(fetcherClass: OfdFetcherClass, message: string) {
    const prettyMessage = `${fetcherClass.name} fetching error with message ${message}`;
    super(prettyMessage);
  }
}

export function fetchError(fetcherClass: OfdFetcherClass, message: string) {
  const error = new FetcherError(fetcherClass, message);
  Logger.error(error.message);
}
