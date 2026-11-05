import { describe, it, expect } from 'vitest';
import { evaluateGuess } from './evaluateGuess.js';

describe('evaluateGuess', () => {
  describe('decimal', () => {
    it.each([
      ['1234', '1234', 4, 0],
      ['1234', '4321', 0, 4],
      ['1234', '1243', 2, 2],
      ['1234', '2143', 0, 4],
      ['1234', '1256', 2, 0],
      ['1234', '2156', 0, 2],
      ['1234', '1567', 1, 0],
      ['1234', '5167', 0, 1],
      ['1234', '5678', 0, 0],
    ])(
      'secret %s, guess %s -> %i bulls, %i cows',
      (secret, guess, bulls, cows) => {
        expect(evaluateGuess(secret, guess)).toEqual({ bulls, cows });
      },
    );
  });

  describe('leading zeros', () => {
    it.each([
      ['0123', '0123', 4, 0],
      ['0123', '0132', 2, 2],
      ['0123', '1230', 0, 4],
      ['0123', '4567', 0, 0],
    ])(
      'secret %s, guess %s -> %i bulls, %i cows',
      (secret, guess, bulls, cows) => {
        expect(evaluateGuess(secret, guess)).toEqual({ bulls, cows });
      },
    );
  });

  describe('binary', () => {
    it.each([
      ['01', '01', 2, 0],
      ['01', '10', 0, 2],
    ])(
      'secret %s, guess %s -> %i bulls, %i cows',
      (secret, guess, bulls, cows) => {
        expect(evaluateGuess(secret, guess)).toEqual({ bulls, cows });
      },
    );
  });

  describe('hex is case-insensitive', () => {
    it.each([
      ['a1b2', 'a1b2', 4, 0],
      ['a1b2', 'A1B2', 4, 0],
      ['A1B2', 'a1b2', 4, 0],
      ['a1b2', 'B2A1', 0, 4],
      ['a1b2', 'A1F3', 2, 0],
    ])(
      'secret %s, guess %s -> %i bulls, %i cows',
      (secret, guess, bulls, cows) => {
        expect(evaluateGuess(secret, guess)).toEqual({ bulls, cows });
      },
    );
  });

  it('is pure: same input gives the same result', () => {
    expect(evaluateGuess('1234', '1243')).toEqual(
      evaluateGuess('1234', '1243'),
    );
  });

  it('returns a new object on every call', () => {
    expect(evaluateGuess('1234', '1234')).not.toBe(
      evaluateGuess('1234', '1234'),
    );
  });
});
