import { mount } from './dom.js';
import {
  createGame,
  getAttempts,
  getElapsedMs,
  submitGuess,
  type GameState,
  type Settings,
  type SubmitResult,
} from './game.js';
import { generateSecret } from './generateSecret.js';
import { renderGameScreen } from './screens/gameScreen.js';
import { renderSettingsScreen } from './screens/settingsScreen.js';
import { addScore, type ScoreBoard, type ScoreEntry } from './scores.js';
import { loadScores, saveScores } from './storage.js';

type View =
  | { readonly screen: 'settings'; readonly settings: Settings }
  | {
      readonly screen: 'game';
      readonly game: GameState;
      readonly message: string | null;
    };

type AppState = { readonly scores: ScoreBoard; readonly view: View };

const DEFAULT_SETTINGS: Settings = { length: 4, base: 10 };

type FailureReason = Extract<SubmitResult, { ok: false }>['reason'];

const describeFailure = (
  reason: FailureReason,
  { length, base }: Settings,
): string =>
  ({
    invalid: `Введите ${length} разных символов (основание ${base})`,
    duplicate: 'Такая попытка уже была',
    finished: 'Игра уже окончена',
  })[reason];

const toScoreEntry = (game: GameState): ScoreEntry => {
  const finishedAt = game.finishedAt ?? game.startedAt;

  return {
    length: game.settings.length,
    base: game.settings.base,
    attempts: getAttempts(game),
    timeMs: getElapsedMs(game, finishedAt),
    playedAt: finishedAt,
  };
};

export const startApp = (root: HTMLElement): void => {
  const render = (state: AppState): void => {
    const { view, scores } = state;

    const showSettings = (settings: Settings): void =>
      render({ scores, view: { screen: 'settings', settings } });

    const startGame = (settings: Settings): void =>
      render({
        scores,
        view: {
          screen: 'game',
          message: null,
          game: createGame(
            settings,
            generateSecret(settings.length, settings.base),
            Date.now(),
          ),
        },
      });

    if (view.screen === 'settings') {
      mount(
        root,
        renderSettingsScreen(view.settings, scores, showSettings, startGame),
      );
      return;
    }

    const { game } = view;

    const makeGuess = (guess: string): void => {
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
      const updated =
        next.status === 'won' ? addScore(scores, toScoreEntry(next)) : scores;

      if (updated !== scores) saveScores(updated);

      render({
        scores: updated,
        view: { screen: 'game', game: next, message: null },
      });
    };

    mount(
      root,
      renderGameScreen({
        game,
        message: view.message,
        scores,
        onGuess: makeGuess,
        onNewGame: () => showSettings(game.settings),
      }),
    );
    root.querySelector<HTMLInputElement>('.guess-input')?.focus();
  };

  render({
    scores: loadScores(),
    view: { screen: 'settings', settings: DEFAULT_SETTINGS },
  });
};
