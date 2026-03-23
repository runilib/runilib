/**
 * formura — Form Analytics
 * ────────────────────────────
 * Tracks field interactions, timing, abandonment, and completion metrics.
 * Zero overhead when no callbacks are configured.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AnalyticsCallbacks {
  /** Called when a field receives focus */
  onFieldFocus?: (name: string) => void;

  /** Called when a field is blurred with a value (user filled it) */
  onFieldComplete?: (name: string, durationMs: number) => void;

  /** Called when a field is blurred with an EMPTY value after being focused (abandoned) */
  onFieldAbandoned?: (name: string, partialValue: unknown) => void;

  /** Called when a field gets a validation error */
  onFieldError?: (name: string, error: string) => void;

  /** Called when a field error is cleared */
  onFieldErrorFixed?: (name: string) => void;

  /**
   * Called when the user leaves the page/app with an incomplete form.
   * Web: beforeunload. Native: AppState 'background'.
   */
  onFormAbandoned?: (
    completedPercent: number,
    lastField:        string | null,
    values:           Record<string, unknown>,
  ) => void;

  /** Called on successful submission */
  onFormCompleted?: (
    durationMs:   number,
    submitCount:  number,
    fieldCount:   number,
  ) => void;

  /** Called when submit is attempted but validation fails */
  onFormError?: (
    errors:      Record<string, string>,
    submitCount: number,
  ) => void;

  /**
   * Called each time a specific field's value changes.
   * NOTE: never include the actual value in events — only the field name.
   */
  onFieldChange?: (name: string, changeCount: number) => void;
}

export interface AnalyticsOptions {
  callbacks:    AnalyticsCallbacks;
  /**
   * Field names to EXCLUDE from all tracking (passwords, CVVs).
   * @default ['password', 'confirm', 'cvv', 'pin', 'otp', 'ssn']
   */
  exclude?:     string[];
  /**
   * Form identifier — sent with all events for multi-form apps.
   * @example 'signup-form', 'checkout'
   */
  formId?:      string;
}

// ─── Analytics tracker ────────────────────────────────────────────────────────

export class FormAnalyticsTracker {
  private callbacks:   AnalyticsCallbacks;
  private exclude:     Set<string>;
  private formId?:     string;

  private formStartMs:   number = Date.now();
  private fieldFocusMs:  Record<string, number>  = {};
  private fieldChanges:  Record<string, number>  = {};
  private lastField:     string | null           = null;
  private cleanupFns:    (() => void)[]          = [];

  constructor(opts: AnalyticsOptions) {
    this.callbacks = opts.callbacks;
    this.exclude   = new Set([
      'password', 'confirm', 'cvv', 'pin', 'otp', 'ssn', 'secret',
      ...(opts.exclude ?? []),
    ]);
    this.formId = opts.formId;

    // Register abandonment listeners
    this._registerAbandonmentListeners();
  }

  // ── Called by useForm ─────────────────────────────────────────────────────

  onFieldFocus(name: string): void {
    if (this.exclude.has(name)) return;
    this.lastField          = name;
    this.fieldFocusMs[name] = Date.now();
    this.callbacks.onFieldFocus?.(name);
  }

  onFieldBlur(name: string, value: unknown): void {
    if (this.exclude.has(name)) return;
    const focusMs = this.fieldFocusMs[name];
    const duration = focusMs ? Date.now() - focusMs : 0;

    const isEmpty = value === null || value === undefined ||
                    (typeof value === 'string' && value.trim() === '') ||
                    (typeof value === 'boolean' && value === false);

    if (isEmpty && focusMs) {
      this.callbacks.onFieldAbandoned?.(name, value);
    } else if (!isEmpty) {
      this.callbacks.onFieldComplete?.(name, duration);
    }
  }

  onFieldChange(name: string): void {
    if (this.exclude.has(name)) return;
    this.fieldChanges[name] = (this.fieldChanges[name] ?? 0) + 1;
    this.callbacks.onFieldChange?.(name, this.fieldChanges[name]);
  }

  onFieldError(name: string, error: string): void {
    if (this.exclude.has(name)) return;
    this.callbacks.onFieldError?.(name, error);
  }

  onFieldErrorFixed(name: string): void {
    if (this.exclude.has(name)) return;
    this.callbacks.onFieldErrorFixed?.(name);
  }

  onFormSubmitError(errors: Record<string, string>, submitCount: number): void {
    const filtered = Object.fromEntries(
      Object.entries(errors).filter(([k]) => !this.exclude.has(k))
    );
    this.callbacks.onFormError?.(filtered, submitCount);
  }

  onFormSubmitSuccess(submitCount: number, fieldCount: number): void {
    const durationMs = Date.now() - this.formStartMs;
    this.callbacks.onFormCompleted?.(durationMs, submitCount, fieldCount);
    this._cleanup(); // no more abandonment tracking needed
  }

  /** Compute percent of form fields that have non-empty values */
  computeCompletion(values: Record<string, unknown>): number {
    const entries = Object.entries(values).filter(([k]) => !this.exclude.has(k));
    if (entries.length === 0) return 0;
    const filled = entries.filter(([, v]) =>
      v !== null && v !== undefined && v !== '' && v !== false
    ).length;
    return Math.round((filled / entries.length) * 100);
  }

  destroy(): void {
    this._cleanup();
  }

  // ── Private ───────────────────────────────────────────────────────────────

  private _currentValues: (() => Record<string, unknown>) | null = null;

  setValuesGetter(fn: () => Record<string, unknown>): void {
    this._currentValues = fn;
  }

  private _registerAbandonmentListeners(): void {
    if (typeof window !== 'undefined') {
      // Web: beforeunload
      const handleUnload = () => {
        const values     = this._currentValues?.() ?? {};
        const completion = this.computeCompletion(values);
        if (completion > 0 && completion < 100) {
          this.callbacks.onFormAbandoned?.(completion, this.lastField, values);
        }
      };
      window.addEventListener('beforeunload', handleUnload);
      this.cleanupFns.push(() => window.removeEventListener('beforeunload', handleUnload));
    } else {
      // React Native: AppState
      try {
        const { AppState } = require('react-native');
        let appState = AppState.currentState;

        const sub = AppState.addEventListener('change', (nextState: string) => {
          if (appState === 'active' && nextState.match(/inactive|background/)) {
            const values     = this._currentValues?.() ?? {};
            const completion = this.computeCompletion(values);
            if (completion > 0 && completion < 100) {
              this.callbacks.onFormAbandoned?.(completion, this.lastField, values);
            }
          }
          appState = nextState;
        });

        this.cleanupFns.push(() => sub?.remove?.());
      } catch { /* Not in React Native */ }
    }
  }

  private _cleanup(): void {
    this.cleanupFns.forEach(fn => fn());
    this.cleanupFns = [];
  }
}

// ─── React hook ───────────────────────────────────────────────────────────────

import { useRef, useEffect } from 'react';

export function useFormAnalytics(
  opts:      AnalyticsOptions | undefined,
  getValues: () => Record<string, unknown>,
): FormAnalyticsTracker | null {
  const trackerRef = useRef<FormAnalyticsTracker | null>(null);

  if (opts && !trackerRef.current) {
    trackerRef.current = new FormAnalyticsTracker(opts);
  }

  useEffect(() => {
    if (trackerRef.current) {
      trackerRef.current.setValuesGetter(getValues);
    }
    return () => { trackerRef.current?.destroy(); };
  }, []); // eslint-disable-line

  return trackerRef.current;
}
