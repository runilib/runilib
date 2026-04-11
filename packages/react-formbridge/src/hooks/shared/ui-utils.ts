import type {
  ExtraFieldProps,
  FieldStyleValue,
  FieldTheme,
  NativeFieldPropsOverrides,
  NativeFormPropsOverrides,
  NativeGlobalFieldPropsOverrides,
  NativeStyleValue,
  NativeSubmitPropsOverrides,
  WebFieldPropsOverrides,
  WebFormPropsOverrides,
  WebGlobalFieldPropsOverrides,
  WebSubmitPropsOverrides,
} from '../../types';

function mergeClassNames(...values: Array<string | undefined>): string | undefined {
  const merged = values.filter(Boolean).join(' ').trim();
  return merged || undefined;
}

function mergeObjectLike<T extends object>(base?: T, override?: T): T | undefined {
  if (!base && !override) return undefined;

  return {
    ...base,
    ...override,
  } as T;
}

function mergeWebSlotClasses(
  base?: WebFieldPropsOverrides['classNames'],
  override?: WebFieldPropsOverrides['classNames'],
): WebFieldPropsOverrides['classNames'] | undefined {
  if (!base && !override) return undefined;

  const keys = new Set([...Object.keys(base ?? {}), ...Object.keys(override ?? {})]);

  const merged: NonNullable<WebFieldPropsOverrides['classNames']> = {};

  for (const key of keys) {
    const next = mergeClassNames(base?.[key], override?.[key]);

    if (next) {
      merged[key] = next;
    }
  }

  return Object.keys(merged).length ? merged : undefined;
}

function mergeWebSlotStyles(
  base?: WebFieldPropsOverrides['styles'],
  override?: WebFieldPropsOverrides['styles'],
): WebFieldPropsOverrides['styles'] | undefined {
  if (!base && !override) return undefined;

  const keys = new Set([...Object.keys(base ?? {}), ...Object.keys(override ?? {})]);

  const merged: NonNullable<WebFieldPropsOverrides['styles']> = {};

  for (const key of keys) {
    merged[key] = { ...base?.[key], ...override?.[key] };
  }

  return Object.keys(merged).length ? merged : undefined;
}

function mergeNativeStyleValue(
  base?: NativeStyleValue,
  override?: NativeStyleValue,
): NativeStyleValue | undefined {
  if (!base) return override;
  if (!override) return base;
  return [base, override];
}

function mergeNativeSlotStyles(
  base?: NativeFieldPropsOverrides['styles'],
  override?: NativeFieldPropsOverrides['styles'],
): NativeFieldPropsOverrides['styles'] | undefined {
  if (!base && !override) return undefined;

  const keys = new Set([...Object.keys(base ?? {}), ...Object.keys(override ?? {})]);

  const merged: NonNullable<NativeFieldPropsOverrides['styles']> = {};

  for (const key of keys) {
    merged[key] = mergeNativeStyleValue(base?.[key], override?.[key]);
  }

  return Object.keys(merged).length ? merged : undefined;
}

export function mergeWebFieldProps(
  baseProps?: WebFieldPropsOverrides,
  overrideProps?: WebFieldPropsOverrides,
): WebFieldPropsOverrides | undefined {
  if (!baseProps && !overrideProps) return undefined;

  return {
    ...baseProps,
    ...overrideProps,
    classNames: mergeWebSlotClasses(baseProps?.classNames, overrideProps?.classNames),
    styles: mergeWebSlotStyles(baseProps?.styles, overrideProps?.styles),
    rootProps: mergeObjectLike(baseProps?.rootProps, overrideProps?.rootProps),
    labelProps: mergeObjectLike(baseProps?.labelProps, overrideProps?.labelProps),
    inputProps: mergeObjectLike(baseProps?.inputProps, overrideProps?.inputProps),
    textareaProps: mergeObjectLike(
      baseProps?.textareaProps,
      overrideProps?.textareaProps,
    ),
    selectProps: mergeObjectLike(baseProps?.selectProps, overrideProps?.selectProps),
    hintProps: mergeObjectLike(baseProps?.hintProps, overrideProps?.hintProps),
    errorProps: mergeObjectLike(baseProps?.errorProps, overrideProps?.errorProps),
    renderLabel: overrideProps?.renderLabel ?? baseProps?.renderLabel,
    renderHint: overrideProps?.renderHint ?? baseProps?.renderHint,
    renderError: overrideProps?.renderError ?? baseProps?.renderError,
    renderRequiredMark:
      overrideProps?.renderRequiredMark ?? baseProps?.renderRequiredMark,
    renderPicker: overrideProps?.renderPicker ?? baseProps?.renderPicker,
  };
}

export function mergeNativeFieldProps(
  base?: NativeFieldPropsOverrides,
  override?: NativeFieldPropsOverrides,
): NativeFieldPropsOverrides | undefined {
  if (!base && !override) return undefined;

  return {
    ...base,
    ...override,
    styles: mergeNativeSlotStyles(base?.styles, override?.styles),
    rootProps: mergeObjectLike(base?.rootProps, override?.rootProps),
    labelProps: mergeObjectLike(base?.labelProps, override?.labelProps),
    inputProps: mergeObjectLike(base?.inputProps, override?.inputProps),
    hintProps: mergeObjectLike(base?.hintProps, override?.hintProps),
    errorProps: mergeObjectLike(base?.errorProps, override?.errorProps),
    renderLabel: override?.renderLabel ?? base?.renderLabel,
    renderHint: override?.renderHint ?? base?.renderHint,
    renderError: override?.renderError ?? base?.renderError,
    renderRequiredMark: override?.renderRequiredMark ?? base?.renderRequiredMark,
    renderPicker: override?.renderPicker ?? base?.renderPicker,
  };
}

