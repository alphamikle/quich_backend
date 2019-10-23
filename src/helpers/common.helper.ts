import leven from 'leven';

export async function wait(delay: number = 500) {
  await new Promise(resolve => setTimeout(resolve, delay));
}

export function getWordsDistance(first: string, second: string) {
  const max = leven(first, second);
  return Math.max(max, leven(second, first));
}
