import { el } from '../dom.js';
import { getAvailableLengths } from '../game.js';
import { ALL_LENGTHS, BASES, resolveLength } from '../settings.js';
import { renderScoreTable } from './scoreTable.js';
const valueOf = (event) => Number(event.currentTarget.value);
export const renderSettingsScreen = (settings, scores, onChange, onStart) => {
    const available = getAvailableLengths(settings.base);
    const baseSelect = el('select', {
        id: 'base',
        onchange: (event) => {
            const base = valueOf(event);
            onChange({ base, length: resolveLength(settings.length, base) });
        },
    }, ...BASES.map(({ value, label }) => el('option', {
        value: String(value),
        textContent: label,
        selected: value === settings.base,
    })));
    const lengthSelect = el('select', {
        id: 'length',
        onchange: (event) => onChange({ ...settings, length: valueOf(event) }),
    }, ...ALL_LENGTHS.map((length) => el('option', {
        value: String(length),
        textContent: String(length),
        selected: length === settings.length,
        disabled: !available.includes(length),
    })));
    return el('section', { className: 'screen settings' }, el('h1', { textContent: 'Bulls and Cows' }), el('label', { htmlFor: 'base' }, 'Система счисления'), baseSelect, el('label', { htmlFor: 'length' }, 'Длина числа'), lengthSelect, el('button', {
        type: 'button',
        textContent: 'Старт',
        onclick: () => onStart(settings),
    }), renderScoreTable(scores, settings));
};
