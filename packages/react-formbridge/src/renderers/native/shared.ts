import type { ColorValue, ImageStyle, StyleProp } from 'react-native';

import type { ExtraFieldProps, NativeFieldUiOverrides } from '../../types';

export type NativeExtraProps<TNative = NativeFieldUiOverrides> = Omit<
  ExtraFieldProps,
  'ui'
> & {
  ui?: TNative;
};

export type NativeBaseUiOverrides = NativeFieldUiOverrides;

export type ResolvedNativeFieldUi = Pick<
  NativeFieldUiOverrides,
  | 'id'
  | 'testID'
  | 'readOnly'
  | 'autoComplete'
  | 'autoFocus'
  | 'keyboardType'
  | 'secureTextEntry'
  | 'highlightOnError'
  | 'renderPicker'
>;

// biome-ignore lint/suspicious/noExplicitAny: React Native style props mix registered numeric styles with view/text/image objects, so this helper needs a permissive bridge type.
export function sx(...styles: Array<StyleProp<any> | undefined | null | false>) {
  return styles.filter(Boolean);
}

export function isImageLike(uriOrType?: string | null): boolean {
  if (!uriOrType) return false;
  return (
    uriOrType.startsWith('image/') ||
    /\.(png|jpe?g|webp|gif|bmp|heic|heif|svg)$/i.test(uriOrType)
  );
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function shouldHighlightOnError(override?: boolean, fallback?: boolean): boolean {
  return override ?? fallback ?? true;
}

export function defaultBorderColor(
  hasError: boolean,
  highlightOnError = true,
  defaultColor: ColorValue = '#e5e7eb',
  errorColor: ColorValue = '#ef4444',
): ColorValue {
  return hasError && highlightOnError ? errorColor : defaultColor;
}

export type NativeTextFieldDescriptorWebLike = {
  _ui?: ResolvedNativeFieldUi;
};

export type NativeImageStyle = StyleProp<ImageStyle>;
