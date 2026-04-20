import type { FieldDescriptor } from '../../types/field';
import type { FB_SCHEMA_SHAPE, FormSchema, SchemaValues } from '../../types/schema';
import type {
  FieldReference,
  ValidationContext,
  ValidationErrorMap,
  ValidationIssue,
  ValidationIssueInput,
  ValidationResult,
  ValidatorResult,
} from '../../types/validation';
import { parseDateValue } from '../field-builders/common-utils';
import { extractDefaults, validateAllDetailed, validateAllDetailedSync } from './engine';
import { buildValidationResult, createValidationIssue, isPromiseLike } from './issues';
import { getValueAtPath, isFieldReference, resolveReferenceValue } from './reference';

type RefinementMessage = string | ValidationIssueInput | undefined;

type SchemaRefinement<TValues> = (
  values: TValues,
  context: ValidationContext,
) => void | Promise<void>;

interface SchemaValidationMeta<TSchema extends FormSchema> {
  refinements: Array<SchemaRefinement<SchemaValues<TSchema>>>;
  errorMap?: ValidationErrorMap;
}

type SchemaDateRangeConfig<TSchema extends FormSchema> = {
  start: keyof TSchema | string | FieldReference;
  end: keyof TSchema | string | FieldReference;
};

export interface FormBridgeSchemaApi<TSchema extends FormSchema> {
  safeParse(
    values: Partial<SchemaValues<TSchema>>,
  ): ValidationResult<SchemaValues<TSchema>>;
  safeParseAsync(
    values: Partial<SchemaValues<TSchema>>,
  ): Promise<ValidationResult<SchemaValues<TSchema>>>;
  validate(values: Partial<SchemaValues<TSchema>>): SchemaValues<TSchema>;
  validateAsync(values: Partial<SchemaValues<TSchema>>): Promise<SchemaValues<TSchema>>;
  refine(
    predicate: (values: SchemaValues<TSchema>) => boolean,
    message?: RefinementMessage,
  ): FormBridgeSchema<TSchema>;
  refineAsync(
    predicate: (values: SchemaValues<TSchema>) => Promise<boolean>,
    message?: RefinementMessage,
  ): FormBridgeSchema<TSchema>;
  superRefine(
    refinement: SchemaRefinement<SchemaValues<TSchema>>,
  ): FormBridgeSchema<TSchema>;
  errorMap(mapper: ValidationErrorMap): FormBridgeSchema<TSchema>;
  atLeastOne(
    fields: Array<keyof TSchema | string | FieldReference>,
    message?: string,
  ): FormBridgeSchema<TSchema>;
  exactlyOne(
    fields: Array<keyof TSchema | string | FieldReference>,
    message?: string,
  ): FormBridgeSchema<TSchema>;
  allOrNone(
    fields: Array<keyof TSchema | string | FieldReference>,
    message?: string,
  ): FormBridgeSchema<TSchema>;
}

/**
 * Return type of `createSchema()`. Carries the underlying shape as a phantom (typed
 * via {@link FB_SCHEMA_SHAPE}) so that direct autocomplete on a schema object
 * only surfaces the validation API - `safeParse`, `refine`, `atLeastOne`, etc.
 * - not the individual field keys. Field-level inference still flows through
 * `SchemaValues<typeof schema>` via the phantom unwrap.
 *
 * The `& FormSchema` keeps the returned object assignable to `useFormBridge`
 * which is typed against `FormSchema`, while the index signature contributes
 * no literal key suggestions to autocomplete.
 */
export type FormBridgeSchema<TSchema extends FormSchema> = FormBridgeSchemaApi<TSchema> &
  FormSchema & {
    readonly [FB_SCHEMA_SHAPE]: TSchema;
  };

export class FormBridgeSchemaValidationError<
  TData = Record<string, unknown>,
> extends Error {
  result: ValidationResult<TData>;

  constructor(result: ValidationResult<TData>) {
    super('[@runilib/react-formbridge] Schema validation failed.');
    this.name = 'FormBridgeSchemaValidationError';
    this.result = result;
  }
}

