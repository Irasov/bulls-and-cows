import { getAvailableLengths, MAX_LENGTH, MIN_LENGTH } from './game.js';

export const BASES = [
  { value: 2, label: 'bin (2)' },
  { value: 8, label: 'oct (8)' },
  { value: 10, label: 'dec (10)' },
  { value: 16, label: 'hex (16)' },
] as const;

export const ALL_LENGTHS: readonly number[] = Array.from(
  { length: MAX_LENGTH - MIN_LENGTH + 1 },
  (_, i) => MIN_LENGTH + i,
);

export const resolveLength = (length: number, base: number): number =>
  getAvailableLengths(base)
    .filter((available) => available <= length)
    .at(-1) ?? MIN_LENGTH;
