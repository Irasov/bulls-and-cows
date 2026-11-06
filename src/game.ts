import { evaluateGuess, type GuessResult } from './evaluateGuess.js';
import { isValidGuess } from './isValidGuess.js';

export const MIN_LENGTH = 2;
export const MAX_LENGTH = 6;

export type Settings = {
  readonly length: number;
  readonly base: number;
};

export type HistoryEntry = GuessResult & { readonly guess: string };

export type GameState = {
  readonly settings: Settings;
  readonly secret: string;
  readonly history: readonly HistoryEntry[];
  readonly status: 'playing' | 'won';
  readonly startedAt: number;
  readonly finishedAt: number | null;
};

export type SubmitResult =
  | { readonly ok: true; readonly state: GameState }
  | {
      readonly ok: false;
      readonly reason: 'invalid' | 'duplicate' | 'finished';
    };

export const createGame = (
  settings: Settings,
  secret: string,
  startedAt: number,
): GameState => ({
  settings,
  secret,
  history: [],
  status: 'playing',
  startedAt,
  finishedAt: null,
});

export const submitGuess = (
  state: GameState,
  guess: string,
  now: number,
): SubmitResult => {
  const normalized = guess.toLowerCase();
  const { length, base } = state.settings;

  if (state.status === 'won') {
    return { ok: false, reason: 'finished' };
  }
  if (!isValidGuess(normalized, length, base)) {
    return { ok: false, reason: 'invalid' };
  }
  if (state.history.some((entry) => entry.guess === normalized)) {
    return { ok: false, reason: 'duplicate' };
  }

  const entry: HistoryEntry = {
    guess: normalized,
    ...evaluateGuess(state.secret, normalized),
  };
  const won = entry.bulls === length;

  return {
    ok: true,
    state: {
      ...state,
      history: [...state.history, entry],
      status: won ? 'won' : 'playing',
      finishedAt: won ? now : null,
    },
  };
};

export const getAttempts = (state: GameState): number => state.history.length;

export const getElapsedMs = (state: GameState, now: number): number =>
  (state.finishedAt ?? now) - state.startedAt;

export const getAvailableLengths = (base: number): readonly number[] =>
  Array.from(
    { length: MAX_LENGTH - MIN_LENGTH + 1 },
    (_, i) => MIN_LENGTH + i,
  ).filter((length) => length <= base);
