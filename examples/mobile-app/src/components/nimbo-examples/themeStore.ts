import { createStore } from '@runilib/nimbo';

export type ThemeMode = 'light' | 'dark' | 'sepia';

const ACCENTS: Record<ThemeMode, string> = {
  light: '#2563eb',
  dark: '#a855f7',
  sepia: '#b45309',
};

export const themeStore = createStore('demo:theme', {
  state: () => ({
    mode: 'light' as ThemeMode,
    fontScale: 1,
  }),
  actions: ({ patch, set }) => ({
    setMode(mode: ThemeMode) {
      patch({ mode });
    },
    bigger() {
      patch((state) => ({
        fontScale: Math.min(1.4, Number((state.fontScale + 0.1).toFixed(2))),
      }));
    },
    smaller() {
      patch((state) => ({
        fontScale: Math.max(0.8, Number((state.fontScale - 0.1).toFixed(2))),
      }));
    },
    reset() {
      set({ mode: 'light', fontScale: 1 });
    },
  }),
  views: {
    accent: (state) => ACCENTS[state.mode],
    label: (state) =>
      `${state.mode.charAt(0).toUpperCase()}${state.mode.slice(1)} · ${state.fontScale.toFixed(1)}x`,
  },
});
