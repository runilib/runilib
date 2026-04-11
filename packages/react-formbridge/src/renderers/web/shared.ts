import type { CSSProperties } from 'react';

import type { WebFieldPropsOverrides } from '../../types/ui-web';

export const WEB_ERROR_COLOR = '#ef4444';
export const WEB_ERROR_BOX_SHADOW = '0 0 0 1px rgba(239, 68, 68, 0.16) inset';

export function shouldHighlightOnError(override?: boolean, fallback?: boolean): boolean {
  return override ?? fallback ?? true;
}

export function defaultBorderColor(
  hasError: boolean,
  highlightOnError: boolean,
  defaultColor: string,
  errorColor = WEB_ERROR_COLOR,
): string {
  return hasError && highlightOnError ? errorColor : defaultColor;
}

export function defaultErrorChromeStyle(
  hasError: boolean,
  highlightOnError: boolean,
): CSSProperties | undefined {
  if (!hasError || !highlightOnError) {
    return undefined;
  }

  return {
    borderColor: WEB_ERROR_COLOR,
    boxShadow: WEB_ERROR_BOX_SHADOW,
  };
}

export function defaultErrorTextStyle(hasError: boolean): CSSProperties | undefined {
  if (!hasError) {
    return undefined;
  }

  return {
    color: WEB_ERROR_COLOR,
  };
}

export function defaultRequiredMarkStyle(): CSSProperties {
  return {
    color: WEB_ERROR_COLOR,
  };
}

export type ResolvedWebFieldProps = Pick<
  WebFieldPropsOverrides,
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

export function resolveWebInputBehavior(
  override?: Partial<ResolvedWebFieldProps>,
  fallback?: Partial<ResolvedWebFieldProps>,
): Pick<
  ResolvedWebFieldProps,
  'readOnly' | 'autoComplete' | 'autoFocus' | 'spellCheck' | 'inputMode' | 'enterKeyHint'
> {
  return {
    readOnly: override?.readOnly ?? fallback?.readOnly,
    autoComplete: override?.autoComplete ?? fallback?.autoComplete,
    autoFocus: override?.autoFocus ?? fallback?.autoFocus,
    spellCheck: override?.spellCheck ?? fallback?.spellCheck,
    inputMode: override?.inputMode ?? fallback?.inputMode,
    enterKeyHint: override?.enterKeyHint ?? fallback?.enterKeyHint,
  };
}
