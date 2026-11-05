/* eslint-disable @typescript-eslint/no-unused-vars */
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

export const addScore = (
  board: ScoreBoard,
  entry: ScoreEntry,
  limit: number = TOP_LIMIT,
): ScoreBoard => {
  throw new Error('Not implemented: addScore');
};

export const getTopScores = (
  board: ScoreBoard,
  settings: Settings,
): ScoreBoard => {
  throw new Error('Not implemented: getTopScores');
};

export const serializeScores = (board: ScoreBoard): string => {
  throw new Error('Not implemented: serializeScores');
};

export const parseScores = (raw: string | null): ScoreBoard => {
  throw new Error('Not implemented: parseScores');
};
