import { useEffect, useRef } from 'react';

/**
 * react-formbridge — Form Analytics
 * ────────────────────────
 * Tracks field interactions, timing, validation, abandonment and completion.
 *
 * Works on:
 * - Web: `pagehide`, `beforeunload`, `visibilitychange`
 * - React Native: `AppState`
 *
 * Notes:
 * - No field values are sent in `onFieldChange`.
 * - Sensitive fields can be excluded globally.
 * - Listener registration is handled by the hook, not the class constructor.
 */

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Handlers invoked by the analytics tracker.
 */
export interface AnalyticsHandlers {
  /**
   * Called when a field receives focus.
   */
  onFieldFocus?: (name: string) => void;

  /**
   * Called when a field is blurred with a non-empty value.
   *
   * @param name - Field name
   * @param durationMs - Time spent in the field between focus and blur
   */
  onFieldComplete?: (name: string, durationMs: number) => void;

  /**
   * Called when a field is blurred empty after having been focused.
   *
   * @param name - Field name
   * @param partialValue - Current field value at blur time
   */
  onFieldAbandoned?: (name: string, partialValue: unknown) => void;

  /**
   * Called when a field enters an error state.
   */
  onFieldError?: (name: string, error: string) => void;

  /**
   * Called when a previously errored field becomes valid again.
   */
  onFieldErrorFixed?: (name: string) => void;

  /**
   * Called when the form is abandoned while partially filled.
   *
   * Web:
   * - pagehide
   * - beforeunload
   * - document hidden
   *
   * Native:
   * - app goes inactive/background
   */
  onFormAbandoned?: (
    completedPercent: number,
    lastField: string | null,
    values: Record<string, unknown>,
  ) => void;

  /**
   * Called when the form is submitted successfully.
   *
   * @param durationMs - Total time spent since tracker start
   * @param submitCount - Number of submit attempts
   * @param fieldCount - Number of tracked fields
   */
  onFormCompleted?: (durationMs: number, submitCount: number, fieldCount: number) => void;

  /**
   * Called when submit is attempted but validation fails.
   */
  onFormLevelError?: (errors: Record<string, string>, submitCount: number) => void;

  /**
   * Called each time a field changes.
   *
   * Note:
   * This callback only exposes the field name and change count,
   * never the actual field value.
   */
  onFieldChange?: (name: string, changeCount: number) => void;
}

/**
 * Analytics configuration.
 */
export interface AnalyticsOptions {
  /**
   * Analytics handlers.
   */
  handlers: AnalyticsHandlers;

  /**
   * Field names to exclude from all tracking.
   *
   * Default:
   * `['password', 'confirm', 'cvv', 'pin', 'otp', 'ssn', 'secret']`
   */
  exclude?: string[];

  /**
   * Optional form identifier.
   * Useful if your app contains multiple forms and your analytics
   * backend wants to group events by form.
   */
  formId?: string;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const DEFAULT_EXCLUDED_FIELDS = [
  'password',
  'confirm',
  'cvv',
  'pin',
  'otp',
  'ssn',
  'secret',
];

/**
 * Returns true when a value should be considered "empty" for analytics.
 */
function isAnalyticsEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) return true;

  if (typeof value === 'string') {
    return value.trim() === '';
  }

  if (typeof value === 'boolean') {
    return value === false;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;

    // Common react-formbridge structured values
    if ('e164' in record && typeof record.e164 === 'string') {
      return record.e164.trim() === '';
    }

    if ('display' in record && typeof record.display === 'string') {
      return record.display.trim() === '';
    }

    if ('uri' in record && typeof record.uri === 'string') {
      return record.uri.trim() === '';
    }

    if ('value' in record) {
      return isAnalyticsEmptyValue(record.value);
    }

    return Object.keys(record).length === 0;
  }

  return false;
}

/**
 * Returns a filtered copy of an object excluding sensitive fields.
 */
function filterExcludedFields(
  values: Record<string, unknown>,
  exclude: Set<string>,
): Record<string, unknown> {
  return Object.fromEntries(Object.entries(values).filter(([key]) => !exclude.has(key)));
}

