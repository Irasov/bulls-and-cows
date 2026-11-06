import { el } from '../dom.js';
import { formatDuration } from '../format.js';
import { getAttempts, getElapsedMs } from '../game.js';
import { sanitizeInput } from '../input.js';
import { renderScoreTable } from './scoreTable.js';
export const renderGameScreen = ({ game, message, scores, onGuess, onNewGame, }) => {
    const { length, base } = game.settings;
    const won = game.status === 'won';
    const input = el('input', {
        type: 'text',
        className: 'guess-input',
        placeholder: '•'.repeat(length),
        autocomplete: 'off',
        disabled: won,
        oninput: () => {
            input.value = sanitizeInput(input.value, base, length);
        },
    });
    const form = el('form', {
        className: 'guess-form',
        onsubmit: (event) => {
            event.preventDefault();
            onGuess(input.value);
        },
    }, input, el('button', { type: 'submit', textContent: 'Угадать', disabled: won }));
    const history = el('ol', { className: 'history' }, ...game.history.map((entry) => el('li', {}, el('span', { className: 'guess', textContent: entry.guess }), ` — bulls: ${entry.bulls}, cows: ${entry.cows}`)));
    const result = el('div', { className: 'result' }, el('h2', { textContent: 'Победа!' }), el('p', {
        textContent: `Попыток: ${getAttempts(game)}, время: ${formatDuration(getElapsedMs(game, game.finishedAt ?? game.startedAt))}`,
    }), renderScoreTable(scores, game.settings));
    return el('section', { className: 'screen game' }, el('h1', { textContent: 'Bulls and Cows' }), el('p', {
        className: 'info',
        textContent: `Угадайте число: ${length} разных цифр, основание ${base}`,
    }), form, el('p', {
        className: 'message',
        role: 'alert',
        textContent: message ?? '',
    }), history, ...(won ? [result] : []), el('button', {
        type: 'button',
        textContent: 'Новая игра',
        onclick: onNewGame,
    }));
};
