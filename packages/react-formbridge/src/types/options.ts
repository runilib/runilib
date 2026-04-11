import type { PersistOptions } from '../core/persist/draft';
import type { AnalyticsOptions } from '../hooks/shared/useFormAnalytics';
import type { Platform, SelectOption } from './field';
import type { FormSchema, FormState, SchemaValues } from './schema';
import type { FormBridgeOptions } from './ui';

// ─── Validation trigger ─────────────────────────────────────────────────────────

export type ValidationTrigger = 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched';

// ─── useForm options ────────────────────────────────────────────────────────────

export interface UseFormOptions<
  S extends FormSchema,
  TPlatform extends Platform = Platform,
> {
  /**
   * When validation runs:
   * - `onBlur`   (default) — after field loses focus
   * - `onChange` — on every keystroke
   * - `onSubmit` — only on submit
   * - `onTouched` — after blur, then on every change
   */
  validateOn?: ValidationTrigger;
  /**
   * After first submission, when to re-validate.
   * Defaults to `'onChange'`.
   */
  revalidateOn?: ValidationTrigger;
  /**
   * Schema-level resolver (Zod, Yup, Joi, Valibot).
   * When provided, field-level validators are bypassed.
   */
  resolver?: SchemaResolver;
  /**
   * Show field errors inline immediately without user interaction.
   */
  showErrorsOn?: 'submit' | 'always';

  /**
   * Enable automatic draft persistence.
   * The form values are saved to storage on every change and restored on mount.
   *
   * @example
   * useForm(schema, {
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
   * Changes the internal form instance identity.
   * Useful for wizards / multi-step forms.
   */
  formKey?: string;

  /**
   * Rebuilds the compiled schema runtime without resetting the full form instance.
   * Useful during local development / hot reload, or when your schema definition
   * is intentionally replaced at runtime and you want builder changes to apply.
   */
  schemaKey?: string | number;

  /**
   * Initial values applied when the form is created or when formKey changes.
   */
  initialValues?: Partial<SchemaValues<S>>;

  analytics?: AnalyticsOptions;

  /**
   * Global UI layer applied to every rendered field, form wrapper, and submit button.
   * Local field props still win over these defaults.
   */
  globalStyles?(state: FormState<S>): FormBridgeOptions<TPlatform>;
}

// ─── Resolver ───────────────────────────────────────────────────────────────────

export interface ResolverResult {
  values: Record<string, unknown>;
  errors: Record<string, string>;
}

export type SchemaResolver = (values: Record<string, unknown>) => Promise<ResolverResult>;

// ─── Options fetcher ────────────────────────────────────────────────────────────

export interface OptionsFetcherContext {
  search: string;
  deps: Record<string, unknown>;
  signal: AbortSignal;
}

export type OptionsFetcher = (context: OptionsFetcherContext) => Promise<SelectOption[]>;
