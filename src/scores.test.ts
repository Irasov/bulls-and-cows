import { describe, it, expect } from 'vitest';
import {
  addScore,
  getTopScores,
  serializeScores,
  parseScores,
  type ScoreEntry,
} from './scores.js';

const entry = (
  attempts: number,
  timeMs: number,
  overrides: Partial<ScoreEntry> = {},
): ScoreEntry => ({
  length: 4,
  base: 10,
  attempts,
  timeMs,
  playedAt: 0,
  ...overrides,
});

describe('addScore', () => {
  it('adds an entry to an empty board', () => {
    expect(addScore([], entry(5, 1000))).toEqual([entry(5, 1000)]);
  });

  it('does not mutate the original board', () => {
    const board = Object.freeze([entry(5, 1000)]);

    expect(() => addScore(board, entry(3, 500))).not.toThrow();
    expect(board).toEqual([entry(5, 1000)]);
  });

  it('returns a new array', () => {
    const board: readonly ScoreEntry[] = [entry(5, 1000)];

    expect(addScore(board, entry(3, 500))).not.toBe(board);
  });

  it('sorts by attempts, fewer is better', () => {
    const board = addScore([entry(7, 100)], entry(3, 900));

    expect(board.map((e) => e.attempts)).toEqual([3, 7]);
  });

  it('breaks ties by time, faster is better', () => {
    const board = addScore([entry(5, 2000)], entry(5, 1000));

    expect(board.map((e) => e.timeMs)).toEqual([1000, 2000]);
  });

  it('keeps the earlier entry first on a full tie', () => {
    const older = entry(5, 1000, { playedAt: 1 });
    const newer = entry(5, 1000, { playedAt: 2 });

    expect(addScore([older], newer)).toEqual([older, newer]);
  });

  describe('limit', () => {
    const full = Array.from({ length: 3 }, (_, i) => entry(i + 3, 1000));

    it('drops the worst entry when the limit is exceeded', () => {
      const board = addScore(full, entry(1, 1000), 3);

      expect(board.map((e) => e.attempts)).toEqual([1, 3, 4]);
    });

    it('does not add an entry that is worse than the whole top', () => {
      const board = addScore(full, entry(9, 1000), 3);

      expect(board.map((e) => e.attempts)).toEqual([3, 4, 5]);
    });

    it('keeps 10 entries by default', () => {
      const board = Array.from({ length: 12 }, (_, i) => i + 1).reduce<
        readonly ScoreEntry[]
      >((acc, n) => addScore(acc, entry(n, 1000)), []);

      expect(board).toHaveLength(10);
      expect(board[9]?.attempts).toBe(10);
    });
  });

  describe('different settings', () => {
    it('keeps a separate top for every length/base combination', () => {
      const dec = entry(5, 1000);
      const hex = entry(5, 1000, { base: 16 });

      const board = addScore([dec], hex);

      expect(board).toHaveLength(2);
    });

    it('applies the limit per combination, not across the whole board', () => {
      const hex = entry(9, 1000, { base: 16 });
      const board = addScore([hex], entry(1, 1000), 1);

      expect(board).toContainEqual(hex);
      expect(board).toContainEqual(entry(1, 1000));
    });
  });
});

describe('getTopScores', () => {
  const board = [
    entry(7, 100),
    entry(3, 900),
    entry(4, 100, { base: 16 }),
    entry(5, 100, { length: 5 }),
  ];

  it('returns only entries for the given settings', () => {
    expect(getTopScores(board, { length: 4, base: 10 })).toHaveLength(2);
  });

  it('returns them sorted from best to worst', () => {
    const top = getTopScores(board, { length: 4, base: 10 });

    expect(top.map((e) => e.attempts)).toEqual([3, 7]);
  });

  it('returns an empty list for settings without results', () => {
    expect(getTopScores(board, { length: 2, base: 2 })).toEqual([]);
  });
});

describe('serializeScores / parseScores', () => {
  it('restores the same board after a round trip', () => {
    const board = [entry(3, 900), entry(7, 100, { base: 16 })];

    expect(parseScores(serializeScores(board))).toEqual(board);
  });

  it('serializes an empty board to a parsable string', () => {
    expect(parseScores(serializeScores([]))).toEqual([]);
  });

  describe('broken storage content', () => {
    it.each([
      ['null (nothing saved yet)', null],
      ['empty string', ''],
      ['invalid JSON', '{oops'],
      ['an object instead of an array', '{"attempts":3}'],
      ['a number', '42'],
    ])('returns an empty board for %s', (_name, raw) => {
      expect(parseScores(raw)).toEqual([]);
    });

    it('drops malformed entries and keeps valid ones', () => {
      const good = entry(3, 900);
      const raw = JSON.stringify([
        good,
        { foo: 1 },
        null,
        'x',
        { ...good, attempts: 'many' },
      ]);

      expect(parseScores(raw)).toEqual([good]);
    });
  });
});
