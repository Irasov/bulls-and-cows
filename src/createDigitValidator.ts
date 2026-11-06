export const DIGITS = '0123456789abcdef';

export const createDigitValidator = (base: number) => {
  const alphabet = DIGITS.slice(0, base).split('');

  return (char: string): boolean => alphabet.includes(char.toLowerCase());
};
