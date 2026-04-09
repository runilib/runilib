import type {
  ColorValue,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import type { NativeFieldUiOverrides } from '../../types/ui-native';

export type NativeBaseUiOverrides = NativeFieldUiOverrides;
export const NATIVE_ERROR_COLOR = '#ef4444';

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
  errorColor: ColorValue = NATIVE_ERROR_COLOR,
): ColorValue {
  return hasError && highlightOnError ? errorColor : defaultColor;
}

export function defaultErrorChromeStyle(
  hasError: boolean,
  highlightOnError: boolean,
): ViewStyle | undefined {
  if (!hasError || !highlightOnError) {
    return undefined;
  }

  return {
    borderColor: NATIVE_ERROR_COLOR,
    borderWidth: 1,
  };
}

export function defaultErrorTextStyle(hasError: boolean): TextStyle | undefined {
  if (!hasError) {
    return undefined;
  }

  return {
    color: NATIVE_ERROR_COLOR,
  };
}

export function defaultRequiredMarkStyle(): TextStyle {
  return {
    color: NATIVE_ERROR_COLOR,
  };
}

export type NativeTextFieldDescriptorWebLike = {
  _ui?: ResolvedNativeFieldUi;
};

export type NativeImageStyle = StyleProp<ImageStyle>;
