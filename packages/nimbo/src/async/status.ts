import type { NimboAsyncStatus, NimboListener } from '../types';

export type NimboAsyncStatusRegistry = {
  getStatus: (name: string) => NimboAsyncStatus;
  getAnyPending: () => boolean;
  setPending: (name: string, pending: boolean) => void;
  setError: (name: string, error: unknown | null) => void;
  setResult: (name: string, result: unknown) => void;
  clearError: (name?: string) => void;
  subscribe: (listener: NimboListener) => () => void;
};

export function createAsyncStatusRegistry(): NimboAsyncStatusRegistry {
  const statuses = new Map<string, NimboAsyncStatus>();
  const listeners = new Set<NimboListener>();

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

    const status: NimboAsyncStatus = {
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
