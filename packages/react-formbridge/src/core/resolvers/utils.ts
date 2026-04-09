import type { ResolverResult } from '../../types/options';
import {
  FORM_ROOT_ERROR_KEY,
  type ResolverAdapterOptions,
  type ResolverIssueContext,
  type ResolverPathInput,
  type ResolverPathSegment,
  type ResolverValues,
} from './types';

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

export function collectErrors<TIssue>(
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

export function success(values: unknown, fallback: ResolverValues): ResolverResult {
  return {
    values: toResolverValues(values, fallback),
    errors: {},
  };
}

export function failure(
  values: ResolverValues,
  errors: Record<string, string>,
): ResolverResult {
  return { values, errors };
}

export type ResolverMode = 'async' | 'auto' | 'sync';
