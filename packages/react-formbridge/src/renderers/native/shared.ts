import type { ColorValue, ImageStyle, StyleProp } from 'react-native';

import type {
  ExtraFieldProps,
  NativeFieldUiOverrides,
  NativeStyleValue,
} from '../../types';

export type NativeExtraProps<TNative = NativeFieldUiOverrides> = Omit<
  ExtraFieldProps,
  'appearance'
> & {
  appearance?: TNative;
};

export type NativeBaseUiOverrides = NativeFieldUiOverrides;

export type ResolvedNativeFieldUi = NativeFieldUiOverrides & {
  id?: string;
  testID?: string;
  readOnly?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  keyboardType?: string;
  secureTextEntry?: boolean;
  rootStyle?: NativeStyleValue;
  labelStyle?: NativeStyleValue;
  inputStyle?: NativeStyleValue;
  hintStyle?: NativeStyleValue;
  errorStyle?: NativeStyleValue;
};

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
