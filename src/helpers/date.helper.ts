import { Injectable } from '@nestjs/common';
import { addDays as ad, format as fo, isPast as past, subDays as subD } from 'date-fns';

@Injectable()
export class DateHelper {
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

  transformFtsDateToDate(ftsDate: string): Date {
    // ? 20190429T1951 - 13
    // ? 20190429T195151 - 15
    if (ftsDate.length === 13) {
      ftsDate = `${ ftsDate }00`;
    }
    ftsDate = ftsDate.replace(/^([0-9]{4})([0-9]{2})([0-9]{2})(T)([0-9]{2})([0-9]{2})([0-9]{2})$/, '$1-$2-$3 $5:$6:$7');
    return new Date(ftsDate);
  }

  transformDateToFtsDate(date: Date): string {
    return this.format(date, 'yyyyMMdd HHmm').replace(' ', 'T');
  }
}
