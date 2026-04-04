import type { WebFieldUiOverrides } from '../../types';

export function shouldHighlightOnError(override?: boolean, fallback?: boolean): boolean {
  return override ?? fallback ?? true;
}

export function defaultBorderColor(
  hasError: boolean,
  highlightOnError: boolean,
  defaultColor: string,
  errorColor = '#ef4444',
): string {
  return hasError && highlightOnError ? errorColor : defaultColor;
}

export type ResolvedWebFieldUi = Pick<
  WebFieldUiOverrides,
  | 'id'
  | 'readOnly'
  | 'autoComplete'
  | 'autoFocus'
  | 'spellCheck'
  | 'inputMode'
  | 'enterKeyHint'
  | 'highlightOnError'
  | 'renderPicker'
>;
