import type { Settings } from './game.js';

export const TOP_LIMIT = 10;

export type ScoreEntry = {
  readonly length: number;
  readonly base: number;
  readonly attempts: number;
  readonly timeMs: number;
  readonly playedAt: number;
};

export type ScoreBoard = readonly ScoreEntry[];

const sameSettings =
  (settings: Settings) =>
  (entry: ScoreEntry): boolean =>
    entry.length === settings.length && entry.base === settings.base;

const compareScores = (a: ScoreEntry, b: ScoreEntry): number =>
  a.attempts - b.attempts || a.timeMs - b.timeMs || a.playedAt - b.playedAt;

const sorted = (board: ScoreBoard): ScoreBoard =>
  [...board].sort(compareScores);

export const getTopScores = (
  board: ScoreBoard,
  settings: Settings,
): ScoreBoard => sorted(board.filter(sameSettings(settings)));

export const addScore = (
  board: ScoreBoard,
  entry: ScoreEntry,
  limit: number = TOP_LIMIT,
): ScoreBoard => {
  const isSame = sameSettings(entry);
  const others = board.filter((e) => !isSame(e));
  const top = sorted([...board.filter(isSame), entry]).slice(0, limit);

  return [...others, ...top];
};

export const serializeScores = (board: ScoreBoard): string =>
  JSON.stringify(board);

const isScoreEntry = (value: unknown): value is ScoreEntry => {
  if (typeof value !== 'object' || value === null) return false;

  const record = value as Record<string, unknown>;

  return ['length', 'base', 'attempts', 'timeMs', 'playedAt'].every(
    (key) => typeof record[key] === 'number' && Number.isFinite(record[key]),
  );
};

export const parseScores = (raw: string | null): ScoreBoard => {
  if (raw === null) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isScoreEntry) : [];
  } catch {
    return [];
  }
};
