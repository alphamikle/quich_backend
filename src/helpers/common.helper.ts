import leven from 'leven';
import { Logger } from '@nestjs/common';

export async function wait(delay = 500) {
  await new Promise(resolve => setTimeout(resolve, delay));
}

export function getWordsDistance(first: string, second: string) {
  const max = leven(first, second);
  return Math.max(max, leven(second, first));
}

export function toDouble(num: number): number {
  const asNum = Number(num);
  if (Number.isNaN(asNum)) {
    Logger.error(
      `Not number provided in toDouble function ${ num }`,
      null,
      'common.helper:toDouble',
    );
    return null;
  }
  return Math.trunc(asNum * 100) / 100;
}

export function enumToArray() {
}
