import type {
  ActionContext,
  EffectCleanup,
  EffectContext,
  EffectFactory,
  EffectMap,
  ListenerTypeAlias,
} from '../types';
import type { StateContainer } from './state';

/**
 * Runtime controller for store effects.
 *
 * Effects are intentionally outside React: creating a store starts them, and
 * stopping the store instance tears down watchers/background work through the
 * collected cleanup functions.
 */
export function createEffectController<TState, TEffects extends EffectMap>(
  factory: EffectFactory<TState, TEffects> | undefined,
  context: ActionContext<TState>,
  container: StateContainer<TState>,
  scope: ListenerTypeAlias | null,
) {
  let running = false;
  let cleanups: EffectCleanup[] = [];
  const cleanupSet = new Set<EffectCleanup>();

  const addCleanup = (cleanup: EffectCleanup) => {
    if (!cleanupSet.has(cleanup)) {
      cleanupSet.add(cleanup);
      cleanups.push(cleanup);
    }

    return cleanup;
  };

  const removeCleanup = (cleanup: EffectCleanup) => {
    cleanupSet.delete(cleanup);
    cleanups = cleanups.filter((currentCleanup) => currentCleanup !== cleanup);
  };

  const watch: EffectContext<TState>['watch'] = (selector, callback, options) => {
    let selected = selector(container.getState());
    let currentCallbackCleanup: EffectCleanup | undefined;
    let debounceTimer: ReturnType<typeof setTimeout> | undefined;
    let throttleTimer: ReturnType<typeof setTimeout> | undefined;
    let throttlePreviousSelected: typeof selected | undefined;
    let lastRunAt = Number.NEGATIVE_INFINITY;
    let unsubscribed = false;
    let cleanup: EffectCleanup = () => {};
    const equality = options?.equality ?? Object.is;
    const debounceMs =
      options?.debounce === undefined ? undefined : Math.max(0, options.debounce);
    const throttleMs =
      options?.throttle === undefined ? undefined : Math.max(0, options.throttle);

    const reportError = (error: unknown) => {
      if (options?.onError) {
        options.onError(error);
        return;
      }

      throw error;
    };

    const runCallbackCleanup = () => {
      if (!currentCallbackCleanup) {
        return;
      }

      try {
        currentCallbackCleanup();
      } catch (error) {
        reportError(error);
      } finally {
        currentCallbackCleanup = undefined;
      }
    };

    const runCallback = (
      nextSelected: typeof selected,
      previousSelected: typeof selected,
    ) => {
      if (unsubscribed) {
        return;
      }

      runCallbackCleanup();

      try {
        const nextCleanup = callback(
          nextSelected,
          previousSelected,
          container.getState(),
        );

        currentCallbackCleanup =
          typeof nextCleanup === 'function' ? nextCleanup : undefined;
        lastRunAt = Date.now();
      } catch (error) {
        reportError(error);
      }

      if (options?.once) {
        cleanup();
      }
    };

    const scheduleCallback = (
      nextSelected: typeof selected,
      previousSelected: typeof selected,
    ) => {
      if (debounceMs !== undefined) {
        if (debounceTimer !== undefined) {
          clearTimeout(debounceTimer);
        }

        debounceTimer = setTimeout(() => {
          debounceTimer = undefined;
          runCallback(nextSelected, previousSelected);
        }, debounceMs);

        return;
      }

      if (throttleMs !== undefined) {
        const elapsed = Date.now() - lastRunAt;

        if (elapsed >= throttleMs) {
          if (throttleTimer !== undefined) {
            clearTimeout(throttleTimer);
            throttleTimer = undefined;
            throttlePreviousSelected = undefined;
          }

          runCallback(nextSelected, previousSelected);
          return;
        }

        throttlePreviousSelected ??= previousSelected;

        if (throttleTimer !== undefined) {
          return;
        }

        throttleTimer = setTimeout(() => {
          throttleTimer = undefined;
          const trailingPreviousSelected = throttlePreviousSelected ?? previousSelected;
          throttlePreviousSelected = undefined;
          runCallback(selected, trailingPreviousSelected);
        }, throttleMs - elapsed);

        return;
      }

      runCallback(nextSelected, previousSelected);
    };

    const unsubscribe = container.subscribe(() => {
      const previousSelected = selected;
      const nextSelected = selector(container.getState());

      if (equality(previousSelected, nextSelected)) {
        return;
      }

      selected = nextSelected;
      scheduleCallback(nextSelected, previousSelected);
    });

    cleanup = addCleanup(() => {
      if (unsubscribed) {
        return;
      }

      unsubscribed = true;
      if (debounceTimer !== undefined) {
        clearTimeout(debounceTimer);
        debounceTimer = undefined;
      }
      if (throttleTimer !== undefined) {
        clearTimeout(throttleTimer);
        throttleTimer = undefined;
      }
      unsubscribe();
      runCallbackCleanup();
      removeCleanup(cleanup);
    });

    if (options?.immediate) {
      runCallback(selected, selected);
    }

    return cleanup;
  };

  const effectContext: EffectContext<TState> = {
    ...context,
    scope,
    watch,
  };

  const start = () => {
    if (running || !factory) {
      return;
    }

    running = true;
    const effects = factory(effectContext);

    for (const effect of Object.values(effects)) {
      const cleanup = effect();

      if (typeof cleanup === 'function') {
        addCleanup(cleanup);
      }
    }
  };

  const stop = () => {
    if (!running) {
      return;
    }

    running = false;
    const cleanupsToRun = [...cleanups].reverse();
    cleanups = [];
    cleanupSet.clear();

    for (const cleanup of cleanupsToRun) {
      cleanup();
    }
  };

  return { start, stop };
}
