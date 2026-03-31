import type {
  ExtraFieldProps,
  FieldAppearanceConfig,
  FieldAppearanceOverrides,
  FieldStyleValue,
  FieldTheme,
  NativeFieldUiOverrides,
  NativeFormUiOverrides,
  NativeStyleValue,
  NativeSubmitUiOverrides,
  WebFieldUiOverrides,
  WebFormUiOverrides,
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

function isPlainObjectStyle(
  value: FieldStyleValue | undefined,
): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
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

export function mergeFieldStyleProps(
  platform: 'web' | 'native',
  theme?: FieldTheme,
  local?: ExtraFieldProps,
): ExtraFieldProps | undefined {
  if (!theme && !local) return undefined;

  const mergedClassName = mergeClassNames(theme?.className, local?.className);
  const mergedStyle =
    platform === 'native'
      ? mergeNativeStyleValue(
          theme?.style as NativeStyleValue | undefined,
          local?.style as NativeStyleValue | undefined,
        )
      : theme?.style || local?.style
        ? Object.assign({}, theme?.style ?? {}, local?.style ?? {})
        : undefined;
  const mergedAppearance =
    platform === 'web'
      ? mergeWebFieldUi(
          theme?.appearance as WebFieldUiOverrides | undefined,
          local?.appearance as WebFieldUiOverrides | undefined,
        )
      : mergeNativeFieldUi(
          theme?.appearance as NativeFieldUiOverrides | undefined,
          local?.appearance as NativeFieldUiOverrides | undefined,
        );

  return {
    ...local,
    ...(mergedClassName ? { className: mergedClassName } : {}),
    ...(mergedStyle ? { style: mergedStyle } : {}),
    ...(mergedAppearance
      ? { appearance: mergedAppearance as FieldAppearanceOverrides }
      : {}),
  };
}

export function resolveWebFieldConfig(
  appearance?: FieldAppearanceConfig,
): WebFieldUiOverrides | undefined {
  const fromAppearance = appearance
    ? {
        id: appearance.id,
        readOnly: appearance.readOnly,
        autoComplete: appearance.autoComplete,
        autoFocus: appearance.autoFocus,
        spellCheck: appearance.spellCheck,
        inputMode: appearance.inputMode,
        enterKeyHint: appearance.enterKeyHint,
        rootClassName: appearance.rootClassName,
        labelClassName: appearance.labelClassName,
        inputClassName: appearance.inputClassName,
        rootStyle: isPlainObjectStyle(appearance.rootStyle)
          ? appearance.rootStyle
          : undefined,
        labelStyle: isPlainObjectStyle(appearance.labelStyle)
          ? appearance.labelStyle
          : undefined,
        inputStyle: isPlainObjectStyle(appearance.inputStyle)
          ? appearance.inputStyle
          : undefined,
        highlightOnError: appearance.highlightOnError,
        renderPicker: appearance.renderPicker,
      }
    : undefined;

  return fromAppearance;
}

export function resolveNativeFieldConfig(
  appearance?: FieldAppearanceConfig,
): NativeFieldUiOverrides | undefined {
  const fromAppearance = appearance
    ? {
        id: appearance.id,
        testID: appearance.testID,
        readOnly: appearance.readOnly,
        autoComplete: appearance.autoComplete,
        autoFocus: appearance.autoFocus,
        keyboardType: appearance.keyboardType,
        secureTextEntry: appearance.secureTextEntry,
        rootStyle: appearance.rootStyle as NativeStyleValue | undefined,
        labelStyle: appearance.labelStyle as NativeStyleValue | undefined,
        inputStyle: appearance.inputStyle as NativeStyleValue | undefined,
        hintStyle: appearance.hintStyle as NativeStyleValue | undefined,
        errorStyle: appearance.errorStyle as NativeStyleValue | undefined,
        highlightOnError: appearance.highlightOnError,
        renderPicker: appearance.renderPicker,
      }
    : undefined;

  return fromAppearance;
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
        ?  Object.assign({}, theme?.style ?? {}, localStyle ?? {})
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
