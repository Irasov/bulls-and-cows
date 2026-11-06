import { el, mount } from './dom.js';
import { createGame, type GameState, type Settings } from './game.js';
import { generateSecret } from './generateSecret.js';
import { renderSettingsScreen } from './screens/settingsScreen.js';

type AppState =
  | { readonly screen: 'settings'; readonly settings: Settings }
  | { readonly screen: 'game'; readonly game: GameState };

const DEFAULT_SETTINGS: Settings = { length: 4, base: 10 };

export const startApp = (root: HTMLElement): void => {
  const render = (state: AppState): void => {
    const startGame = (settings: Settings): void =>
      render({
        screen: 'game',
        game: createGame(
          settings,
          generateSecret(settings.length, settings.base),
          Date.now(),
        ),
      });

    const showSettings = (settings: Settings): void =>
      render({ screen: 'settings', settings });

    mount(
      root,
      state.screen === 'settings'
        ? renderSettingsScreen(state.settings, showSettings, startGame)
        : el(
            'section',
            { className: 'screen game' },
            el('p', {
              textContent: `Игра началась: длина ${state.game.settings.length}, основание ${state.game.settings.base}`,
            }),
            el('button', {
              type: 'button',
              textContent: 'Новая игра',
              onclick: () => showSettings(state.game.settings),
            }),
          ),
    );
  };

  render({ screen: 'settings', settings: DEFAULT_SETTINGS });
};
