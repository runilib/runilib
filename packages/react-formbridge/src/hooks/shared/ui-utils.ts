import type {
  ExtraFieldProps,
  FieldBehaviorConfig,
  FieldStyleValue,
  FieldTheme,
  NativeFieldUiOverrides,
  NativeFormUiOverrides,
  NativeGlobalFieldUiOverrides,
  NativeStyleValue,
  NativeSubmitUiOverrides,
  WebFieldUiOverrides,
  WebFormUiOverrides,
  WebGlobalFieldUiOverrides,
  WebSubmitUiOverrides,
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
  base?: WebFieldUiOverrides['classNames'],
  override?: WebFieldUiOverrides['classNames'],
): WebFieldUiOverrides['classNames'] | undefined {
  if (!base && !override) return undefined;

  const keys = new Set([...Object.keys(base ?? {}), ...Object.keys(override ?? {})]);

  const merged: NonNullable<WebFieldUiOverrides['classNames']> = {};

  for (const key of keys) {
    const next = mergeClassNames(base?.[key], override?.[key]);

    if (next) {
      merged[key] = next;
    }
  }

  return Object.keys(merged).length ? merged : undefined;
}

function mergeWebSlotStyles(
  base?: WebFieldUiOverrides['styles'],
  override?: WebFieldUiOverrides['styles'],
): WebFieldUiOverrides['styles'] | undefined {
  if (!base && !override) return undefined;

  const keys = new Set([...Object.keys(base ?? {}), ...Object.keys(override ?? {})]);

  const merged: NonNullable<WebFieldUiOverrides['styles']> = {};

  for (const key of keys) {
    //Object.assign({}, base?.[key] ?? {}, override?.[key] ?? {})
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
  base?: NativeFieldUiOverrides['styles'],
  override?: NativeFieldUiOverrides['styles'],
): NativeFieldUiOverrides['styles'] | undefined {
  if (!base && !override) return undefined;

  const keys = new Set([...Object.keys(base ?? {}), ...Object.keys(override ?? {})]);

  const merged: NonNullable<NativeFieldUiOverrides['styles']> = {};

  for (const key of keys) {
    merged[key] = mergeNativeStyleValue(base?.[key], override?.[key]);
  }

  return Object.keys(merged).length ? merged : undefined;
}

export function mergeWebFieldUi(
  base?: WebFieldUiOverrides,
  override?: WebFieldUiOverrides,
): WebFieldUiOverrides | undefined {
  if (!base && !override) return undefined;

  return {
    ...base,
    ...override,
    classNames: mergeWebSlotClasses(base?.classNames, override?.classNames),
    styles: mergeWebSlotStyles(base?.styles, override?.styles),
    rootProps: mergeObjectLike(base?.rootProps, override?.rootProps),
    labelProps: mergeObjectLike(base?.labelProps, override?.labelProps),
    inputProps: mergeObjectLike(base?.inputProps, override?.inputProps),
    textareaProps: mergeObjectLike(base?.textareaProps, override?.textareaProps),
    selectProps: mergeObjectLike(base?.selectProps, override?.selectProps),
    hintProps: mergeObjectLike(base?.hintProps, override?.hintProps),
    errorProps: mergeObjectLike(base?.errorProps, override?.errorProps),
    renderLabel: override?.renderLabel ?? base?.renderLabel,
    renderHint: override?.renderHint ?? base?.renderHint,
    renderError: override?.renderError ?? base?.renderError,
    renderRequiredMark: override?.renderRequiredMark ?? base?.renderRequiredMark,
    renderPicker: override?.renderPicker ?? base?.renderPicker,
  };
}

export function mergeNativeFieldUi(
  base?: NativeFieldUiOverrides,
  override?: NativeFieldUiOverrides,
): NativeFieldUiOverrides | undefined {
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
  TLocalUi extends WebFieldUiOverrides | WebGlobalFieldUiOverrides,
>(
  platform: 'web',
  theme?: FieldTheme<WebGlobalFieldUiOverrides, 'web'>,
  local?: ExtraFieldProps<TLocalUi, 'web'>,
): ExtraFieldProps<TLocalUi, 'web'> | undefined;
export function mergeFieldStyleProps<
  TLocalUi extends NativeFieldUiOverrides | NativeGlobalFieldUiOverrides,
>(
  platform: 'native',
  theme?: FieldTheme<NativeGlobalFieldUiOverrides, 'native'>,
  local?: ExtraFieldProps<TLocalUi, 'native'>,
): ExtraFieldProps<TLocalUi, 'native'> | undefined;
export function mergeFieldStyleProps<
  TWebLocalUi extends WebFieldUiOverrides | WebGlobalFieldUiOverrides,
  TNativeLocalUi extends NativeFieldUiOverrides | NativeGlobalFieldUiOverrides,
>(
  platform: 'web' | 'native',
  theme?:
    | FieldTheme<WebGlobalFieldUiOverrides, 'web'>
    | FieldTheme<NativeGlobalFieldUiOverrides, 'native'>,
  local?: ExtraFieldProps<TWebLocalUi, 'web'> | ExtraFieldProps<TNativeLocalUi, 'native'>,
):
  | ExtraFieldProps<TWebLocalUi, 'web'>
  | ExtraFieldProps<TNativeLocalUi, 'native'>
  | undefined {
  if (!theme && !local) return undefined;

  if (platform === 'web') {
    const webTheme = theme as FieldTheme<WebGlobalFieldUiOverrides, 'web'> | undefined;
    const webLocal = local as ExtraFieldProps<TWebLocalUi, 'web'> | undefined;
    const mergedStyle =
      webTheme?.style || webLocal?.style
        ? Object.assign({}, webTheme?.style ?? {}, webLocal?.style ?? {})
        : undefined;
    const mergedClassName = mergeClassNames(webTheme?.className, webLocal?.className);
    const mergedUi = mergeWebFieldUi(
      webTheme?.ui as WebFieldUiOverrides | undefined,
      webLocal?.ui as WebFieldUiOverrides | undefined,
    );

    return {
      ...webLocal,
      ...(mergedClassName ? { className: mergedClassName } : {}),
      ...(mergedStyle ? { style: mergedStyle } : {}),
      ...(mergedUi ? { ui: mergedUi as TWebLocalUi } : {}),
    };
  }

  const nativeTheme = theme as
    | FieldTheme<NativeGlobalFieldUiOverrides, 'native'>
    | undefined;
  const nativeLocal = local as ExtraFieldProps<TNativeLocalUi, 'native'> | undefined;
  const mergedStyle = mergeNativeStyleValue(nativeTheme?.style, nativeLocal?.style);
  const mergedUi = mergeNativeFieldUi(
    nativeTheme?.ui as NativeFieldUiOverrides | undefined,
    nativeLocal?.ui as NativeFieldUiOverrides | undefined,
  );

  return {
    ...nativeLocal,
    ...(mergedStyle ? { style: mergedStyle } : {}),
    ...(mergedUi ? { ui: mergedUi as TNativeLocalUi } : {}),
  };
}

export function resolveWebFieldConfig(
  behavior?: FieldBehaviorConfig,
): WebFieldUiOverrides | undefined {
  const fromBehavior = behavior
    ? {
        id: behavior.id,
        readOnly: behavior.readOnly,
        autoComplete: behavior.autoComplete,
        autoFocus: behavior.autoFocus,
        spellCheck: behavior.spellCheck,
        inputMode: behavior.inputMode,
        enterKeyHint: behavior.enterKeyHint,
        highlightOnError: behavior.highlightOnError,
        renderPicker: behavior.renderPicker,
      }
    : undefined;

  return fromBehavior;
}

export function resolveNativeFieldConfig(
  behavior?: FieldBehaviorConfig,
): NativeFieldUiOverrides | undefined {
  const fromBehavior = behavior
    ? {
        id: behavior.id,
        testID: behavior.testID,
        readOnly: behavior.readOnly,
        autoComplete: behavior.autoComplete,
        autoFocus: behavior.autoFocus,
        keyboardType: behavior.keyboardType,
        secureTextEntry: behavior.secureTextEntry,
        highlightOnError: behavior.highlightOnError,
        renderPicker: behavior.renderPicker,
      }
    : undefined;

  return fromBehavior;
}

export function mergeWebFormUi(
  theme: WebFormUiOverrides | undefined,
  localClassName?: string,
  localStyle?: FieldStyleValue,
): {
  className?: string;
  style?: FieldStyleValue;
  props?: WebFormUiOverrides['props'];
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

export function mergeWebSubmitUi(
  theme: WebSubmitUiOverrides | undefined,
  localClassName?: string,
  localStyle?: FieldStyleValue,
  localLoadingText?: string,
): {
  className?: string;
  style?: FieldStyleValue;
  loadingText?: string;
  props?: WebSubmitUiOverrides['props'];
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

export function mergeNativeFormUi(
  theme: NativeFormUiOverrides | undefined,
  localStyle?: FieldStyleValue,
): {
  style?: NativeStyleValue;
  props?: NativeFormUiOverrides['props'];
} {
  return {
    style: mergeNativeStyleValue(
      theme?.style,
      localStyle as NativeStyleValue | undefined,
    ),
    props: theme?.props,
  };
}

export function mergeNativeSubmitUi(
  theme: NativeSubmitUiOverrides | undefined,
  localStyle?: FieldStyleValue,
  localLoadingText?: string,
): {
  style?: NativeStyleValue;
  containerStyle?: NativeStyleValue;
  textStyle?: NativeStyleValue;
  indicatorColor?: string;
  loadingText?: string;
  props?: NativeSubmitUiOverrides['props'];
  contentProps?: NativeSubmitUiOverrides['contentProps'];
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