const FORM_BRIDGE_SCHEMA_META = Symbol('formbridge-schema-meta');
const FORM_BRIDGE_SCHEMA_DISABLED_HELPERS = Symbol('formbridge-schema-disabled-helpers');

function normalizeIssueInput(message?: RefinementMessage): ValidatorResult {
  if (!message) {
    return null;
  }

  return typeof message === 'string' ? message : message;
}

function isProvidedValue(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim() !== '';
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return true;
}

function normalizeFieldLabel(fieldOrRef: string | FieldReference): string {
  return typeof fieldOrRef === 'string' ? fieldOrRef : fieldOrRef.path;
}

function buildDescriptors<TSchema extends FormSchema>(
  schemaShape: TSchema,
): Record<string, FieldDescriptor<unknown>> {
  const descriptors: Record<string, FieldDescriptor<unknown>> = {};

  for (const [key, value] of Object.entries(schemaShape)) {
    if (
      value &&
      typeof value === 'object' &&
      '_build' in value &&
      typeof (value as { _build?: unknown })._build === 'function'
    ) {
      descriptors[key] = (value as { _build: () => FieldDescriptor<unknown> })._build();
      continue;
    }

    descriptors[key] = value as FieldDescriptor<unknown>;
  }

  return descriptors;
}

function applySubmitTransforms(
  descriptor: FieldDescriptor<unknown>,
  rawValue: unknown,
): unknown {
  let nextValue = rawValue;

  if (descriptor._transform) {
    nextValue = (descriptor._transform as (value: unknown) => unknown)(nextValue);
  }

  if (descriptor._trim && typeof nextValue === 'string') {
    nextValue = nextValue.trim();
  }

  if (descriptor._outputTransform) {
    nextValue = (descriptor._outputTransform as (value: unknown) => unknown)(nextValue);
  }

  return nextValue;
}

function buildParsedValues<TSchema extends FormSchema>(
  descriptors: Record<string, FieldDescriptor<unknown>>,
  values: Partial<SchemaValues<TSchema>>,
): SchemaValues<TSchema> {
  const defaults = extractDefaults(descriptors);

  return Object.fromEntries(
    Object.entries(descriptors).map(([key, descriptor]) => {
      const rawValue =
        key in values ? (values as Record<string, unknown>)[key] : defaults[key];

      return [key, applySubmitTransforms(descriptor, rawValue)];
    }),
  ) as SchemaValues<TSchema>;
}

function addIssueFromContext(
  target: ValidationIssue[],
  issue: ValidatorResult,
  errorMap?: ValidationErrorMap,
): void {
  const normalized = createValidationIssue(
    issue,
    {
      path: [],
      code: 'custom',
      message: 'Invalid form.',
    },
    errorMap,
  );

  if (normalized) {
    target.push(normalized);
  }
}

async function runRefinementsAsync<TSchema extends FormSchema>(
  meta: SchemaValidationMeta<TSchema>,
  values: SchemaValues<TSchema>,
) {
  const refinementIssues: ValidationIssue[] = [];
  const context: ValidationContext = {
    addIssue: (issue) => {
      addIssueFromContext(refinementIssues, issue, meta.errorMap);
    },
  };

  for (const refinement of meta.refinements) {
    await refinement(values, context);
  }

  return refinementIssues.filter(Boolean);
}

function runRefinementsSync<TSchema extends FormSchema>(
  meta: SchemaValidationMeta<TSchema>,
  values: SchemaValues<TSchema>,
) {
  const refinementIssues: ValidationIssue[] = [];
  const context: ValidationContext = {
    addIssue: (issue) => {
      addIssueFromContext(refinementIssues, issue, meta.errorMap);
    },
  };

  for (const refinement of meta.refinements) {
    const result = refinement(values, context);

    if (isPromiseLike(result)) {
      throw new Error(
        '[@runilib/react-formbridge] Encountered an async schema refinement during a synchronous validation pass. Use safeParseAsync() or validateAsync() instead.',
      );
    }
  }

  return refinementIssues.filter(Boolean);
}

