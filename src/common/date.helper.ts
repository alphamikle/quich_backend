import { Injectable } from '@nestjs/common';
import { addDays as ad } from 'date-fns';

@Injectable()
export class DateHelper {
  addDays(date: Date, amount: number): Date {
    return ad(date, amount);
  }
}
