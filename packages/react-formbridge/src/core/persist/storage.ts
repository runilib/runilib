/**
 * react-formbridge — Storage Adapters
 * ──────────────────────────────
 * Unified storage interface across:
 *   - web localStorage
 *   - web sessionStorage
 *   - React Native AsyncStorage
 *   - Custom adapter (bring your own)
 */

// ─── Interface ────────────────────────────────────────────────────────────────

export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

// ─── Web adapters ─────────────────────────────────────────────────────────────

function wrapSyncStorage(storage: Storage): StorageAdapter {
  return {
    getItem: async (key) => storage.getItem(key),
    setItem: async (key, value) => storage.setItem(key, value),
    removeItem: async (key) => storage.removeItem(key),
  };
}

export const localStorageAdapter: StorageAdapter = globalThis.window
  ? wrapSyncStorage(globalThis.window.localStorage)
  : nullAdapter();

export const sessionStorageAdapter: StorageAdapter = globalThis.window
  ? wrapSyncStorage(globalThis.window.sessionStorage)
  : nullAdapter();

// ─── React Native AsyncStorage adapter ───────────────────────────────────────

/**
 * Lazily loads @react-native-async-storage/async-storage or
 * the built-in AsyncStorage from 'react-native' (older RN).
 * Does NOT crash if neither is installed.
 */
export const asyncStorageAdapter: StorageAdapter = {
  async getItem(key) {
    try {
      const AS = requireAsyncStorage();
      return AS.getItem(key);
    } catch {
      return null;
    }
  },
  async setItem(key, value) {
    try {
      (await requireAsyncStorage()).setItem(key, value);
    } catch {
      /* silent */
    }
  },
  async removeItem(key) {
    try {
      (await requireAsyncStorage()).removeItem(key);
    } catch {
      /* silent */
    }
  },
};

function requireAsyncStorage() {
  try {
    return require('@react-native-async-storage/async-storage').default;
  } catch {
    try {
      return require('react-native').AsyncStorage;
    } catch {
      throw new Error(
        '[@runilib/react-formbridge] persist with storage:"async" requires ' +
          '@react-native-async-storage/async-storage. ' +
          'Run: npx expo install @react-native-async-storage/async-storage',
      );
    }
  }
}

// ─── Null adapter (SSR / test fallback) ──────────────────────────────────────
function nullAdapter(): StorageAdapter {
  return {
    getItem: async () => null,
    setItem: async () => {},
    removeItem: async () => {},
  };
}

// ─── Resolve adapter from string ─────────────────────────────────────────────
export type StorageType = 'local' | 'session' | 'async' | StorageAdapter;

export function resolveAdapter(storage: StorageType): StorageAdapter {
  if (storage === 'local') return localStorageAdapter;
  if (storage === 'session') return sessionStorageAdapter;
  if (storage === 'async') return asyncStorageAdapter;
  return storage; // custom adapter
}