/* -------------------------------------------------------------------------- */
/* Tracker                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Imperative analytics tracker used internally by `useFormBridgeAnalytics`.
 *
 * The class itself is side-effect free on construction.
 * Platform listeners are attached later through `attachLifecycleTracking()`.
 */
export class FormBridgeAnalyticsTracker {
  private readonly handlers: AnalyticsHandlers;
  private readonly exclude: Set<string>;
  private readonly formId?: string;

  private readonly formStartMs = Date.now();

  private fieldFocusMs: Record<string, number> = {};
  private fieldChanges: Record<string, number> = {};
  private fieldErrors: Record<string, string> = {};

  private lastField: string | null = null;
  private currentValuesGetter: (() => Record<string, unknown>) | null = null;

  private cleanupFns: Array<() => void> = [];
  private didReportAbandonment = false;
  private didComplete = false;
  private attached = false;

  /**
   * Creates a tracker instance.
   */
  constructor(opts: AnalyticsOptions) {
    this.handlers = opts.handlers;
    this.exclude = new Set([...DEFAULT_EXCLUDED_FIELDS, ...(opts.exclude ?? [])]);
    this.formId = opts.formId;
  }

  /**
   * Updates the getter used to retrieve latest form values.
   */
  setValuesGetter(getter: () => Record<string, unknown>): void {
    this.currentValuesGetter = getter;
  }

  /**
   * Attaches web/native lifecycle listeners once.
   * Safe to call multiple times.
   */
  attachLifecycleTracking(): void {
    if (this.attached) return;
    this.attached = true;

    if (globalThis.window && typeof document !== 'undefined') {
      const reportAbandonment = () => {
        this.reportAbandonmentIfNeeded();
      };

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          reportAbandonment();
        }
      };

      window.addEventListener('pagehide', reportAbandonment);
      window.addEventListener('beforeunload', reportAbandonment);
      document.addEventListener('visibilitychange', handleVisibilityChange);

      this.cleanupFns.push(
        () => window.removeEventListener('pagehide', reportAbandonment),
        () => window.removeEventListener('beforeunload', reportAbandonment),
        () => document.removeEventListener('visibilitychange', handleVisibilityChange),
      );