export function mergeFieldStyleProps<
  TLocalProps extends WebFieldPropsOverrides | WebGlobalFieldPropsOverrides,
>(
  platform: 'web',
  theme?: FieldTheme<WebGlobalFieldPropsOverrides, 'web'>,
  local?: ExtraFieldProps<TLocalProps, 'web'>,
): ExtraFieldProps<TLocalProps, 'web'> | undefined;
export function mergeFieldStyleProps<
  TLocalProps extends NativeFieldPropsOverrides | NativeGlobalFieldPropsOverrides,
>(
  platform: 'native',
  theme?: FieldTheme<NativeGlobalFieldPropsOverrides, 'native'>,
  local?: ExtraFieldProps<TLocalProps, 'native'>,
): ExtraFieldProps<TLocalProps, 'native'> | undefined;
export function mergeFieldStyleProps<
  TWebLocalProps extends WebFieldPropsOverrides | WebGlobalFieldPropsOverrides,
  TNativeLocalProps extends NativeFieldPropsOverrides | NativeGlobalFieldPropsOverrides,
>(
  platform: 'web' | 'native',
  theme?:
    | FieldTheme<WebGlobalFieldPropsOverrides, 'web'>
    | FieldTheme<NativeGlobalFieldPropsOverrides, 'native'>,
  local?:
    | ExtraFieldProps<TWebLocalProps, 'web'>
    | ExtraFieldProps<TNativeLocalProps, 'native'>,
):
  | ExtraFieldProps<TWebLocalProps, 'web'>
  | ExtraFieldProps<TNativeLocalProps, 'native'>
  | undefined {
  if (!theme && !local) return undefined;

  if (platform === 'web') {
    const webTheme = theme as FieldTheme<WebGlobalFieldPropsOverrides, 'web'> | undefined;
    const webLocal = local as ExtraFieldProps<TWebLocalProps, 'web'> | undefined;
    const mergedStyle =
      webTheme?.style || webLocal?.style
        ? Object.assign({}, webTheme?.style ?? {}, webLocal?.style ?? {})
        : undefined;
    const mergedClassName = mergeClassNames(webTheme?.className, webLocal?.className);
    const mergedProps = mergeWebFieldProps(webTheme, webLocal);

    return {
      ...mergedProps,
      ...(mergedClassName ? { className: mergedClassName } : {}),
      ...(mergedStyle ? { style: mergedStyle } : {}),
      label: webLocal?.label,
      placeholder: webLocal?.placeholder,
      hint: webLocal?.hint,
    } as ExtraFieldProps<TWebLocalProps, 'web'>;
  }

  const nativeTheme = theme as
    | FieldTheme<NativeGlobalFieldPropsOverrides, 'native'>
    | undefined;
  const nativeLocal = local as ExtraFieldProps<TNativeLocalProps, 'native'> | undefined;
  const mergedStyle = mergeNativeStyleValue(nativeTheme?.style, nativeLocal?.style);
  const mergedProps = mergeNativeFieldProps(nativeTheme, nativeLocal);

  return {
    ...mergedProps,
    ...(mergedStyle ? { style: mergedStyle } : {}),
    label: nativeLocal?.label,
    placeholder: nativeLocal?.placeholder,
    hint: nativeLocal?.hint,
  } as ExtraFieldProps<TNativeLocalProps, 'native'>;
}

export function mergeWebFormProps(
  theme: WebFormPropsOverrides | undefined,
  localClassName?: string,
  localStyle?: FieldStyleValue,
): {
  className?: string;
  style?: FieldStyleValue;
  props?: WebFormPropsOverrides['props'];
} {
  return {
    className: mergeClassNames(theme?.className, localClassName),
    style:
      theme?.style || localStyle
        ? Object.assign({}, theme?.style ?? {}, localStyle ?? {})
        : undefined,
    props: theme?.props,
  };
}

export function mergeWebSubmitProps(
  theme: WebSubmitPropsOverrides | undefined,
  localClassName?: string,
  localStyle?: FieldStyleValue,
  localLoadingText?: string,
): {
  className?: string;
  style?: FieldStyleValue;
  loadingText?: string;
  props?: WebSubmitPropsOverrides['props'];
} {
  return {
    className: mergeClassNames(theme?.className, localClassName),
    style:
      theme?.style || localStyle
        ? Object.assign({}, theme?.style ?? {}, localStyle ?? {})
        : undefined,
    loadingText: localLoadingText ?? theme?.loadingText,
    props: theme?.props,
  };
}

export function mergeNativeFormProps(
  theme: NativeFormPropsOverrides | undefined,
  localStyle?: FieldStyleValue,
): {
  style?: NativeStyleValue;
  props?: NativeFormPropsOverrides['props'];
} {
  return {
    style: mergeNativeStyleValue(
      theme?.style,
      localStyle as NativeStyleValue | undefined,
    ),
    props: theme?.props,
  };
}

export function mergeNativeSubmitProps(
  theme: NativeSubmitPropsOverrides | undefined,
  localStyle?: FieldStyleValue,
  localLoadingText?: string,
): {
  style?: NativeStyleValue;
  containerStyle?: NativeStyleValue;
  textStyle?: NativeStyleValue;
  indicatorColor?: string;
  loadingText?: string;
  props?: NativeSubmitPropsOverrides['props'];
  contentProps?: NativeSubmitPropsOverrides['contentProps'];
} {
  return {
    style: mergeNativeStyleValue(
      theme?.style,
      localStyle as NativeStyleValue | undefined,
    ),
    containerStyle: theme?.containerStyle,
    textStyle: theme?.textStyle,
    indicatorColor: theme?.indicatorColor,
    loadingText: localLoadingText ?? theme?.loadingText,
    props: theme?.props,
    contentProps: theme?.contentProps,
  };
}
