import type { ResolverResult, SchemaResolver } from '../../types/options';

type ResolverValues = Record<string, unknown>;
type ResolverPathSegment = string | number;

export type ResolverPathInput =
  | ResolverPathSegment
  | ResolverPathSegment[]
  | null
  | string
  | undefined;

export type ResolverErrorMode = 'first' | 'join' | 'last';

export const FORM_ROOT_ERROR_KEY = '_root';

export interface ResolverIssueMapResult {
  path?: ResolverPathInput;
  message?: string | null;
}

export interface ResolverIssueContext<TIssue = unknown> {
  issue: TIssue;
  index: number;
  values: ResolverValues;
  defaultMessage: string;
  defaultPath: ResolverPathSegment[];
  defaultPathKey: string | null;
  rootKey: string | null;
}

export interface ResolverAdapterOptions<TIssue = unknown> {
  /**
   * Where pathless errors should land.
   * Set to `null` to drop form-level errors entirely.
   */
  rootKey?: string | null;
  /**
   * How to aggregate multiple messages targeting the same field.
   */
  errorMode?: ResolverErrorMode;
  /**
   * Separator used when `errorMode` is `join`.
   */
  joinMessagesWith?: string;
  /**
   * Customize the final key written in the error bag.
   */
  formatPath?: (path: ResolverPathSegment[], issue: TIssue) => string | null | undefined;
  /**
   * Customize or skip an issue before it is added to the error bag.
   */
  mapIssue?: (
    context: ResolverIssueContext<TIssue>,
  ) => ResolverIssueMapResult | null | undefined;
  /**
   * Final message normalization hook.
   */
  normalizeMessage?: (message: string, issue: TIssue) => string;
}

// ─── Shared helpers ──────────────────────────────────────────────────────────

function isRecord(value: unknown): value is ResolverValues {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toResolverValues(candidate: unknown, fallback: ResolverValues): ResolverValues {
  return isRecord(candidate) ? candidate : fallback;
}

function splitPathString(path: string): ResolverPathSegment[] {
  return path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => (/^\d+$/.test(segment) ? Number(segment) : segment));
}

function toPathSegments(path: ResolverPathInput): ResolverPathSegment[] {
  if (path == null) {
    return [];
  }

  if (Array.isArray(path)) {
    return path.filter(
      (segment): segment is ResolverPathSegment =>
        typeof segment === 'string' || typeof segment === 'number',
    );
  }

  if (typeof path === 'number') {
    return [path];
  }

  if (typeof path === 'string') {
    return splitPathString(path);
  }

  return [];
}

function defaultPathKey(path: ResolverPathSegment[]): string | null {
  return path.length > 0 ? path.map(String).join('.') : null;
}

function resolveErrorKey<TIssue>(
  path: ResolverPathInput,
  issue: TIssue,
  options: ResolverAdapterOptions<TIssue>,
): string | null {
  const segments = toPathSegments(path);

  if (segments.length === 0) {
    return options.rootKey === null ? null : (options.rootKey ?? FORM_ROOT_ERROR_KEY);
  }

  if (options.formatPath) {
    const customKey = options.formatPath(segments, issue);
    return customKey?.trim() ? customKey : null;
  }

  return defaultPathKey(segments);
}

function normalizeMessage<TIssue>(
  message: string | undefined,
  issue: TIssue,
  options: ResolverAdapterOptions<TIssue>,
): string {
  const safeMessage = String(message ?? 'Invalid value.').trim() || 'Invalid value.';
  const normalized = options.normalizeMessage
    ? options.normalizeMessage(safeMessage, issue)
    : safeMessage;

  return normalized.trim();
}

function appendError<TIssue>(
  errors: Record<string, string>,
  key: string | null,
  message: string,
  options: ResolverAdapterOptions<TIssue>,
): void {
  if (!key || !message) {
    return;
  }

  const existing = errors[key];

  if (!existing) {
    errors[key] = message;
    return;
  }

  switch (options.errorMode ?? 'first') {
    case 'last':
      errors[key] = message;
      return;

    case 'join': {
      if (existing === message) {
        return;
      }

      const separator = options.joinMessagesWith ?? '\n';
      errors[key] = `${existing}${separator}${message}`;
      return;
    }

    default:
      return;
  }
}

