export const TOP_LIMIT = 10;
const sameSettings = (settings) => (entry) => entry.length === settings.length && entry.base === settings.base;
const compareScores = (a, b) => a.attempts - b.attempts || a.timeMs - b.timeMs || a.playedAt - b.playedAt;
const sorted = (board) => [...board].sort(compareScores);
export const getTopScores = (board, settings) => sorted(board.filter(sameSettings(settings)));
export const addScore = (board, entry, limit = TOP_LIMIT) => {
    const isSame = sameSettings(entry);
    const others = board.filter((e) => !isSame(e));
    const top = sorted([...board.filter(isSame), entry]).slice(0, limit);
    return [...others, ...top];
};
export const serializeScores = (board) => JSON.stringify(board);
const isScoreEntry = (value) => {
    if (typeof value !== 'object' || value === null)
        return false;
    const record = value;
    return ['length', 'base', 'attempts', 'timeMs', 'playedAt'].every((key) => typeof record[key] === 'number' && Number.isFinite(record[key]));
};
export const parseScores = (raw) => {
    if (raw === null)
        return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter(isScoreEntry) : [];
    }
    catch {
        return [];
    }
};
