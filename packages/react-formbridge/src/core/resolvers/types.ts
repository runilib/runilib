export type ResolverValues = Record<string, unknown>;
export type ResolverPathSegment = string | number;

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

export type ResolverMode = 'async' | 'auto' | 'sync';
