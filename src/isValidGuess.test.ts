import { describe, it, expect } from 'vitest';
import { isValidGuess } from './isValidGuess.js';

describe('isValidGuess', () => {
  describe('valid guesses', () => {
    it.each([
      ['12', 2, 10],
      ['0123', 4, 10],
      ['9876', 4, 10],
      ['01', 2, 2],
      ['0123456', 7, 8],
      ['1a3f', 4, 16],
    ])('accepts %j (length %i, base %i)', (guess, length, base) => {
      expect(isValidGuess(guess, length, base)).toBe(true);
    });

    it('accepts uppercase hex digits', () => {
      expect(isValidGuess('1A3F', 4, 16)).toBe(true);
    });

    it('accepts leading zero', () => {
      expect(isValidGuess('0123', 4, 10)).toBe(true);
    });
  });

  describe('wrong length', () => {
    it.each([
      ['123', 4, 10],
      ['12345', 4, 10],
      ['', 4, 10],
    ])('rejects %j (length %i, base %i)', (guess, length, base) => {
      expect(isValidGuess(guess, length, base)).toBe(false);
    });
  });

  describe('characters outside the base', () => {
    it.each([
      ['12', 2, 2],
      ['18', 2, 8],
      ['1a', 2, 10],
      ['1g', 2, 16],
      ['1 ', 2, 10],
      ['1-', 2, 10],
    ])('rejects %j (length %i, base %i)', (guess, length, base) => {
      expect(isValidGuess(guess, length, base)).toBe(false);
    });
  });

  describe('repeated digits', () => {
    it.each([
      ['11', 2, 10],
      ['1231', 4, 10],
      ['00', 2, 2],
    ])('rejects %j (length %i, base %i)', (guess, length, base) => {
      expect(isValidGuess(guess, length, base)).toBe(false);
    });

    it('treats different case of the same hex digit as a repeat', () => {
      expect(isValidGuess('aA', 2, 16)).toBe(false);
    });
  });
});
