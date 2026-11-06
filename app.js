import { mount } from './dom.js';
import { createGame, getAttempts, getElapsedMs, submitGuess, } from './game.js';
import { generateSecret } from './generateSecret.js';
import { renderGameScreen } from './screens/gameScreen.js';
import { renderSettingsScreen } from './screens/settingsScreen.js';
import { addScore } from './scores.js';
import { loadScores, saveScores } from './storage.js';
const DEFAULT_SETTINGS = { length: 4, base: 10 };
const describeFailure = (reason, { length, base }) => ({
    invalid: `Введите ${length} разных символов (основание ${base})`,
    duplicate: 'Такая попытка уже была',
    finished: 'Игра уже окончена',
})[reason];
const toScoreEntry = (game) => {
    const finishedAt = game.finishedAt ?? game.startedAt;
    return {
        length: game.settings.length,
        base: game.settings.base,
        attempts: getAttempts(game),
        timeMs: getElapsedMs(game, finishedAt),
        playedAt: finishedAt,
    };
};
export const startApp = (root) => {
    const render = (state) => {
        const { view, scores } = state;
        const showSettings = (settings) => render({ scores, view: { screen: 'settings', settings } });
        const startGame = (settings) => render({
            scores,
            view: {
                screen: 'game',
                message: null,
                game: createGame(settings, generateSecret(settings.length, settings.base), Date.now()),
            },
        });
        if (view.screen === 'settings') {
            mount(root, renderSettingsScreen(view.settings, scores, showSettings, startGame));
            return;
        }
        const { game } = view;
        const makeGuess = (guess) => {
            const result = submitGuess(game, guess, Date.now());
            if (!result.ok) {
                render({
                    scores,
                    view: {
                        screen: 'game',
                        game,
                        message: describeFailure(result.reason, game.settings),
                    },
                });
                return;
            }
            const next = result.state;
            const updated = next.status === 'won' ? addScore(scores, toScoreEntry(next)) : scores;
            if (updated !== scores)
                saveScores(updated);
            render({
                scores: updated,
                view: { screen: 'game', game: next, message: null },
            });
        };
        mount(root, renderGameScreen({
            game,
            message: view.message,
            scores,
            onGuess: makeGuess,
            onNewGame: () => showSettings(game.settings),
        }));
        root.querySelector('.guess-input')?.focus();
    };
    render({
        scores: loadScores(),
        view: { screen: 'settings', settings: DEFAULT_SETTINGS },
    });
};
