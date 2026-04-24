export type BridgeValues = Record<string, unknown>;
export type BridgePathSegment = string | number;

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

export type BridgeMode = 'async' | 'auto' | 'sync';
