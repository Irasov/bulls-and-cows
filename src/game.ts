/* eslint-disable @typescript-eslint/no-unused-vars */
import type { GuessResult } from './evaluateGuess.js';

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
): GameState => {
  throw new Error('Not implemented: createGame');
};

export const submitGuess = (
  state: GameState,
  guess: string,
  now: number,
): SubmitResult => {
  throw new Error('Not implemented: submitGuess');
};

export const getAttempts = (state: GameState): number => {
  throw new Error('Not implemented: getAttempts');
};

export const getElapsedMs = (state: GameState, now: number): number => {
  throw new Error('Not implemented: getElapsedMs');
};

export const getAvailableLengths = (base: number): readonly number[] => {
  throw new Error('Not implemented: getAvailableLengths');
};
