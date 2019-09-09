import { Injectable } from '@nestjs/common';
import { addDays as ad, isPast as past } from 'date-fns';

@Injectable()
export class DateHelper {
  addDays(date: Date, amount: number): Date {
    return ad(date, amount);
  }

  isPast(date: Date): boolean {
    return past(date);
  }
}
