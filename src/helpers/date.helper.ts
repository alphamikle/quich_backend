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
}
