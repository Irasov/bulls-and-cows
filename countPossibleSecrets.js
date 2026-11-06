import { memoize } from './memoize.js';
export const countPossibleSecrets = memoize((length, base) => {
    if (length === 0)
        return 1;
    if (length > base)
        return 0;
    return base * countPossibleSecrets(length - 1, base - 1);
});
