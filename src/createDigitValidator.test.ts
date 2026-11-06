import { describe, it, expect } from 'vitest';
import { createDigitValidator } from './createDigitValidator.js';

describe('createDigitValidator', () => {
  it('returns a function (curried factory)', () => {
    expect(typeof createDigitValidator(10)).toBe('function');
  });

  describe('bin (base 2)', () => {
    const isDigit = createDigitValidator(2);

    it.each(['0', '1'])('accepts %s', (char) => {
      expect(isDigit(char)).toBe(true);
    });

    it.each(['2', '9', 'a'])('rejects %s', (char) => {
      expect(isDigit(char)).toBe(false);
    });
  });

  describe('oct (base 8)', () => {
    const isDigit = createDigitValidator(8);

    it.each(['0', '7'])('accepts %s', (char) => {
      expect(isDigit(char)).toBe(true);
    });

    it.each(['8', '9', 'a'])('rejects %s', (char) => {
      expect(isDigit(char)).toBe(false);
    });
  });

  describe('dec (base 10)', () => {
    const isDigit = createDigitValidator(10);

    it.each(['0', '5', '9'])('accepts %s', (char) => {
      expect(isDigit(char)).toBe(true);
    });

    it.each(['a', 'A', 'f'])('rejects %s', (char) => {
      expect(isDigit(char)).toBe(false);
    });
  });

  describe('hex (base 16)', () => {
    const isDigit = createDigitValidator(16);

    it.each(['0', '9', 'a', 'f'])('accepts lowercase %s', (char) => {
      expect(isDigit(char)).toBe(true);
    });

    it.each(['A', 'F'])('accepts uppercase %s', (char) => {
      expect(isDigit(char)).toBe(true);
    });

    it.each(['g', 'G', 'z'])('rejects %s', (char) => {
      expect(isDigit(char)).toBe(false);
    });
  });

  describe('invalid input', () => {
    const isDigit = createDigitValidator(16);

    it.each(['', '10', 'ab', ' ', '-', '.', 'я'])('rejects %j', (char) => {
      expect(isDigit(char)).toBe(false);
    });
  });

  it('keeps validators for different bases independent', () => {
    const bin = createDigitValidator(2);
    const hex = createDigitValidator(16);

    expect(bin('f')).toBe(false);
    expect(hex('f')).toBe(true);
  });
});
