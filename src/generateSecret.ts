import { DIGITS } from './createDigitValidator.js';

const pick = (
  pool: readonly string[],
  count: number,
  random: () => number,
): string => {
  if (count === 0) return '';

  const index = Math.floor(random() * pool.length);
  const digit = pool[index] ?? '';
  const rest = pool.filter((_, i) => i !== index);

  return digit + pick(rest, count - 1, random);
};

export const generateSecret = (
  length: number,
  base: number,
  random: () => number = Math.random,
): string => {
  if (length > base) {
    throw new RangeError(`Length ${length} exceeds base ${base}`);
  }

  return pick(DIGITS.slice(0, base).split(''), length, random);
};