      return;
    }

    try {
      // React Native only
      const { AppState } = require('react-native') as typeof import('react-native');

      let previousState = AppState.currentState;

      const subscription = AppState.addEventListener('change', (nextState) => {
        const leavingForeground =
          previousState === 'active' &&
          (nextState === 'inactive' || nextState === 'background');

        if (leavingForeground) {
          this.reportAbandonmentIfNeeded();
        }

        previousState = nextState;
      });

      this.cleanupFns.push(() => subscription.remove());
    } catch {
      // Non-native environment: ignore
    }
  }

  /**
   * Tracks a field focus.
   */
  onFieldFocus(name: string): void {
    if (this.exclude.has(name)) return;

    this.lastField = name;
    this.fieldFocusMs[name] = Date.now();
    this.handlers.onFieldFocus?.(name);
  }

  /**
   * Tracks a field blur and emits completion/abandonment when relevant.
   */
  onFieldBlur(name: string, value: unknown): void {
    if (this.exclude.has(name)) return;

    const focusStartedAt = this.fieldFocusMs[name];
    const durationMs = focusStartedAt ? Date.now() - focusStartedAt : 0;
    const isEmpty = isAnalyticsEmptyValue(value);

    if (focusStartedAt) {
      if (isEmpty) {
        this.handlers.onFieldAbandoned?.(name, value);
      } else {
        this.handlers.onFieldComplete?.(name, durationMs);
      }
    }

    delete this.fieldFocusMs[name];
  }

  /**
   * Tracks a field change count.
   */
  onFieldChange(name: string): void {
    if (this.exclude.has(name)) return;

    this.fieldChanges[name] = (this.fieldChanges[name] ?? 0) + 1;
    this.handlers.onFieldChange?.(name, this.fieldChanges[name]);
  }

  /**
   * Emits a field error event only when the error actually changes.
   */
  onFieldError(name: string, error: string): void {
    if (this.exclude.has(name)) return;

    const previous = this.fieldErrors[name];
    if (previous === error) return;

    this.fieldErrors[name] = error;
    this.handlers.onFieldError?.(name, error);
  }

  /**
   * Emits a field error fixed event only if the field had an error before.
   */
  onFieldErrorFixed(name: string): void {
    if (this.exclude.has(name)) return;
    if (!(name in this.fieldErrors)) return;

    delete this.fieldErrors[name];
    this.handlers.onFieldErrorFixed?.(name);
  }

  /**
   * Called when submit is attempted but the form is invalid.
   */
  onFormSubmitError(errors: Record<string, string>, submitCount: number): void {
    const filtered = Object.fromEntries(
      Object.entries(errors).filter(([key]) => !this.exclude.has(key)),
    );

    this.handlers.onFormLevelError?.(filtered, submitCount);
  }

  /**
   * Called on successful submission.
   */
  onFormSubmitSuccess(submitCount: number, fieldCount: number): void {
    this.didComplete = true;
    this.didReportAbandonment = true;

    const durationMs = Date.now() - this.formStartMs;
    this.handlers.onFormCompleted?.(durationMs, submitCount, fieldCount);

    this.destroy();
  }

  /**
   * Computes the current completion percentage of the form.
   */
  computeCompletion(values: Record<string, unknown>): number {
    const filtered = filterExcludedFields(values, this.exclude);
    const entries = Object.entries(filtered);

    if (entries.length === 0) return 0;

    const filledCount = entries.filter(
      ([, value]) => !isAnalyticsEmptyValue(value),
    ).length;

    return Math.round((filledCount / entries.length) * 100);
  }

  /**
   * Reports abandonment once, if the form is partially filled and not completed.
   */
  reportAbandonmentIfNeeded(): void {
    if (this.didComplete || this.didReportAbandonment) {
      return;
    }

    const values = this.currentValuesGetter?.() ?? {};
    const filteredValues = filterExcludedFields(values, this.exclude);
    const completion = this.computeCompletion(filteredValues);

    if (completion > 0 && completion < 100) {
      this.didReportAbandonment = true;
      this.handlers.onFormAbandoned?.(completion, this.lastField, filteredValues);
    }
  }

  /**
   * Removes listeners and marks the tracker as detached.
   */
  destroy(): void {
    this.cleanupFns.forEach((cleanup) => {
      cleanup();
    });
    this.cleanupFns = [];
    this.attached = false;
  }
}

/* -------------------------------------------------------------------------- */
/* Hook                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * React hook that creates and wires a `FormBridgeAnalyticsTracker`.
 *
 * @param opts - Analytics configuration. Pass `undefined` to disable analytics.
 * @param getValues - Function returning the latest form values.
 *
 * @returns A tracker instance or `null` if analytics is disabled.
 *
 * @example
 * ```ts
 * const analytics = useFormBridgeAnalytics(
 *   {
 *     formId: 'signup',
 *     handlers: {
 *       onFieldFocus: (name) => console.log('focus', name),
 *       onFormCompleted: (duration, submitCount) => {
 *         console.log('completed', { duration, submitCount });
 *       },
 *     },
 *   },
 *   () => stateRef.current.values as Record<string, unknown>,
 * );
 * ```
 */

export function useFormBridgeAnalytics(
  opts: AnalyticsOptions | undefined,
  getValues: () => Record<string, unknown>,
): FormBridgeAnalyticsTracker | null {
  const trackerRef = useRef<FormBridgeAnalyticsTracker | null>(null);
  const getValuesRef = useRef(getValues);

  getValuesRef.current = getValues;

  useEffect(() => {
    if (!opts) {
      trackerRef.current?.destroy();
      trackerRef.current = null;
      return;
    }

    if (!trackerRef.current) {
      trackerRef.current = new FormBridgeAnalyticsTracker(opts);
      trackerRef.current.attachLifecycleTracking();
    }

    trackerRef.current.setValuesGetter(() => getValuesRef.current());

    return () => {
      // Important:
      // do not destroy on every render/update,
      // only when hook unmounts or analytics is disabled.
    };
  }, [opts]); // keep this intentionally narrow if possible

  useEffect(() => {
    return () => {
      trackerRef.current?.destroy();
      trackerRef.current = null;
    };
  }, []);

  return trackerRef.current;
}
