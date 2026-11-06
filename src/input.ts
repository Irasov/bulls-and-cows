import { createDigitValidator } from './createDigitValidator.js';

export const sanitizeInput = (
  raw: string,
  base: number,
  length: number,
): string =>
  raw
    .toLowerCase()
    .split('')
    .filter(createDigitValidator(base))
    .filter((char, index, chars) => chars.indexOf(char) === index)
    .slice(0, length)
    .join('');