function refineToIssue(message?: RefinementMessage): ValidatorResult {
  return normalizeIssueInput(message) ?? 'Invalid form.';
}

export function getSchemaValidationApi<TSchema extends FormSchema>(
  schemaShape: TSchema,
): FormBridgeSchemaApi<TSchema> | null {
  const candidate = schemaShape as TSchema & {
    [FORM_BRIDGE_SCHEMA_META]?: SchemaValidationMeta<TSchema>;
  };

  if (!candidate[FORM_BRIDGE_SCHEMA_META]) {
    return null;
  }

  return candidate as unknown as FormBridgeSchema<TSchema>;
}

export function createSchema<const TSchema extends FormSchema>(
  shape: TSchema,
): FormBridgeSchema<TSchema> {
  const enhanced = { ...shape } as unknown as FormBridgeSchema<TSchema> & {
    [FORM_BRIDGE_SCHEMA_META]: SchemaValidationMeta<TSchema>;
  };

  const meta: SchemaValidationMeta<TSchema> = {
    refinements: [],
  };

  // Temporarily kept internal so we can re-enable the public helper later
  // without having to rebuild its implementation from scratch.
  const disabledHelpers = {
    dateRange(config: SchemaDateRangeConfig<TSchema>, message?: string) {
      return api.superRefine((values, context) => {
        const startValue = resolveReferenceValue(
          config.start as string | FieldReference,
          values as Record<string, unknown>,
        );
        const endValue = resolveReferenceValue(
          config.end as string | FieldReference,
          values as Record<string, unknown>,
        );

        if (!startValue || !endValue) {
          return;
        }

        const startDate = parseDateValue(startValue);
        const endDate = parseDateValue(endValue);

        if (!startDate || !endDate) {
          return;
        }

        if (startDate > endDate) {
          const endPath = isFieldReference(config.end)
            ? config.end.path
            : String(config.end);

          context.addIssue({
            code: 'date_range',
            path: endPath,
            message: message ?? 'End date must be on or after the start date.',
            params: {
              start: isFieldReference(config.start)
                ? config.start.path
                : String(config.start),
              end: endPath,
            },
          });
        }
      });
    },
  };

  const api: FormBridgeSchemaApi<TSchema> = {
    safeParse(values) {
      const descriptors = buildDescriptors(enhanced);
      const parsedValues = buildParsedValues<TSchema>(descriptors, values);
      const fieldIssues = validateAllDetailedSync(
        descriptors,
        parsedValues as Record<string, unknown>,
        {
          errorMap: meta.errorMap,
        },
      );
      const refinementIssues = runRefinementsSync(meta, parsedValues);

      return buildValidationResult(parsedValues, [...fieldIssues, ...refinementIssues]);
    },

    async safeParseAsync(values) {
      const descriptors = buildDescriptors(enhanced);
      const parsedValues = buildParsedValues<TSchema>(descriptors, values);
      const fieldIssues = await validateAllDetailed(
        descriptors,
        parsedValues as Record<string, unknown>,
        {
          errorMap: meta.errorMap,
        },
      );
      const refinementIssues = await runRefinementsAsync(meta, parsedValues);

      return buildValidationResult(parsedValues, [...fieldIssues, ...refinementIssues]);
    },

    validate(values) {
      const result = api.safeParse(values);

      if (!result.success) {
        throw new FormBridgeSchemaValidationError(result);
      }

      return result.data as SchemaValues<TSchema>;
    },

    async validateAsync(values) {
      const result = await api.safeParseAsync(values);

      if (!result.success) {
        throw new FormBridgeSchemaValidationError(result);
      }

      return result.data as SchemaValues<TSchema>;
    },

    refine(predicate, message) {
      meta.refinements.push((values, context) => {
        if (!predicate(values)) {
          context.addIssue(refineToIssue(message));
        }
      });

      return enhanced;
    },

    refineAsync(predicate, message) {
      meta.refinements.push(async (values, context) => {
        if (!(await predicate(values))) {
          context.addIssue(refineToIssue(message));
        }
      });

      return enhanced;
    },

    superRefine(refinement) {
      meta.refinements.push(refinement);
      return enhanced;
    },

    errorMap(mapper) {
      meta.errorMap = mapper;
      return enhanced;
    },

    atLeastOne(fields, message) {
      return api.superRefine((values, context) => {
        const hasValue = fields.some((fieldName) =>
          isProvidedValue(
            resolveReferenceValue(
              fieldName as string | FieldReference,
              values as Record<string, unknown>,
            ),
          ),
        );

        if (!hasValue) {
          context.addIssue({
            code: 'at_least_one',
            message:
              message ??
              `At least one of ${fields.map((fieldName) => normalizeFieldLabel(fieldName as string | FieldReference)).join(', ')} is required.`,
            params: {
              fields: fields.map((fieldName) =>
                normalizeFieldLabel(fieldName as string | FieldReference),
              ),
            },
          });
        }
      });
    },

    exactlyOne(fields, message) {
      return api.superRefine((values, context) => {
        const providedCount = fields.filter((fieldName) =>
          isProvidedValue(
            resolveReferenceValue(
              fieldName as string | FieldReference,
              values as Record<string, unknown>,
            ),
          ),
        ).length;

        if (providedCount !== 1) {
          context.addIssue({
            code: 'exactly_one',
            message:
              message ??
              `Exactly one of ${fields.map((fieldName) => normalizeFieldLabel(fieldName as string | FieldReference)).join(', ')} must be provided.`,
            params: {
              fields: fields.map((fieldName) =>
                normalizeFieldLabel(fieldName as string | FieldReference),
              ),
            },
          });
        }
      });
    },

    allOrNone(fields, message) {
      return api.superRefine((values, context) => {
        const providedCount = fields.filter((fieldName) =>
          isProvidedValue(
            resolveReferenceValue(
              fieldName as string | FieldReference,
              values as Record<string, unknown>,
            ),
          ),
        ).length;

        if (providedCount > 0 && providedCount < fields.length) {
          context.addIssue({
            code: 'all_or_none',
            message:
              message ??
              `Provide either all or none of ${fields.map((fieldName) => normalizeFieldLabel(fieldName as string | FieldReference)).join(', ')}.`,
            params: {
              fields: fields.map((fieldName) =>
                normalizeFieldLabel(fieldName as string | FieldReference),
              ),
            },
          });
        }
      });
    },
  };

  Object.defineProperties(enhanced, {
    [FORM_BRIDGE_SCHEMA_META]: {
      value: meta,
      enumerable: false,
      configurable: false,
      writable: false,
    },
    [FORM_BRIDGE_SCHEMA_DISABLED_HELPERS]: {
      value: disabledHelpers,
      enumerable: false,
      configurable: false,
      writable: false,
    },
    safeParse: {
      value: api.safeParse,
      enumerable: false,
    },
    safeParseAsync: {
      value: api.safeParseAsync,
      enumerable: false,
    },
    validate: {
      value: api.validate,
      enumerable: false,
    },
    validateAsync: {
      value: api.validateAsync,
      enumerable: false,
    },
    refine: {
      value: api.refine,
      enumerable: false,
    },
    refineAsync: {
      value: api.refineAsync,
      enumerable: false,
    },
    superRefine: {
      value: api.superRefine,
      enumerable: false,
    },
    errorMap: {
      value: api.errorMap,
      enumerable: false,
    },
    atLeastOne: {
      value: api.atLeastOne,
      enumerable: false,
    },
    exactlyOne: {
      value: api.exactlyOne,
      enumerable: false,
    },
    allOrNone: {
      value: api.allOrNone,
      enumerable: false,
    },
  });

  return enhanced;
}

export function getSchemaFieldValue(
  values: Record<string, unknown>,
  field: string | FieldReference,
) {
  return getValueAtPath(values, typeof field === 'string' ? field : field.path);
}
