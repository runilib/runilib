import type { PersistOptions } from '../core/persist/draft';
import type { AnalyticsOptions } from '../hooks/shared/useFormBridgeAnalytics';
import type { Platform, SelectOption } from './field';
import type { FormSchema, FormState, SchemaValues } from './schema';
import type { FormBridgeOptions } from './ui';

// ─── Validation trigger ─────────────────────────────────────────────────────────

/**
 * When FormBridge should re-run validation for a field.
 *
 * - `'onChange'`  - on every keystroke / value change.
 * - `'onBlur'`    - after the field loses focus (default).
 * - `'onSubmit'`  - only when the form is submitted.
 * - `'onTouched'` - after the first blur, then on every change (react-hook-form style).
 */
export type ValidationTrigger = 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched';

// ─── useFormBridge options ────────────────────────────────────────────────────────────

/**
 * The options bag passed to `useFormBridge(schema, options)`. Controls
 * validation timing, schema resolvers, draft persistence, analytics, and
 * global Config overrides.
 *
 * @typeParam S - The form schema.
 * @typeParam TPlatform - Target platform (inferred from the hook variant).
 */
export interface UseFormBridgeOptions<
  S extends FormSchema,
  TPlatform extends Platform = Platform,
> {
  /**
   * When validation runs for a field:
   *
   * - `'onBlur'`    (default) - after field loses focus.
   * - `'onChange'`  - on every keystroke.
   * - `'onSubmit'`  - only on submit.
   * - `'onTouched'` - after blur, then on every change.
   *
   * See {@link ValidationTrigger}.
   */
  validateOn?: ValidationTrigger;
  /**
   * After the first submission, when to re-validate. Defaults to `'onChange'`
   * so users get instant feedback once they've tried to submit.
   */
  revalidateOn?: ValidationTrigger;
  /**
   * Schema-level resolver (Zod, Yup, Joi, Valibot). When provided,
   * field-level validators defined via the builder API are bypassed and the
   * resolver becomes the single source of truth.
   */
  validatorResolver?: SchemaValidatorResolver;
  /**
   * Show field errors inline immediately:
   *
   * - `'submit'` (default) - only after the form is submitted once or the
   *   field is touched.
   * - `'always'` - render errors from first render, no gating.
   */
  // showErrorsOn?: 'submit' | 'always';

  /**
   * Enable automatic draft persistence. The form values are saved to storage
   * on every change and restored on mount.
   *
   * @example
   * useFormBridge(schema, {
   *   persist: {
   *     key:     'signup-form',
   *     storage: 'local',          // 'local' | 'session' | 'async' | CustomAdapter
   *     ttl:     3600,             // seconds before draft expires (0 = no expiry)
   *     exclude: ['password', 'confirm', 'cvv'],  // never persisted
   *     debounce: 800,             // ms before writing to storage
   *     version: '2',             // bump to invalidate old drafts
   *   }
   * })
   */
  persist?: PersistOptions;

  /**
   * Changes the internal form instance identity. Use it in wizards /
   * multi-step forms when you want each step to own its own form state.
   */
  formKey?: string;

  /**
   * Rebuilds the compiled schema runtime without resetting the full form
   * instance. Useful during local development / hot reload, or when your
   * schema definition is intentionally replaced at runtime and you want
   * builder changes to apply.
   */
  schemaKey?: string | number;

  /**
   * Initial values applied when the form is created, or when {@link formKey}
   * changes. Values can be partial - missing keys fall back to the field's
   * `_defaultValue`.
   */
  initialValues?: Partial<SchemaValues<S>>;

  /**
   * Opt-in analytics hook. Emits events for field focus/blur, submit
   * attempts, validation errors, etc. See `AnalyticsOptions`.
   */
  analytics?: AnalyticsOptions;

  /**
   * Global UI layer applied to every rendered field, form wrapper, and
   * submit button. Receives a read-only {@link globalDefaultsContext} so you
   * can theme reactively based on the live form state, branch on field
   * metadata via the compiled `schema`, or switch on the target `platform`.
   *
   * Local field props still win over these defaults.
   */
  globalDefaults?(
    context: globalDefaultsContext<S, TPlatform>,
  ): FormBridgeOptions<TPlatform>;
}

// ─── globalDefaults context ──────────────────────────────────────────────────────

/**
 * Read-only context handed to the `globalDefaults` selector on every render.
 * Lets the theme branch on live form state, schema metadata, and the target
 * platform without reaching for mutation APIs.
 *
 * @typeParam S - The form schema.
 * @typeParam TPlatform - Target platform (inferred from the hook variant).
 */
export interface globalDefaultsContext<
  S extends FormSchema,
  TPlatform extends Platform = Platform,
> {
  /**
   * Live form state - same object you'd read from `form.state`. Use it to
   * react to `isSubmitting`, `submitError`, `isDirty`, per-field `errors`,
   * etc.
   */
  state: FormState<S>;
  /**
   * The compiled schema shape handed to `useFormBridge`. Iterate over its
   * keys to style fields by type (`password`, `email`, …) or by metadata
   * (e.g. every required field) without hard-coding field names.
   */
  schema: S;
  /**
   * `'web'` when the theme is running inside `useFormBridge` (web), `'native'`
   * when running inside the native variant. Useful for sharing a single
   * theme module across web and native apps in a monorepo.
   */
  platform: TPlatform;
}

// ─── Resolver ───────────────────────────────────────────────────────────────────

/**
 * Shape returned by a {@link SchemaValidatorResolver}. `values` holds the (possibly
 * coerced) values FormBridge should use going forward; `errors` holds
 * per-field error messages, keyed by field name.
 */
export interface ResolverResult {
  /**
   * Possibly-transformed values. Resolvers can coerce input (e.g. Zod
   * `.transform()`) and the returned values are what FormBridge writes back
   * to state.
   */
  values: Record<string, unknown>;
  /**
   * Error messages per field. An empty object means the form is valid.
   */
  errors: Record<string, string>;
}

/**
 * Function signature for plugging a schema library (Zod, Yup, Joi, Valibot)
 * into FormBridge. Called on every validation trigger with the current values;
 * must resolve to a {@link ResolverResult}.
 */
export type SchemaValidatorResolver = (
  values: Record<string, unknown>,
) => Promise<ResolverResult>;

// ─── Options fetcher ────────────────────────────────────────────────────────────

/**
 * Context handed to an async options fetcher - everything needed to build a
 * cancelable, dependency-aware request.
 */
export interface OptionsFetcherContext {
  /** Current search query typed into the picker, or `''` if not searchable. */
  search: string;
  /**
   * Map of other field values this fetcher declared as dependencies. Changing
   * any of them triggers a re-fetch.
   */
  deps: Record<string, unknown>;
  /**
   * Abort signal - tied to the component lifecycle and dependency changes.
   * Forward it to `fetch` / your HTTP client to cancel stale requests.
   */
  signal: AbortSignal;
}

/**
 * Async options fetcher. Returns the list of {@link SelectOption}s to display
 * in a select/radio picker. Called with an {@link OptionsFetcherContext}.
 */
export type OptionsFetcher = (context: OptionsFetcherContext) => Promise<SelectOption[]>;
