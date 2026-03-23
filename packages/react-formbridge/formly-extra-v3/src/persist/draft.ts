import { resolveAdapter } from './storage';
import type { StorageType, StorageAdapter } from './storage';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PersistOptions {
  /**
   * Unique key used to namespace this form's draft in storage.
   * @example 'signup-form' → stored as 'formura:signup-form'
   */
  key: string;

  /**
   * Storage backend.
   * - 'local'   → localStorage (web, survives tab close)
   * - 'session' → sessionStorage (web, cleared on tab close)
   * - 'async'   → AsyncStorage (React Native)
   * - StorageAdapter → bring your own (e.g. SecureStore, MMKV)
   * @default 'local'
   */
  storage?: StorageType;

  /**
   * Time-to-live in seconds. Draft is discarded after this duration.
   * Set to 0 for no expiry.
   * @default 3600 (1 hour)
   */
  ttl?: number;

  /**
   * Field names to NEVER persist (passwords, CVV, OTP, etc.).
   * These fields are stripped from the saved draft.
   * @example ['password', 'confirm', 'cvv']
   */
  exclude?: string[];

  /**
   * Debounce delay in ms before writing to storage on each change.
   * @default 800
   */
  debounce?: number;

  /**
   * Called when a draft is successfully restored.
   */
  onRestore?: (values: Record<string, unknown>) => void;

  /**
   * Called when a draft save fails (e.g. storage quota exceeded).
   */
  onSaveError?: (error: unknown) => void;

  /**
   * Version string. If the stored draft has a different version, it is discarded.
   * Use this to invalidate old drafts when your schema changes.
   * @example '2'
   */
  version?: string;
}

interface DraftEnvelope {
  /** Saved form values (excluding sensitive fields) */
  values:    Record<string, unknown>;
  /** Unix timestamp in ms when this draft was saved */
  savedAt:   number;
  /** TTL in seconds */
  ttl:       number;
  /** Schema version (for invalidation) */
  version:   string;
}

const PREFIX = 'formura:';

// ─── DraftManager ─────────────────────────────────────────────────────────────

export class DraftManager {
  private adapter:  StorageAdapter;
  private storageKey: string;
  private ttl:      number;
  private exclude:  Set<string>;
  private version:  string;
  private debounce: number;
  private onRestore?:   (v: Record<string, unknown>) => void;
  private onSaveError?: (e: unknown) => void;
  private _timer: ReturnType<typeof setTimeout> | null = null;
  private _ready: boolean = false;

  constructor(opts: PersistOptions) {
    this.adapter    = resolveAdapter(opts.storage ?? 'local');
    this.storageKey = PREFIX + opts.key;
    this.ttl        = opts.ttl    ?? 3600;
    this.exclude    = new Set(opts.exclude ?? []);
    this.version    = opts.version ?? '1';
    this.debounce   = opts.debounce ?? 800;
    this.onRestore  = opts.onRestore;
    this.onSaveError = opts.onSaveError;
  }

  /** Load a previously saved draft. Returns null if none / expired / version mismatch. */
  async load(): Promise<Record<string, unknown> | null> {
    try {
      const raw = await this.adapter.getItem(this.storageKey);
      if (!raw) return null;

      const envelope: DraftEnvelope = JSON.parse(raw);

      // Version check
      if (envelope.version !== this.version) {
        await this.clear();
        return null;
      }

      // TTL check
      if (envelope.ttl > 0) {
        const ageMs  = Date.now() - envelope.savedAt;
        const ttlMs  = envelope.ttl * 1000;
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

  /** Save current values to storage (debounced). */
  save(values: Record<string, unknown>): void {
    if (this._timer) clearTimeout(this._timer);
    this._timer = setTimeout(() => this._write(values), this.debounce);
  }

  /** Force-save immediately (e.g. on step change in wizard). */
  async saveNow(values: Record<string, unknown>): Promise<void> {
    if (this._timer) { clearTimeout(this._timer); this._timer = null; }
    await this._write(values);
  }

  /** Remove the draft from storage. */
  async clear(): Promise<void> {
    if (this._timer) { clearTimeout(this._timer); this._timer = null; }
    try {
      await this.adapter.removeItem(this.storageKey);
    } catch { /* silent */ }
  }

  /** Whether a draft was loaded on init. */
  get hasRestoredDraft(): boolean { return this._ready; }

  // ─── Private ───────────────────────────────────────────────────

  private async _write(rawValues: Record<string, unknown>): Promise<void> {
    // Strip excluded fields
    const values: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(rawValues)) {
      if (!this.exclude.has(k)) values[k] = v;
    }

    const envelope: DraftEnvelope = {
      values,
      savedAt: Date.now(),
      ttl:     this.ttl,
      version: this.version,
    };

    try {
      await this.adapter.setItem(this.storageKey, JSON.stringify(envelope));
    } catch (err) {
      this.onSaveError?.(err);
      // Silently degrade — form still works without persistence
    }
  }
}

// ─── React hook for draft status ─────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react';

export interface UsePersistReturn {
  /** True while loading the draft on mount (shows a spinner) */
  isLoading:       boolean;
  /** True if a draft was found and restored */
  hasDraft:        boolean;
  /** Restored values (null if none) */
  draftValues:     Record<string, unknown> | null;
  /** Call this after successful submission to remove the draft */
  clearDraft:      () => Promise<void>;
  /** Call to force-save immediately */
  saveDraftNow:    () => Promise<void>;
}

/**
 * Internal hook — used by useForm() when persist option is provided.
 * Returns the draft manager and restored values.
 */
export function usePersist(
  opts:        PersistOptions | undefined,
  getValues:   () => Record<string, unknown>,
): UsePersistReturn & { manager: DraftManager | null; save: (v: Record<string, unknown>) => void } {
  const managerRef = useRef<DraftManager | null>(null);
  const [isLoading,   setIsLoading]   = useState(Boolean(opts));
  const [hasDraft,    setHasDraft]    = useState(false);
  const [draftValues, setDraftValues] = useState<Record<string, unknown> | null>(null);

  // Create manager once
  if (opts && !managerRef.current) {
    managerRef.current = new DraftManager(opts);
  }

  // Load on mount
  useEffect(() => {
    if (!managerRef.current) return;
    managerRef.current.load().then(values => {
      if (values) {
        setDraftValues(values);
        setHasDraft(true);
      }
      setIsLoading(false);
    });
  }, []); // eslint-disable-line

  const save = useCallback((values: Record<string, unknown>) => {
    managerRef.current?.save(values);
  }, []);

  const clearDraft = useCallback(async () => {
    await managerRef.current?.clear();
    setHasDraft(false);
    setDraftValues(null);
  }, []);

  const saveDraftNow = useCallback(async () => {
    await managerRef.current?.saveNow(getValues());
  }, [getValues]);

  return {
    isLoading,
    hasDraft,
    draftValues,
    clearDraft,
    saveDraftNow,
    manager: managerRef.current,
    save,
  };
}
