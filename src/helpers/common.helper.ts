import leven               from 'leven';
import { Logger }          from '@nestjs/common';
import { v4 }              from 'uuid';
import { AllHtmlEntities } from 'html-entities';
import { createHash }      from 'crypto';

const md5 = () => createHash('md5');

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
      `Not number provided in toDouble function ${num}`,
      null,
      'common.helper:toDouble',
    );
    return null;
  }
  return Math.trunc(asNum * 100) / 100;
}

export function randomInt(min = 0, max = 10): number {
  return Math.floor(Math.random() * max) + min;
}

export function randomBoolean(): boolean {
  return Boolean(Math.round(Math.random()));
}

function randomAndroid(): string {
  const android = [
    '5.0',
    '5.1',
    '6.0',
    '7.0',
    '7.1',
    '8.0.0',
    '8.1.0',
    '9',
    '10',
  ];
  return `Android ${android[randomInt(0, android.length - 1)]}`;
}

function randomIOS(): string {
  return `IOS ${randomInt(8, 13)}`;
}

export function randomOS(): string {
  if (randomInt(0, 100) > 70) {
    return randomIOS();
  }
  return randomAndroid();
}

export function randomUUID() {
  return v4();
}

export function decodeHtmlEntities(val: string) {
  return (new AllHtmlEntities()).decode(val);
}

type Hashable = string | number | [] | {};

export function getHash(data: Hashable) {
  let string = '';
  const isObject = typeof data === 'object' && Object.keys(data);
  const isArray = typeof data === 'object' && Array.isArray(data) && data.length > 0;
  if (isObject || isArray) {
    string = JSON.stringify(data);
  } else {
    string = String(data);
  }
  console.log(string);
  return md5()
    .update(string)
    .digest('hex');
}
