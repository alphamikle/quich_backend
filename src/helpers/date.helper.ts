import { Injectable, Logger } from '@nestjs/common';
import { addDays as ad, format as fo, isPast as past, parseISO as pa, subDays as subD } from 'date-fns';

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

  addDurationFromGooglePlayPeriodString(period: string, date: Date) {
    const newDate = new Date(date);
    const dayRegExp = /^P([0-9]{1,2})D$/;
    const weekRegExp = /^P([0-9]{1,2})W$/;
    const monthRegExp = /^P([0-9]{1,2})M$/;
    const yearRegExp = /^P([0-9]{1,2})Y$/;
    let result: RegExpExecArray = dayRegExp.exec(period);
    if (result !== null) {
      const durationInDays = Number.parseInt(result[ 1 ], 10);
      newDate.setDate(newDate.getDate() + durationInDays);
    }
    result = weekRegExp.exec(period);
    if (result !== null) {
      const durationInDays = Number.parseInt(result[ 1 ], 10) * 7;
      newDate.setDate(newDate.getDate() + durationInDays);
    }
    result = monthRegExp.exec(period);
    if (result !== null) {
      const durationInMonths = Number.parseInt(result[ 1 ], 10);
      newDate.setMonth(newDate.getMonth() + durationInMonths);
    }
    result = yearRegExp.exec(period);
    if (result !== null) {
      const durationInYears = Number.parseInt(result[ 1 ], 10);
      newDate.setFullYear(newDate.getFullYear() + durationInYears);
    }
    if (result === null) {
      throw new Error(`Error in parse google play subscription duration ${ period }`);
    }
    return newDate;

  }

  parse(value: string | Date): Date {
    if (typeof value === 'string') {
      return pa(value);
    }
    if (value instanceof Date) {
      return value;
    }
    Logger.error(`Incorrect type of value was provided to dateParse function. Value is "${ value }"`, null, 'date.helper:parse');
    return null;
  }
}
