import { parseScores, serializeScores } from './scores.js';
const SCORES_KEY = 'bulls-and-cows:scores';
export const loadScores = () => {
    try {
        return parseScores(localStorage.getItem(SCORES_KEY));
    }
    catch {
        return [];
    }
};
export const saveScores = (board) => {
    try {
        localStorage.setItem(SCORES_KEY, serializeScores(board));
    }
    catch {
        //
    }
};
