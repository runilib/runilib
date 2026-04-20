import type { FieldDescriptor } from '../../types/field';
import type {
  ValidationErrorMap,
  ValidationIssue,
  ValidationPath,
} from '../../types/validation';
import { createValidationIssue, isPromiseLike } from './issues';

function matchesPattern(pattern: RegExp, value: string): boolean {
  return new RegExp(pattern.source, pattern.flags).test(value);
}

function applyValidationTransforms<V>(
  descriptor: FieldDescriptor<V>,
  value: unknown,
): unknown {
  let nextValue = value;

  if (descriptor._trim && typeof nextValue === 'string') {
    nextValue = nextValue.trim();
  }

  if (descriptor._transform) {
    nextValue = (descriptor._transform as (input: unknown) => unknown)(nextValue);
  }

  return nextValue;
}

function evaluateBuiltInRules<V>(
  descriptor: FieldDescriptor<V>,
  value: unknown,
  options: {
    path?: string | ValidationPath;
    errorMap?: ValidationErrorMap;
  } = {},
): {
  value: unknown;
  issue: ValidationIssue | null;
  skipCustomValidators: boolean;
} {
  const nextValue = applyValidationTransforms(descriptor, value);
  const { path, errorMap } = options;

  if (descriptor._required) {
    const empty =
      nextValue === null ||
      nextValue === undefined ||
      (typeof nextValue === 'string' && nextValue.trim() === '') ||
      (typeof nextValue === 'boolean' && nextValue === false && descriptor._required);

    if (empty) {
      return {
        value: nextValue,
        issue: createValidationIssue(
          descriptor._requiredMsg,
          {
            path,
            code: 'required',
            message: descriptor._requiredMsg,
          },
          errorMap,
        ),
        skipCustomValidators: true,
      };
    }
  }

  if (nextValue === null || nextValue === undefined || nextValue === '') {
    return {
      value: nextValue,
      issue: null,
      skipCustomValidators: true,
    };
  }

  if (descriptor._min !== undefined) {
    if (typeof nextValue === 'string' && nextValue.length < descriptor._min) {
      return {
        value: nextValue,
        issue: createValidationIssue(
          descriptor._minMsg ?? `Min ${descriptor._min} characters.`,
          {
            path,
            code: 'too_small',
            message: descriptor._minMsg ?? `Min ${descriptor._min} characters.`,
            params: {
              min: descriptor._min,
              kind: 'string',
            },
          },
          errorMap,
        ),
        skipCustomValidators: true,
      };
    }

    if (typeof nextValue === 'number' && nextValue < descriptor._min) {
      return {
        value: nextValue,
        issue: createValidationIssue(
          descriptor._minMsg ?? `Min value is ${descriptor._min}.`,
          {
            path,
            code: 'too_small',
            message: descriptor._minMsg ?? `Min value is ${descriptor._min}.`,
            params: {
              min: descriptor._min,
              kind: 'number',
            },
          },
          errorMap,
        ),
        skipCustomValidators: true,
      };
    }
  }

  if (descriptor._max !== undefined) {
    if (typeof nextValue === 'string' && nextValue.length > descriptor._max) {
      return {
        value: nextValue,
        issue: createValidationIssue(
          descriptor._maxMsg ?? `Max ${descriptor._max} characters.`,
          {
            path,
            code: 'too_big',
            message: descriptor._maxMsg ?? `Max ${descriptor._max} characters.`,
            params: {
              max: descriptor._max,
              kind: 'string',
            },
          },
          errorMap,
        ),
        skipCustomValidators: true,
      };
    }

    if (typeof nextValue === 'number' && nextValue > descriptor._max) {
      return {
        value: nextValue,
        issue: createValidationIssue(
          descriptor._maxMsg ?? `Max value is ${descriptor._max}.`,
          {
            path,
            code: 'too_big',
            message: descriptor._maxMsg ?? `Max value is ${descriptor._max}.`,
            params: {
              max: descriptor._max,
              kind: 'number',
            },
          },
          errorMap,
        ),
        skipCustomValidators: true,
      };
    }
  }

  if (descriptor._pattern && typeof nextValue === 'string') {
    if (!matchesPattern(descriptor._pattern, nextValue)) {
      return {
        value: nextValue,
        issue: createValidationIssue(
          descriptor._patternMsg ?? 'Invalid format.',
          {
            path,
            code: 'invalid_string',
            message: descriptor._patternMsg ?? 'Invalid format.',
          },
          errorMap,
        ),
        skipCustomValidators: true,
      };
    }
  }

  if (descriptor._patterns?.length && typeof nextValue === 'string') {
    const matched = descriptor._patterns.some((pattern) =>
      matchesPattern(pattern, nextValue),
    );

    if (!matched) {
      return {
        value: nextValue,
        issue: createValidationIssue(
          descriptor._patternsMsg ?? 'Invalid format.',
          {
            path,
            code: 'invalid_string',
            message: descriptor._patternsMsg ?? 'Invalid format.',
          },
          errorMap,
        ),
        skipCustomValidators: true,
      };
    }
  }

  return {
    value: nextValue,
    issue: null,
    skipCustomValidators: false,
  };
}

function toErrorMap(issues: ValidationIssue[]): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const issue of issues) {
    if (!issue.path.length) {
      continue;
    }

    const key = issue.path.map(String).join('.');
    errors[key] ??= issue.message;
  }

  return errors;
}

