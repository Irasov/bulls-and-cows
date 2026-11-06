import { describe, it, expect } from 'vitest';
import { resolveLength } from './settings.js';

describe('resolveLength', () => {
  it.each([
    [2, 10, 2],
    [4, 10, 4],
    [6, 10, 6],
    [6, 16, 6],
    [3, 8, 3],
  ])(
    'keeps length %i when it is available in base %i',
    (length, base, expected) => {
      expect(resolveLength(length, base)).toBe(expected);
    },
  );

  it.each([
    [4, 2],
    [6, 2],
  ])('forces length 2 in binary for requested %i', (length, base) => {
    expect(resolveLength(length, base)).toBe(2);
    expect(base).toBe(2);
  });

  it('reduces length to the largest available one', () => {
    expect(resolveLength(6, 3)).toBe(3);
    expect(resolveLength(5, 4)).toBe(4);
  });
});
