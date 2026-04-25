import type { NimboViewFactory } from '../types';

export function readView<TState, TViews>(
  storeName: string,
  views: NimboViewFactory<TState, TViews> | undefined,
  state: TState,
  name: keyof TViews,
) {
  const view = views?.[name];

  if (!view) {
    throw new Error(`Nimbo view "${String(name)}" does not exist on "${storeName}".`);
  }

  return view(state);
}
