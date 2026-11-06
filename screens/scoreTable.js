import { el } from '../dom.js';
import { formatDuration } from '../format.js';
import { getTopScores } from '../scores.js';
export const renderScoreTable = (scores, settings) => {
    const top = getTopScores(scores, settings);
    return el('section', { className: 'scores' }, el('h2', {
        textContent: `Рекорды (длина ${settings.length}, основание ${settings.base})`,
    }), top.length === 0
        ? el('p', { textContent: 'Пока нет результатов' })
        : el('ol', {}, ...top.map((entry) => el('li', {
            textContent: `${entry.attempts} поп. — ${formatDuration(entry.timeMs)}`,
        }))));
};
