import React, { forwardRef } from 'react';

type NativeStyleObject = Record<string, unknown>;
type NativeStyleValue =
  | NativeStyleObject
  | NativeStyleValue[]
  | null
  | undefined
  | false
  | number;

function normalizeStyle(style: NativeStyleObject): React.CSSProperties {
  const next = { ...style } as Record<string, unknown>;

  if (next.paddingHorizontal !== undefined) {
    next.paddingLeft = next.paddingHorizontal;
    next.paddingRight = next.paddingHorizontal;
    delete next.paddingHorizontal;
  }

  if (next.paddingVertical !== undefined) {
    next.paddingTop = next.paddingVertical;
    next.paddingBottom = next.paddingVertical;
    delete next.paddingVertical;
  }

  if (next.marginHorizontal !== undefined) {
    next.marginLeft = next.marginHorizontal;
    next.marginRight = next.marginHorizontal;
    delete next.marginHorizontal;
  }

  if (next.marginVertical !== undefined) {
    next.marginTop = next.marginVertical;
    next.marginBottom = next.marginVertical;
    delete next.marginVertical;
  }

  delete next.textAlignVertical;

  return next as React.CSSProperties;
}

function flattenStyle(style: NativeStyleValue): React.CSSProperties | undefined {
  if (!style || typeof style === 'number') {
    return undefined;
  }

  if (Array.isArray(style)) {
    return style.reduce<React.CSSProperties>(
      (acc, item) => Object.assign(acc, flattenStyle(item)),
      {},
    );
  }

  return normalizeStyle(style);
}

function accessibilityProps(props: Record<string, unknown>) {
  const state = (props.accessibilityState ?? {}) as Record<string, unknown>;

  return {
    role: props.accessibilityRole as string | undefined,
    'aria-label': props.accessibilityLabel as string | undefined,
    'aria-description': props.accessibilityHint as string | undefined,
    'aria-disabled': state.disabled ? true : undefined,
    'aria-invalid': state.invalid ? true : undefined,
    'aria-checked': typeof state.checked === 'boolean' ? state.checked : undefined,
    'aria-expanded': typeof state.expanded === 'boolean' ? state.expanded : undefined,
  };
}

function baseDomProps(props: Record<string, unknown>) {
  return {
    id: (props.nativeID as string | undefined) ?? (props.id as string | undefined),
    'data-testid': props.testID as string | undefined,
    style: flattenStyle(props.style as NativeStyleValue),
    ...accessibilityProps(props),
  };
}

type HostProps = Record<string, unknown> & {
  children?: React.ReactNode;
};

export const View = forwardRef<HTMLDivElement, HostProps>(function View(props, ref) {
  const children = props.children as React.ReactNode;

  return (
    <div
      ref={ref}
      {...baseDomProps(props)}
    >
      {children}
    </div>
  );
});

export const Text = forwardRef<HTMLSpanElement, HostProps>(function Text(props, ref) {
  const children = props.children as React.ReactNode;

  return (
    <span
      ref={ref}
      {...baseDomProps(props)}
    >
      {children}
    </span>
  );
});

export const Pressable = forwardRef<HTMLDivElement, HostProps>(
  function Pressable(props, ref) {
    const children = props.children as React.ReactNode;
    const { onPress, onPressIn, onPressOut } = props;
    const disabled =
      Boolean(props.disabled) ||
      Boolean(
        (props.accessibilityState as Record<string, unknown> | undefined)?.disabled,
      );

    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: test shim emulates React Native Pressable semantics on the DOM.
      <div
        ref={ref}
        {...baseDomProps(props)}
        role={(props.accessibilityRole as string | undefined) ?? 'button'}
        tabIndex={disabled ? -1 : 0}
        onClick={(event) => {
          if (disabled) {
            return;
          }

          (onPress as ((event: React.MouseEvent<HTMLDivElement>) => void) | undefined)?.(
            event,
          );
        }}
        onMouseDown={(event) => {
          if (disabled) {
            return;
          }

          (
            onPressIn as ((event: React.MouseEvent<HTMLDivElement>) => void) | undefined
          )?.(event);
        }}
        onKeyDown={(event) => {
          if (disabled) {
            return;
          }

          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            (
              onPress as
                | ((nextEvent: React.KeyboardEvent<HTMLDivElement>) => void)
                | undefined
            )?.(event);
          }
        }}
        onMouseUp={(event) => {
          if (disabled) {
            return;
          }

          (
            onPressOut as ((event: React.MouseEvent<HTMLDivElement>) => void) | undefined
          )?.(event);
        }}
      >
        {children}
      </div>
    );
  },
);