/**
 * Runs all validation rules for a field descriptor against a value.
 * Returns the first structured issue found, or null if valid.
 */
export async function validateFieldDetailed<V>(
  descriptor: FieldDescriptor<V>,
  value: unknown,
  allValues: Record<string, unknown>,
  options: {
    path?: string | ValidationPath;
    errorMap?: ValidationErrorMap;
  } = {},
): Promise<ValidationIssue | null> {
  const builtIn = evaluateBuiltInRules(descriptor, value, options);

  if (builtIn.issue || builtIn.skipCustomValidators) {
    return builtIn.issue;
  }

  for (const validator of descriptor._validators) {
    const result = await validator(builtIn.value as V, allValues);
    const issue = createValidationIssue(
      result,
      {
        path: options.path,
        code: 'custom',
        message: 'Invalid value.',
      },
      options.errorMap,
    );

    if (issue) {
      return issue;
    }
  }

  return null;
}

export function validateFieldDetailedSync<V>(
  descriptor: FieldDescriptor<V>,
  value: unknown,
  allValues: Record<string, unknown>,
  options: {
    path?: string | ValidationPath;
    errorMap?: ValidationErrorMap;
  } = {},
): ValidationIssue | null {
  const builtIn = evaluateBuiltInRules(descriptor, value, options);

  if (builtIn.issue || builtIn.skipCustomValidators) {
    return builtIn.issue;
  }

  for (const validator of descriptor._validators) {
    const result = validator(builtIn.value as V, allValues);

    if (isPromiseLike(result)) {
      throw new Error(
        '[@runilib/react-formbridge] Encountered an async validator during a synchronous validation pass. Use safeParseAsync() or validateAsync() instead.',
      );
    }

    const issue = createValidationIssue(
      result,
      {
        path: options.path,
        code: 'custom',
        message: 'Invalid value.',
      },
      options.errorMap,
    );

    if (issue) {
      return issue;
    }
  }

  return null;
}

/**
 * Runs all validation rules for a field descriptor against a value.
 * Returns the first error message found, or null if valid.
 */
export async function validateField<V>(
  descriptor: FieldDescriptor<V>,
  value: unknown,
  allValues: Record<string, unknown>,
  options: {
    path?: string | ValidationPath;
    errorMap?: ValidationErrorMap;
  } = {},
): Promise<string | null> {
  const issue = await validateFieldDetailed(descriptor, value, allValues, options);
  return issue?.message ?? null;
}

export function validateFieldSync<V>(
  descriptor: FieldDescriptor<V>,
  value: unknown,
  allValues: Record<string, unknown>,
  options: {
    path?: string | ValidationPath;
    errorMap?: ValidationErrorMap;
  } = {},
): string | null {
  const issue = validateFieldDetailedSync(descriptor, value, allValues, options);
  return issue?.message ?? null;
}

export async function validateAllDetailed(
  descriptors: Record<string, FieldDescriptor<unknown>>,
  values: Record<string, unknown>,
  options: {
    errorMap?: ValidationErrorMap;
    getDescriptor?: (
      name: string,
      descriptor: FieldDescriptor<unknown>,
    ) => FieldDescriptor<unknown> | null;
  } = {},
): Promise<ValidationIssue[]> {
  const issues = await Promise.all(
    Object.entries(descriptors).map(async ([name, descriptor]) => {
      const nextDescriptor = options.getDescriptor?.(name, descriptor) ?? descriptor;

      if (!nextDescriptor) {
        return null;
      }

      return validateFieldDetailed(nextDescriptor, values[name], values, {
        path: [name],
        errorMap: options.errorMap,
      });
    }),
  );

  return issues.filter((issue): issue is ValidationIssue => issue !== null);
}

export function validateAllDetailedSync(
  descriptors: Record<string, FieldDescriptor<unknown>>,
  values: Record<string, unknown>,
  options: {
    errorMap?: ValidationErrorMap;
    getDescriptor?: (
      name: string,
      descriptor: FieldDescriptor<unknown>,
    ) => FieldDescriptor<unknown> | null;
  } = {},
): ValidationIssue[] {
  return Object.entries(descriptors)
    .map(([name, descriptor]) => {
      const nextDescriptor = options.getDescriptor?.(name, descriptor) ?? descriptor;

      if (!nextDescriptor) {
        return null;
      }

      return validateFieldDetailedSync(nextDescriptor, values[name], values, {
        path: [name],
        errorMap: options.errorMap,
      });
    })
    .filter((issue): issue is ValidationIssue => issue !== null);
}

/**
 * Validates all fields in a schema and returns a map of errors.
 */
export async function validateAll(
  descriptors: Record<string, FieldDescriptor<unknown>>,
  values: Record<string, unknown>,
  options: {
    errorMap?: ValidationErrorMap;
  } = {},
): Promise<Record<string, string>> {
  const issues = await validateAllDetailed(descriptors, values, options);
  return toErrorMap(issues);
}

export function validateAllSync(
  descriptors: Record<string, FieldDescriptor<unknown>>,
  values: Record<string, unknown>,
  options: {
    errorMap?: ValidationErrorMap;
  } = {},
): Record<string, string> {
  const issues = validateAllDetailedSync(descriptors, values, options);
  return toErrorMap(issues);
}

/** Extract default values from a schema of descriptors */
export function extractDefaults(
  descriptors: Record<string, FieldDescriptor<unknown>>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(descriptors).map(([key, descriptor]) => [
      key,
      descriptor._defaultValue,
    ]),
  );
}
