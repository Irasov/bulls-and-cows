import { parseScores, serializeScores, type ScoreBoard } from './scores.js';

const SCORES_KEY = 'bulls-and-cows:scores';

export const loadScores = (): ScoreBoard => {
  try {
    return parseScores(localStorage.getItem(SCORES_KEY));
  } catch {
    return [];
  }
};

export const saveScores = (board: ScoreBoard): void => {
  try {
    localStorage.setItem(SCORES_KEY, serializeScores(board));
  } catch {
    //
  }
};
