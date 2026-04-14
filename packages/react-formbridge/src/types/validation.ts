export type ValidationPathSegment = string | number;

export type ValidationPath = ValidationPathSegment[];

export interface ValidationIssue {
  path: ValidationPath;
  code: string;
  message: string;
  params?: Record<string, unknown>;
}

export interface ValidationIssueInput {
  path?: ValidationPath | string;
  code?: string;
  message?: string;
  params?: Record<string, unknown>;
}

export interface ValidationResult<TData = Record<string, unknown>> {
  success: boolean;
  data: TData | null;
  issues: ValidationIssue[];
  errorsByField: Record<string, string>;
  formErrors: string[];
}

export type ValidationErrorMap = (issue: ValidationIssue) => string | undefined;

export type ValidatorResult = string | null | ValidationIssueInput;

export interface ValidationContext {
  addIssue: (issue: ValidatorResult) => void;
}

export interface FieldReference<Path extends string = string> {
  readonly __type: 'field-ref';
  readonly path: Path;
}
