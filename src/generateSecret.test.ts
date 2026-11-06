import { describe, it, expect, vi } from 'vitest';
import { generateSecret } from './generateSecret.js';

const sequence = (...values: number[]) => {
  let i = 0;
  return () => values[i++] ?? 0;
};

const seeded = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};

describe('generateSecret', () => {
  describe('with deterministic random', () => {
    it('picks the first available digits when random always returns 0', () => {
      expect(generateSecret(4, 10, () => 0)).toBe('0123');
    });

    it('picks the last available digits when random is close to 1', () => {
      expect(generateSecret(4, 10, () => 0.999)).toBe('9876');
    });

    it('uses a different index for each position', () => {
      expect(generateSecret(4, 10, sequence(0.5, 0, 0, 0))).toBe('5012');
    });

    it('works in binary', () => {
      expect(generateSecret(2, 2, () => 0)).toBe('01');
      expect(generateSecret(2, 2, () => 0.999)).toBe('10');
    });

    it('works in octal', () => {
      expect(generateSecret(3, 8, () => 0)).toBe('012');
    });

    it('works in hex and returns lowercase letters', () => {
      expect(generateSecret(6, 16, () => 0.999)).toBe('fedcba');
    });

    it('allows a leading zero', () => {
      expect(generateSecret(4, 10, () => 0).startsWith('0')).toBe(true);
    });

    it('is repeatable for the same random source', () => {
      expect(generateSecret(5, 10, seeded(42))).toBe(
        generateSecret(5, 10, seeded(42)),
      );
    });
  });

  describe('random source', () => {
    it('calls random exactly once per position', () => {
      const random = vi.fn(() => 0);

      generateSecret(4, 10, random);

      expect(random).toHaveBeenCalledTimes(4);
    });
  });

  describe('invariants', () => {
    it.each([
      [2, 2],
      [2, 8],
      [4, 10],
      [6, 10],
      [6, 16],
      [3, 3],
    ])(
      'gives %i unique valid digits in base %i for many seeds',
      (length, base) => {
        const alphabet = '0123456789abcdef'.slice(0, base);

        Array.from({ length: 50 }, (_, seed) => seed + 1).forEach((seed) => {
          const secret = generateSecret(length, base, seeded(seed));
          const chars = secret.split('');

          expect(secret).toHaveLength(length);
          expect(new Set(chars).size).toBe(length);
          expect(chars.every((c) => alphabet.includes(c))).toBe(true);
        });
      },
    );

    it('uses Math.random by default and still returns a valid secret', () => {
      const secret = generateSecret(4, 10);

      expect(secret).toHaveLength(4);
      expect(new Set(secret.split('')).size).toBe(4);
    });
  });

  describe('invalid arguments', () => {
    it('throws RangeError when length exceeds base', () => {
      expect(() => generateSecret(3, 2, () => 0)).toThrow(RangeError);
    });
  });
});
