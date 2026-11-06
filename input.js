import { createDigitValidator } from './createDigitValidator.js';
export const sanitizeInput = (raw, base, length) => raw
    .toLowerCase()
    .split('')
    .filter(createDigitValidator(base))
    .filter((char, index, chars) => chars.indexOf(char) === index)
    .slice(0, length)
    .join('');