function collectErrors<TIssue>(
  issues: TIssue[],
  values: ResolverValues,
  options: ResolverAdapterOptions<TIssue>,
  getIssuePath: (issue: TIssue) => ResolverPathInput,
  getIssueMessage: (issue: TIssue) => string | undefined,
): Record<string, string> {
  const errors: Record<string, string> = {};

  issues.forEach((issue, index) => {
    const defaultPath = toPathSegments(getIssuePath(issue));
    const defaultMessage = normalizeMessage(getIssueMessage(issue), issue, options);

    const context: ResolverIssueContext<TIssue> = {
      issue,
      index,
      values,
      defaultMessage,
      defaultPath,
      defaultPathKey: resolveErrorKey(defaultPath, issue, options),
      rootKey: options.rootKey ?? FORM_ROOT_ERROR_KEY,
    };

    const mapped = options.mapIssue?.(context);

    if (mapped === null) {
      return;
    }

    const nextPath = mapped && 'path' in mapped ? mapped.path : defaultPath;
    const nextMessage =
      mapped && 'message' in mapped
        ? String(mapped.message ?? '').trim()
        : defaultMessage;

    appendError(errors, resolveErrorKey(nextPath, issue, options), nextMessage, options);
  });

  return errors;
}

function success(values: unknown, fallback: ResolverValues): ResolverResult {
  return {
    values: toResolverValues(values, fallback),
    errors: {},
  };
}

function failure(values: ResolverValues, errors: Record<string, string>): ResolverResult {
  return { values, errors };
}

type ResolverMode = 'async' | 'auto' | 'sync';

// ─── Zod ─────────────────────────────────────────────────────────────────────

export interface ZodResolverIssue {
  path?: ResolverPathInput;
  message?: string;
}

interface ZodParseSuccess {
  success: true;
  data: unknown;
}

interface ZodParseFailure {
  success: false;
  error?: {
    issues?: ZodResolverIssue[];
  };
}

type ZodParseResult = ZodParseFailure | ZodParseSuccess;

interface ZodSchema {
  safeParse?: (data: unknown, options?: unknown) => ZodParseResult;
  safeParseAsync?: (data: unknown, options?: unknown) => Promise<ZodParseResult>;
}

export interface ZodResolverOptions extends ResolverAdapterOptions<ZodResolverIssue> {
  mode?: ResolverMode;
  parseOptions?: unknown;
}

async function executeZodParse(
  schema: ZodSchema,
  values: ResolverValues,
  options: ZodResolverOptions,
): Promise<ZodParseResult> {
  if (
    (options.mode === 'async' || options.mode === 'auto' || options.mode == null) &&
    typeof schema.safeParseAsync === 'function'
  ) {
    return schema.safeParseAsync(values, options.parseOptions);
  }

  if (typeof schema.safeParse === 'function') {
    return schema.safeParse(values, options.parseOptions);
  }

  if (typeof schema.safeParseAsync === 'function') {
    return schema.safeParseAsync(values, options.parseOptions);
  }

  throw new Error(
    '[@runilib/react-formbridge] zodResolver expected a schema exposing safeParse or safeParseAsync.',
  );
}

export function zodResolver(
  schema: ZodSchema,
  options: ZodResolverOptions = {},
): SchemaResolver {
  return async (values): Promise<ResolverResult> => {
    const result = await executeZodParse(schema, values, options);

    if (result.success) {
      return success(result.data, values);
    }

    const failureResult = result;

    return failure(
      values,
      collectErrors(
        failureResult.error?.issues ?? [],
        values,
        options,
        (issue) => issue.path,
        (issue) => issue.message,
      ),
    );
  };
}
