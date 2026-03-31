import { useCallback, useEffect, useMemo, useState } from 'react';

import type { StorageAdapter, StorageType } from './storage';
import { resolveAdapter } from './storage';

export interface PersistOptions {
  key: string;
  storage?: StorageType;
  ttl?: number;
  exclude?: string[];
  debounce?: number;
  onRestore?: (values: Record<string, unknown>) => void;
  onSaveError?: (error: unknown) => void;
  version?: string;
}

interface DraftEnvelope {
  values: Record<string, unknown>;
  savedAt: number;
  ttl: number;
  version: string;
}

const PREFIX = 'formura:';

export class DraftManager {
  private readonly adapter: StorageAdapter;
  private readonly storageKey: string;
  private readonly ttl: number;
  private readonly exclude: Set<string>;
  private readonly version: string;
  private readonly debounce: number;
  private readonly onRestore?: (v: Record<string, unknown>) => void;
  private readonly onSaveError?: (e: unknown) => void;
  private _timer: ReturnType<typeof setTimeout> | null = null;
  private _ready = false;

  constructor(opts: PersistOptions) {
    this.adapter = resolveAdapter(opts.storage ?? 'local');
    this.storageKey = PREFIX + opts.key;
    this.ttl = opts.ttl ?? 3600;
    this.exclude = new Set(opts.exclude ?? []);
    this.version = opts.version ?? '1';
    this.debounce = opts.debounce ?? 800;
    this.onRestore = opts.onRestore;
    this.onSaveError = opts.onSaveError;
  }

  async load(): Promise<Record<string, unknown> | null> {
    try {
      const raw = await this.adapter.getItem(this.storageKey);
      if (!raw) return null;

      const envelope: DraftEnvelope = JSON.parse(raw);

      if (envelope.version !== this.version) {
        await this.clear();
        return null;
      }

      if (envelope.ttl > 0) {
        const ageMs = Date.now() - envelope.savedAt;
        const ttlMs = envelope.ttl * 1000;

        if (ageMs > ttlMs) {
          await this.clear();
          return null;
        }
      }

      this._ready = true;
      this.onRestore?.(envelope.values);
      return envelope.values;
    } catch {
      return null;
    }
  }

  save(values: Record<string, unknown>): void {
    if (this._timer) clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      void this._write(values);
    }, this.debounce);
  }

  async saveNow(values: Record<string, unknown>): Promise<void> {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }

    await this._write(values);
  }

  async clear(): Promise<void> {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }

    try {
      await this.adapter.removeItem(this.storageKey);
    } catch {
      // noop
    }
  }

  get hasRestoredDraft(): boolean {
    return this._ready;
  }

  private async _write(rawValues: Record<string, unknown>): Promise<void> {
    const values: Record<string, unknown> = {};

    for (const [k, v] of Object.entries(rawValues)) {
      if (!this.exclude.has(k)) {
        values[k] = v;
      }
    }

    const envelope: DraftEnvelope = {
      values,
      savedAt: Date.now(),
      ttl: this.ttl,
      version: this.version,
    };

    try {
      await this.adapter.setItem(this.storageKey, JSON.stringify(envelope));
    } catch (err) {
      this.onSaveError?.(err);
    }
  }
}

export interface UsePersistReturn {
  isLoading: boolean;
  hasDraft: boolean;
  draftValues: Record<string, unknown> | null;
  clearDraft: () => Promise<void>;
  saveDraftNow: () => Promise<void>;
}

export function usePersist(
  opts: PersistOptions | undefined,
  getValues: () => Record<string, unknown>,
): UsePersistReturn & {
  manager: DraftManager | null;
  save: (v: Record<string, unknown>) => void;
} {
  // biome-ignore lint/correctness/useExhaustiveDependencies: FIX THIS
  const manager = useMemo(() => {
    if (!opts) return null;
    return new DraftManager(opts);
  }, [
    opts?.key,
    opts?.storage,
    opts?.ttl,
    opts?.debounce,
    opts?.version,
    JSON.stringify(opts?.exclude ?? []),
  ]);

  const [isLoading, setIsLoading] = useState(Boolean(manager));
  const [hasDraft, setHasDraft] = useState(false);
  const [draftValues, setDraftValues] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!manager) {
      setIsLoading(false);
      setHasDraft(false);
      setDraftValues(null);
      return;
    }

    setIsLoading(true);

    void manager.load().then((values) => {
      if (cancelled) return;

      if (values) {
        setDraftValues(values);
        setHasDraft(true);
      } else {
        setDraftValues(null);
        setHasDraft(false);
      }

      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [manager]);

  const save = useCallback(
    (values: Record<string, unknown>) => {
      manager?.save(values);
    },
    [manager],
  );

  const clearDraft = useCallback(async () => {
    await manager?.clear();
    setHasDraft(false);
    setDraftValues(null);
  }, [manager]);

  const saveDraftNow = useCallback(async () => {
    if (!manager) return;
    await manager.saveNow(getValues());
  }, [manager, getValues]);

  return {
    isLoading,
    hasDraft,
    draftValues,
    clearDraft,
    saveDraftNow,
    manager,
    save,
  };
}
