import type { AsyncStatus, Listener } from '../types';

/**
 * Side-channel registry that tracks the live {@link AsyncStatus} of every
 * async action on a given store instance.
 *
 * It is intentionally separate from the main state container — async
 * lifecycle events (pending / error / result) should not pollute the user's
 * domain state, and this also keeps every `usePending` / `useError` /
 * `useResult` re-render isolated from changes to the actual application
 * state.
 *
 * Status entries are created lazily on first access (`ensureStatus`), so a
 * never-invoked action still has a sensible default snapshot to read.
 */
export type AsyncStatusRegistry = {
  /** Returns the live status of `name`, creating an empty entry on first access. */
  getStatus: (name: string) => AsyncStatus;

  /** True when at least one async action is currently in flight. */
  getAnyPending: () => boolean;

  /** Toggles the `pending` flag of `name` and notifies subscribers. */
  setPending: (name: string, pending: boolean) => void;

  /** Sets the last error of `name` (or clears it with `null`) and notifies subscribers. */
  setError: (name: string, error: unknown | null) => void;

  /** Sets the last resolved value of `name` and notifies subscribers. */
  setResult: (name: string, result: unknown) => void;

  /**
   * Clears the error of `name`. When called without a name, clears every
   * action's error in one batch and emits once.
   */
  clearError: (name?: string) => void;

  /** Subscribes to any status change, identical contract to {@link Listener}. */
  subscribe: (listener: Listener) => () => void;
};

/**
 * Builds a fresh, store-scoped {@link AsyncStatusRegistry}. Used internally
 * by {@link import('../createStore').createStore}; not part of the public
 * surface.
 */
export function createAsyncStatusRegistry(): AsyncStatusRegistry {
  const statuses = new Map<string, AsyncStatus>();
  const listeners = new Set<Listener>();

  const emit = () => {
    for (const listener of listeners) {
      listener();
    }
  };

  const ensureStatus = (name: string) => {
    const existingStatus = statuses.get(name);

    if (existingStatus) {
      return existingStatus;
    }

    const status: AsyncStatus = {
      pending: false,
      error: null,
      result: undefined,
    };

    statuses.set(name, status);

    return status;
  };

  return {
    getStatus(name) {
      return ensureStatus(name);
    },
    getAnyPending() {
      return Array.from(statuses.values()).some((status) => status.pending);
    },
    setPending(name, pending) {
      ensureStatus(name).pending = pending;
      emit();
    },
    setError(name, error) {
      ensureStatus(name).error = error;
      emit();
    },
    setResult(name, result) {
      ensureStatus(name).result = result;
      emit();
    },
    clearError(name) {
      if (name) {
        ensureStatus(name).error = null;
      } else {
        for (const status of statuses.values()) {
          status.error = null;
        }
      }

      emit();
    },
    subscribe(listener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
}
