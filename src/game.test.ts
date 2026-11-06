import { describe, it, expect } from 'vitest';
import {
  createGame,
  submitGuess,
  getAttempts,
  getElapsedMs,
  getAvailableLengths,
  type GameState,
} from './game.js';

const settings = { length: 4, base: 10 };
const newGame = () => createGame(settings, '1234', 1000);

const submitOk = (state: GameState, guess: string, now = 2000): GameState => {
  const result = submitGuess(state, guess, now);
  if (!result.ok) throw new Error(`Expected ok, got ${result.reason}`);
  return result.state;
};

describe('createGame', () => {
  it('creates a game in the playing status with empty history', () => {
    expect(newGame()).toEqual({
      settings,
      secret: '1234',
      history: [],
      status: 'playing',
      startedAt: 1000,
      finishedAt: null,
    });
  });
});

describe('submitGuess', () => {
  describe('valid wrong guess', () => {
    it('adds an entry with bulls and cows to the history', () => {
      const next = submitOk(newGame(), '1243');

      expect(next.history).toEqual([{ guess: '1243', bulls: 2, cows: 2 }]);
      expect(next.status).toBe('playing');
      expect(next.finishedAt).toBeNull();
    });

    it('keeps entries in the order of attempts', () => {
      const first = submitOk(newGame(), '1243');
      const second = submitOk(first, '5678');

      expect(second.history.map((e) => e.guess)).toEqual(['1243', '5678']);
    });

    it('does not change previous entries', () => {
      const first = submitOk(newGame(), '1243');
      const second = submitOk(first, '5678');

      expect(second.history[0]).toBe(first.history[0]);
    });
  });

  describe('immutability', () => {
    it('does not mutate the previous state', () => {
      const before = newGame();
      const snapshot = structuredClone(before);

      submitOk(before, '1243');

      expect(before).toEqual(snapshot);
    });

    it('returns a new state and a new history array', () => {
      const before = newGame();
      const after = submitOk(before, '1243');

      expect(after).not.toBe(before);
      expect(after.history).not.toBe(before.history);
    });

    it('works with a deeply frozen state', () => {
      const frozen = Object.freeze({
        ...newGame(),
        history: Object.freeze([]),
      });

      expect(() => submitOk(frozen, '1243')).not.toThrow();
    });
  });

  describe('winning', () => {
    it('finishes the game when all digits are bulls', () => {
      const won = submitOk(newGame(), '1234', 5000);

      expect(won.status).toBe('won');
      expect(won.finishedAt).toBe(5000);
      expect(won.history).toEqual([{ guess: '1234', bulls: 4, cows: 0 }]);
    });

    it('rejects further guesses after the win', () => {
      const won = submitOk(newGame(), '1234');

      expect(submitGuess(won, '5678', 3000)).toEqual({
        ok: false,
        reason: 'finished',
      });
    });
  });

  describe('invalid guess', () => {
    it.each(['123', '12345', '1231', '12a4', '', '1 34'])(
      'rejects %j',
      (guess) => {
        expect(submitGuess(newGame(), guess, 2000)).toEqual({
          ok: false,
          reason: 'invalid',
        });
      },
    );
  });

  describe('duplicate guess', () => {
    it('rejects a guess that has already been made', () => {
      const first = submitOk(newGame(), '1243');

      expect(submitGuess(first, '1243', 3000)).toEqual({
        ok: false,
        reason: 'duplicate',
      });
    });
  });

  describe('hex', () => {
    const hexGame = () => createGame({ length: 4, base: 16 }, 'a1b2', 0);

    it('accepts uppercase and stores guesses in lowercase', () => {
      const next = submitOk(hexGame(), 'B2A1');

      expect(next.history[0]).toEqual({ guess: 'b2a1', bulls: 0, cows: 4 });
    });

    it('wins with an uppercase guess', () => {
      expect(submitOk(hexGame(), 'A1B2').status).toBe('won');
    });

    it('treats a different case of the same guess as a duplicate', () => {
      const first = submitOk(hexGame(), 'b2a1');

      expect(submitGuess(first, 'B2A1', 10)).toEqual({
        ok: false,
        reason: 'duplicate',
      });
    });
  });
});

describe('getAttempts', () => {
  it('is 0 for a new game', () => {
    expect(getAttempts(newGame())).toBe(0);
  });

  it('counts only accepted guesses', () => {
    const one = submitOk(newGame(), '1243');
    submitGuess(one, '1243', 3000);
    submitGuess(one, 'xxxx', 3000);

    expect(getAttempts(submitOk(one, '5678'))).toBe(2);
  });
});

describe('getElapsedMs', () => {
  it('uses the current time while the game is going', () => {
    expect(getElapsedMs(newGame(), 4500)).toBe(3500);
  });

  it('freezes at the finish time after the win', () => {
    const won = submitOk(newGame(), '1234', 5000);

    expect(getElapsedMs(won, 99999)).toBe(4000);
  });
});

describe('getAvailableLengths', () => {
  it('allows only length 2 for binary', () => {
    expect(getAvailableLengths(2)).toEqual([2]);
  });

  it.each([
    [3, [2, 3]],
    [4, [2, 3, 4]],
    [8, [2, 3, 4, 5, 6]],
    [10, [2, 3, 4, 5, 6]],
    [16, [2, 3, 4, 5, 6]],
  ])('for base %i returns %j', (base, expected) => {
    expect(getAvailableLengths(base)).toEqual(expected);
  });
});
