import { describe, it, expect } from 'vitest';
import { countPossibleSecrets } from './countPossibleSecrets.js';

describe('countPossibleSecrets', () => {
  describe('decimal', () => {
    it.each([
      [2, 10, 90],
      [3, 10, 720],
      [4, 10, 5040],
      [5, 10, 30240],
      [6, 10, 151200],
    ])('length %i, base %i -> %i', (length, base, expected) => {
      expect(countPossibleSecrets(length, base)).toBe(expected);
    });
  });

  describe('other bases', () => {
    it.each([
      [2, 2, 2],
      [2, 8, 56],
      [4, 8, 1680],
      [2, 16, 240],
      [4, 16, 43680],
      [6, 16, 5765760],
    ])('length %i, base %i -> %i', (length, base, expected) => {
      expect(countPossibleSecrets(length, base)).toBe(expected);
    });
  });

  describe('edge cases', () => {
    it('returns 1 for length 0 (the empty secret)', () => {
      expect(countPossibleSecrets(0, 10)).toBe(1);
    });

    it('returns base for length 1', () => {
      expect(countPossibleSecrets(1, 10)).toBe(10);
    });

    it('returns base! when length equals base', () => {
      expect(countPossibleSecrets(5, 5)).toBe(120);
    });

    it.each([
      [3, 2],
      [6, 2],
      [7, 6],
    ])('returns 0 when length %i exceeds base %i', (length, base) => {
      expect(countPossibleSecrets(length, base)).toBe(0);
    });
  });

  describe('repeated calls', () => {
    it('gives the same result every time', () => {
      const first = countPossibleSecrets(4, 10);

      expect(countPossibleSecrets(4, 10)).toBe(first);
      expect(countPossibleSecrets(4, 10)).toBe(first);
    });

    it('does not mix up arguments in different order', () => {
      expect(countPossibleSecrets(2, 10)).toBe(90);
      expect(countPossibleSecrets(10, 2)).toBe(0);
    });
  });
});
