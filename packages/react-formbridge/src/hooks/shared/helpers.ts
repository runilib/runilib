import type { FieldConditions, VisibilityMap } from '../../core/conditions/conditions';
import type {
  FieldDescriptor,
  FormSchema,
  FormState,
  SchemaValues,
  ValidationTrigger,
} from '../../types';
import type { FormBridgeAnalyticsTracker } from './useFormBridgeAnalytics';

export const makeInitialState = <S extends FormSchema>(
  values: SchemaValues<S>,
): FormState<S> => {
  return {
    values,
    errors: {},
    touched: {},
    dirty: {},
    status: 'idle',
    isValid: true,
    isDirty: false,
    isSubmitting: false,
    isSubmitSuccess: false,
    isSubmitError: false,
    submitCount: 0,
    submitError: null,
  };
};

export const buildSchemaRuntime = <S extends FormSchema>(
  schema: S,
): {
  descriptors: Record<string, FieldDescriptor<unknown>>;
  conditionsMap: Record<string, FieldConditions<S>>;
} => {
  const desc: Record<string, FieldDescriptor<unknown>> = {};
  const conds: Record<string, FieldConditions<S>> = {};

  for (const [key, val] of Object.entries(schema)) {
    let built: FieldDescriptor<unknown>;

    if (
      val &&
      typeof val === 'object' &&
      '_build' in val &&
      typeof (val as { _build?: unknown })._build === 'function'
    ) {
      built = (val as { _build: () => FieldDescriptor<unknown> })._build();
    } else {
      built = val as FieldDescriptor<unknown>;
    }

    desc[key] = built;

    const candidate = val as { _conditions?: FieldConditions<S> };
    if (candidate?._conditions) {
      conds[key] = candidate._conditions;
    } else {
      const builtConditions = (built as { _conditions?: FieldConditions<S> })._conditions;

      if (builtConditions) {
        conds[key] = builtConditions;
      }
    }
  }

  return {
    descriptors: desc,
    conditionsMap: conds,
  };
};

export const shallowEqualErrors = (
  a: Record<string, string | undefined>,
  b: Record<string, string | undefined>,
): boolean => {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) return false;

  for (const key of aKeys) {
    if (a[key] !== b[key]) return false;
  }

  return true;
};

export const shouldValidate = ({
  trigger,
  event,
  isTouched,
  submitted,
  revalidate,
}: {
  trigger: ValidationTrigger;
  event: 'onChange' | 'onBlur';
  isTouched: boolean;
  submitted: boolean;
  revalidate: ValidationTrigger;
}): boolean => {
  const mode = submitted ? revalidate : trigger;

  if (mode === 'onChange' && event === 'onChange') return true;
  if (mode === 'onBlur' && event === 'onBlur') return true;
  if (mode === 'onTouched' && isTouched) return true;

  return false;
};

export const applyImmediateTransforms = (
  descriptor: FieldDescriptor<unknown>,
  rawValue: unknown,
): unknown => {
  let nextValue = rawValue;

  if (descriptor._transform) {
    nextValue = (descriptor._transform as (value: unknown) => unknown)(nextValue);
  }

  return nextValue;
};

export const applyCommittedTransforms = (
  descriptor: FieldDescriptor<unknown>,
  rawValue: unknown,
): unknown => {
  let nextValue = applyImmediateTransforms(descriptor, rawValue);

  if (descriptor._trim && typeof nextValue === 'string') {
    nextValue = nextValue.trim();
  }

  return nextValue;
};

export const applySubmitTransforms = (
  descriptor: FieldDescriptor<unknown>,
  rawValue: unknown,
): unknown => {
  let nextValue = applyCommittedTransforms(descriptor, rawValue);

  if (descriptor._outputTransform) {
    nextValue = (descriptor._outputTransform as (value: unknown) => unknown)(nextValue);
  }

  return nextValue;
};

export const computeTransformedValues = (
  values: Record<string, unknown>,
  descriptors: Record<string, FieldDescriptor<unknown>>,
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    const descriptor = descriptors[key];
    result[key] = descriptor?._outputTransform
      ? (descriptor._outputTransform as (v: unknown) => unknown)(value)
      : value;
  }
  return result;
};

function shallowEqualObject(
  a: Record<string, unknown> | undefined,
  b: Record<string, unknown> | undefined,
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) return false;

  for (const key of aKeys) {
    if (!Object.is(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

export const areVisibilityMapsEqual = (a: VisibilityMap, b: VisibilityMap): boolean => {
  if (a === b) return true;

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) return false;

  for (const key of aKeys) {
    if (
      !shallowEqualObject(
        a[key] as unknown as Record<string, unknown>,
        b[key] as unknown as Record<string, unknown>,
      )
    ) {
      return false;
    }
  }

  return true;
};

type AnalyticsTracker = FormBridgeAnalyticsTracker | null;

export const emitFieldErrorAnalytics = (
  analytics: AnalyticsTracker,
  name: string,
  previousError: string | undefined,
  nextError: string | undefined,
): void => {
  if (previousError === nextError) {
    return;
  }

  if (nextError) {
    analytics?.onFieldError(name, nextError);
    return;
  }

  if (previousError) {
    analytics?.onFieldErrorFixed(name);
  }
};

export const emitErrorsDiffAnalytics = (
  analytics: AnalyticsTracker,
  previousErrors: Record<string, string | undefined>,
  nextErrors: Record<string, string | undefined>,
): void => {
  const fieldNames = new Set([
    ...Object.keys(previousErrors),
    ...Object.keys(nextErrors),
  ]);

  for (const fieldName of fieldNames) {
    emitFieldErrorAnalytics(
      analytics,
      fieldName,
      previousErrors[fieldName],
      nextErrors[fieldName],
    );
  }
};
