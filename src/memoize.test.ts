import { describe, it, expect, vi } from 'vitest';
import { memoize } from './memoize.js';

describe('memoize', () => {
  it('returns the same result as the original function', () => {
    const add = memoize((a: number, b: number) => a + b);

    expect(add(2, 3)).toBe(5);
  });

  it('calls the original function once for repeated calls with the same arguments', () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const memoized = memoize(fn);

    memoized(2, 3);
    memoized(2, 3);
    memoized(2, 3);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('calls the original function again for different arguments', () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const memoized = memoize(fn);

    memoized(2, 3);
    memoized(2, 4);

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('does not confuse the order of arguments', () => {
    const fn = vi.fn((a: number, b: number) => a - b);
    const memoized = memoize(fn);

    expect(memoized(5, 3)).toBe(2);
    expect(memoized(3, 5)).toBe(-2);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('caches falsy results too', () => {
    const fn = vi.fn((a: number) => a * 0);
    const memoized = memoize(fn);

    memoized(7);
    memoized(7);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('keeps caches of different memoized functions independent', () => {
    const double = memoize((n: number) => n * 2);
    const triple = memoize((n: number) => n * 3);

    expect(double(4)).toBe(8);
    expect(triple(4)).toBe(12);
  });
});
