import type { BridgeResult, SchemaValidatorBridge } from '../../types/options';

type BridgeValues = Record<string, unknown>;
type BridgePathSegment = string | number;

export type BridgePathInput =
  | BridgePathSegment
  | BridgePathSegment[]
  | null
  | string
  | undefined;

export type BridgeErrorMode = 'first' | 'join' | 'last';

export const FORM_ROOT_ERROR_KEY = '_root';

export interface BridgeIssueMapResult {
  path?: BridgePathInput;
  message?: string | null;
}

export interface BridgeIssueContext<TIssue = unknown> {
  issue: TIssue;
  index: number;
  values: BridgeValues;
  defaultMessage: string;
  defaultPath: BridgePathSegment[];
  defaultPathKey: string | null;
  rootKey: string | null;
}

export interface BridgeAdapterOptions<TIssue = unknown> {
  /**
   * Where pathless errors should land.
   * Set to `null` to drop form-level errors entirely.
   */
  rootKey?: string | null;
  /**
   * How to aggregate multiple messages targeting the same field.
   */
  errorMode?: BridgeErrorMode;
  /**
   * Separator used when `errorMode` is `join`.
   */
  joinMessagesWith?: string;
  /**
   * Customize the final key written in the error bag.
   */
  formatPath?: (path: BridgePathSegment[], issue: TIssue) => string | null | undefined;
  /**
   * Customize or skip an issue before it is added to the error bag.
   */
  mapIssue?: (
    context: BridgeIssueContext<TIssue>,
  ) => BridgeIssueMapResult | null | undefined;
  /**
   * Final message normalization hook.
   */
  normalizeMessage?: (message: string, issue: TIssue) => string;
}

// ─── Shared helpers ──────────────────────────────────────────────────────────

function isRecord(value: unknown): value is BridgeValues {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toBridgeValues(candidate: unknown, fallback: BridgeValues): BridgeValues {
  return isRecord(candidate) ? candidate : fallback;
}

function splitPathString(path: string): BridgePathSegment[] {
  return path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => (/^\d+$/.test(segment) ? Number(segment) : segment));
}

function toPathSegments(path: BridgePathInput): BridgePathSegment[] {
  if (path == null) {
    return [];
  }

  if (Array.isArray(path)) {
    return path.filter(
      (segment): segment is BridgePathSegment =>
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

function defaultPathKey(path: BridgePathSegment[]): string | null {
  return path.length > 0 ? path.map(String).join('.') : null;
}

function resolveErrorKey<TIssue>(
  path: BridgePathInput,
  issue: TIssue,
  options: BridgeAdapterOptions<TIssue>,
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
  options: BridgeAdapterOptions<TIssue>,
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
  options: BridgeAdapterOptions<TIssue>,
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
  values: BridgeValues,
  options: BridgeAdapterOptions<TIssue>,
  getIssuePath: (issue: TIssue) => BridgePathInput,
  getIssueMessage: (issue: TIssue) => string | undefined,
): Record<string, string> {
  const errors: Record<string, string> = {};

  issues.forEach((issue, index) => {
    const defaultPath = toPathSegments(getIssuePath(issue));
    const defaultMessage = normalizeMessage(getIssueMessage(issue), issue, options);

    const context: BridgeIssueContext<TIssue> = {
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

function success(values: unknown, fallback: BridgeValues): BridgeResult {
  return {
    values: toBridgeValues(values, fallback),
    errors: {},
  };
}

function failure(values: BridgeValues, errors: Record<string, string>): BridgeResult {
  return { values, errors };
}

type BridgeMode = 'async' | 'auto' | 'sync';

// ─── Zod ─────────────────────────────────────────────────────────────────────

export interface ZodBridgeIssue {
  path?: BridgePathInput;
  message?: string;
}

interface ZodParseSuccess {
  success: true;
  data: unknown;
}

interface ZodParseFailure {
  success: false;
  error?: {
    issues?: ZodBridgeIssue[];
  };
}

type ZodParseResult = ZodParseFailure | ZodParseSuccess;

interface ZodSchema {
  safeParse?: (data: unknown, options?: unknown) => ZodParseResult;
  safeParseAsync?: (data: unknown, options?: unknown) => Promise<ZodParseResult>;
}

export interface ZodBridgeOptions extends BridgeAdapterOptions<ZodBridgeIssue> {
  mode?: BridgeMode;
  parseOptions?: unknown;
}

async function executeZodParse(
  schema: ZodSchema,
  values: BridgeValues,
  options: ZodBridgeOptions,
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
    '[@runilib/react-formbridge] zodBridge expected a schema exposing safeParse or safeParseAsync.',
  );
}

export function zodBridge(
  schema: ZodSchema,
  options: ZodBridgeOptions = {},
): SchemaValidatorBridge {
  return async (values): Promise<BridgeResult> => {
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
