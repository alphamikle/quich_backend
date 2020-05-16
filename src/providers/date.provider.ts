import { Injectable, Logger }                                                           from '@nestjs/common';
import { addDays as ad, format as fo, isPast as past, parseISO as pa, subDays as subD } from 'date-fns';

@Injectable()
export class DateProvider {
  addDays(date: Date, amount: number): Date {
    return ad(date, amount);
  }

  isPast(date: Date): boolean {
    return past(date);
  }

  subDays(date: Date, amount: number): Date {
    return subD(date, amount);
  }

  format(date: Date, format: string): string {
    return fo(date, format);
  }

  parse(value: string | Date): Date | null {
    if (typeof value === 'string') {
      return pa(value);
    }
    if (value instanceof Date) {
      return value;
    }
    Logger.error(`Incorrect type of value was provided to dateParse function. Value is "${value}"`, undefined, 'date.helper:parse');
    return null;
  }
}
