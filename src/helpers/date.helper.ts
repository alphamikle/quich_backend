import { Injectable } from '@nestjs/common';
import { addDays as ad, isPast as past, subDays as subD, format as fo } from 'date-fns';

@Injectable()
export class DateHelper {
  addDays(date: Date, amount: number): Date {
    return ad(date, amount);
  }

  isPast(date: Date): boolean {
    return past(date);
  }

  subDays(date: Date, amount: number) {
    return subD(date, amount);
  }

  format(date: Date, format: string) {
    return fo(date, format);
  }

  transformFtsDateToDate(ftsDate: string) {
    // ? 20190429T1951 - 13
    // ? 20190429T195151 - 15
    if (ftsDate.length === 13) {
      ftsDate = `${ftsDate}00`;
    }
    ftsDate = ftsDate.replace(/^([0-9]{4})([0-9]{2})([0-9]{2})(T)([0-9]{2})([0-9]{2})([0-9]{2})$/, '$1-$2-$3 $5:$6:$7');
    return new Date(ftsDate);
  }
}
