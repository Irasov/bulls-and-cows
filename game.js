import { evaluateGuess } from './evaluateGuess.js';
import { isValidGuess } from './isValidGuess.js';
export const MIN_LENGTH = 2;
export const MAX_LENGTH = 6;
export const createGame = (settings, secret, startedAt) => ({
    settings,
    secret,
    history: [],
    status: 'playing',
    startedAt,
    finishedAt: null,
});
export const submitGuess = (state, guess, now) => {
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
    const entry = {
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
export const getAttempts = (state) => state.history.length;
export const getElapsedMs = (state, now) => (state.finishedAt ?? now) - state.startedAt;
export const getAvailableLengths = (base) => Array.from({ length: MAX_LENGTH - MIN_LENGTH + 1 }, (_, i) => MIN_LENGTH + i).filter((length) => length <= base);
