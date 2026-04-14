import type {
  ValidationErrorMap,
  ValidationIssue,
  ValidationIssueInput,
  ValidationPath,
  ValidationResult,
  ValidatorResult,
} from '../../types/validation';
import { normalizeReferencePath } from './reference';

export function isPromiseLike<T = unknown>(value: unknown): value is PromiseLike<T> {
  return Boolean(value && typeof (value as PromiseLike<T>).then === 'function');
}

export function normalizeValidationPath(path?: string | ValidationPath): ValidationPath {
  if (!path) {
    return [];
  }

  return normalizeReferencePath(path);
}

export function pathToFieldKey(path: ValidationPath): string | null {
  return path.length ? path.map(String).join('.') : null;
}

export function createValidationIssue(
  result: ValidatorResult,
  defaults: {
    path?: string | ValidationPath;
    code: string;
    message: string;
    params?: Record<string, unknown>;
  },
  errorMap?: ValidationErrorMap,
): ValidationIssue | null {
  if (!result) {
    return null;
  }

  const rawIssue: ValidationIssueInput =
    typeof result === 'string' ? { message: result } : result;

  const issue: ValidationIssue = {
    path: normalizeValidationPath(rawIssue.path ?? defaults.path),
    code: rawIssue.code ?? defaults.code,
    message: rawIssue.message ?? defaults.message,
    params: rawIssue.params ?? defaults.params,
  };

  const mappedMessage = errorMap?.(issue);

  return {
    ...issue,
    message: mappedMessage ?? issue.message,
  };
}

export function buildValidationResult<TData>(
  data: TData | null,
  issues: ValidationIssue[],
): ValidationResult<TData> {
  const errorsByField: Record<string, string> = {};
  const formErrors: string[] = [];

  for (const issue of issues) {
    const fieldKey = pathToFieldKey(issue.path);

    if (!fieldKey) {
      formErrors.push(issue.message);
      continue;
    }

    if (!errorsByField[fieldKey]) {
      errorsByField[fieldKey] = issue.message;
    }
  }

  return {
    success: issues.length === 0,
    data: issues.length === 0 ? data : null,
    issues,
    errorsByField,
    formErrors,
  };
}
