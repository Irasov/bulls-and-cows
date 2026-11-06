import { describe, it, expect } from 'vitest';
import { formatDuration } from './format.js';

describe('formatDuration', () => {
  it.each([
    [0, '00:00'],
    [999, '00:00'],
    [1000, '00:01'],
    [5000, '00:05'],
    [65000, '01:05'],
    [600000, '10:00'],
    [3599999, '59:59'],
    [3600000, '60:00'],
  ])('%i ms -> %s', (ms, expected) => {
    expect(formatDuration(ms)).toBe(expected);
  });

  it('treats negative values as zero', () => {
    expect(formatDuration(-500)).toBe('00:00');
  });
});
