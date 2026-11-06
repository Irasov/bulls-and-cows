import { describe, it, expect } from 'vitest';
import { sanitizeInput } from './input.js';

describe('sanitizeInput', () => {
  it('keeps valid digits as they are', () => {
    expect(sanitizeInput('1234', 10, 4)).toBe('1234');
  });

  it('returns an empty string for empty input', () => {
    expect(sanitizeInput('', 10, 4)).toBe('');
  });

  it.each([
    ['12a4', 10, '124'],
    ['1 2-3', 10, '123'],
    ['129', 8, '12'],
    ['102', 2, '10'],
    ['abc', 10, ''],
  ])(
    'drops characters outside the base: %j (base %i) -> %j',
    (raw, base, expected) => {
      expect(sanitizeInput(raw, base, 6)).toBe(expected);
    },
  );

  it('accepts uppercase hex and converts it to lowercase', () => {
    expect(sanitizeInput('A1F', 16, 4)).toBe('a1f');
  });

  it('rejects letters beyond f in hex', () => {
    expect(sanitizeInput('1gz', 16, 4)).toBe('1');
  });

  it('removes repeated characters and keeps the first occurrence', () => {
    expect(sanitizeInput('1123', 10, 4)).toBe('123');
    expect(sanitizeInput('aA1', 16, 4)).toBe('a1');
  });

  it('truncates to the secret length', () => {
    expect(sanitizeInput('123456', 10, 4)).toBe('1234');
  });

  it('removes repeats before truncating', () => {
    expect(sanitizeInput('1123', 10, 3)).toBe('123');
  });
});