export const TouchableOpacity = Pressable;

export const TextInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, HostProps>(
  function TextInput(props, ref) {
    const {
      value,
      placeholder,
      multiline,
      editable,
      maxLength,
      autoFocus,
      secureTextEntry,
      onChangeText,
      onBlur,
      onFocus,
      onKeyPress,
    } = props;

    const commonProps = {
      ...baseDomProps(props),
      placeholder: placeholder as string | undefined,
      autoFocus: autoFocus as boolean | undefined,
      maxLength: maxLength as number | undefined,
      readOnly: editable === false,
      onBlur: onBlur as React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>,
      onFocus: onFocus as React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>,
      onKeyDown: onKeyPress as React.KeyboardEventHandler<
        HTMLInputElement | HTMLTextAreaElement
      >,
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        (onChangeText as ((nextValue: string) => void) | undefined)?.(event.target.value);
      },
    };

    if (multiline) {
      return (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          value={String(value ?? '')}
          {...commonProps}
        />
      );
    }

    return (
      <input
        ref={ref as React.Ref<HTMLInputElement>}
        type={secureTextEntry ? 'password' : 'text'}
        value={String(value ?? '')}
        {...commonProps}
      />
    );
  },
);

export const Switch = forwardRef<HTMLInputElement, HostProps>(
  function Switch(props, ref) {
    const { value, disabled, onValueChange, onBlur, onFocus } = props;

    return (
      <input
        ref={ref}
        type="checkbox"
        checked={Boolean(value)}
        disabled={Boolean(disabled)}
        onChange={(event) => {
          (onValueChange as ((nextValue: boolean) => void) | undefined)?.(
            event.target.checked,
          );
        }}
        onBlur={onBlur as React.FocusEventHandler<HTMLInputElement>}
        onFocus={onFocus as React.FocusEventHandler<HTMLInputElement>}
        {...baseDomProps(props)}
      />
    );
  },
);

export function Modal(props: HostProps & { visible?: boolean }) {
  if (!props.visible) {
    return null;
  }

  return <div {...baseDomProps(props)}>{props.children}</div>;
}

export const ScrollView = forwardRef<HTMLDivElement, HostProps>(
  function ScrollView(props, ref) {
    return (
      <div
        ref={ref}
        {...baseDomProps(props)}
      >
        {props.children as React.ReactNode}
      </div>
    );
  },
);

export function FlatList<T>(
  props: HostProps & {
    data?: T[];
    keyExtractor?: (item: T, index: number) => string;
    renderItem: (ctx: { item: T; index: number }) => React.ReactNode;
    ListEmptyComponent?: React.ReactNode;
  },
) {
  const data = Array.isArray(props.data) ? props.data : [];

  if (data.length === 0) {
    return <div {...baseDomProps(props)}>{props.ListEmptyComponent ?? null}</div>;
  }

  return (
    <div {...baseDomProps(props)}>
      {data.map((item, index) => (
        <React.Fragment key={props.keyExtractor?.(item, index) ?? String(index)}>
          {props.renderItem({ item, index })}
        </React.Fragment>
      ))}
    </div>
  );
}

export function ActivityIndicator(props: HostProps) {
  return <span {...baseDomProps(props)}>loading</span>;
}

export const Image = forwardRef<HTMLImageElement, HostProps>(function Image(props, ref) {
  const source = props.source as { uri?: string } | string | undefined;
  const uri = typeof source === 'string' ? source : source?.uri;

  return (
    <img
      ref={ref}
      src={uri}
      alt={(props.accessibilityLabel as string | undefined) ?? ''}
      {...baseDomProps(props)}
    />
  );
});

export const StyleSheet = {
  create<T extends Record<string, unknown>>(styles: T): T {
    return styles;
  },
  flatten: flattenStyle,
};

export const Platform = {
  OS: 'test',
  select<T>(spec: { default?: T; web?: T; ios?: T; android?: T }): T | undefined {
    return spec.web ?? spec.default ?? spec.ios ?? spec.android;
  },
};

export default {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
};
