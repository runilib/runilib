import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  type StyleProp,
  Text,
  TextInput,
  type TextInputProps,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';

import {
  applyMask,
  extractRaw,
  getFirstInputPosition,
  getMaskAutoLayout,
  getMaskCharacterProfile,
  getMaskPlaceholder,
} from '../../core/field-builders/mask/masks';
import type { MaskedDescriptor } from '../../core/field-builders/mask/types';
import type {
  ExtraFieldProps,
  FieldRenderProps,
  FocusableFieldHandle,
  NativeTextFieldPropsOverrides,
} from '../../types';
import {
  defaultErrorChromeStyle,
  defaultErrorTextStyle,
  defaultRequiredMarkStyle,
  type ResolvedNativeFieldProps,
  resolveNativeInputBehavior,
  shouldHighlightOnError,
  sx,
} from './shared';

interface Props extends FieldRenderProps<string> {
  descriptor: MaskedDescriptor<string> & {
    fieldPropsFromClient?: ResolvedNativeFieldProps;
  };
  extra?: ExtraFieldProps<NativeTextFieldPropsOverrides, 'native'>;
  registerFocusable?: (target: FocusableFieldHandle | null) => void;
}

function getMaskKeyboardType(
  pattern: string,
  tokenMap?: MaskedDescriptor<string>['_maskTokens'],
): TextInputProps['keyboardType'] {
  const { acceptsLetters } = getMaskCharacterProfile(pattern, tokenMap);

  return acceptsLetters ? 'default' : 'number-pad';
}

export const NativeMaskedInput = ({
  descriptor,
  extra,
  registerFocusable,
  ...props
}: Props) => {
  const pendingSelectionRef = useRef<{ start: number; end: number } | null>(null);
  const inputBehavior = resolveNativeInputBehavior(
    extra,
    descriptor.fieldPropsFromClient,
  );
  const isReadOnly = Boolean(inputBehavior.readOnly);

  const {
    styles,
    hideLabel,
    wrapperProps,
    labelProps,
    inputProps,
    hintProps,
    errorProps,
    renderLabel,
    renderHint,
    renderError,
    renderRequiredMark,
  } = extra ?? {};

  const { style: wrapperPropsStyle, ...wrapperPropsRest } = (wrapperProps ?? {}) as {
    style?: StyleProp<ViewStyle>;
  } & Record<string, unknown>;
  const { style: labelPropsStyle, ...labelPropsRest } = (labelProps ?? {}) as {
    style?: StyleProp<TextStyle>;
  } & Record<string, unknown>;
  const { style: inputPropsStyle, ...inputPropsRest } = (inputProps ?? {}) as {
    style?: StyleProp<TextStyle>;
  } & Record<string, unknown>;
  const { style: hintPropsStyle, ...hintPropsRest } = (hintProps ?? {}) as {
    style?: StyleProp<TextStyle>;
  } & Record<string, unknown>;
  const { style: errorPropsStyle, ...errorPropsRest } = (errorProps ?? {}) as {
    style?: StyleProp<TextStyle>;
  } & Record<string, unknown>;

  const id = extra?.id ?? descriptor.fieldPropsFromClient?.id ?? props.name;
  const hasError = Boolean(props.error);
  const highlightOnError = shouldHighlightOnError(
    extra?.highlightOnError,
    descriptor.fieldPropsFromClient?.highlightOnError,
  );
  const controlErrorStyle = defaultErrorChromeStyle(hasError, highlightOnError);
  const [selection, setSelection] = useState<{ start: number; end: number } | undefined>(
    undefined,
  );
  const firstEditablePos = useMemo(
    () => getFirstInputPosition(descriptor._maskPattern, descriptor._maskTokens),
    [descriptor._maskPattern, descriptor._maskTokens],
  );

  const maskState = useMemo(() => {
    const incoming = props.value ?? '';
    const raw = descriptor._maskStoreRaw
      ? incoming
      : extractRaw(incoming, descriptor._maskPattern, descriptor._maskTokens);

    const result = applyMask(raw, descriptor._maskPattern, {
      showPlaceholder: descriptor._maskShowPlaceholder,
      placeholder: descriptor._maskPlaceholder,
      tokens: descriptor._maskTokens,
    });

    return {
      ...result,
    };
  }, [
    descriptor._maskPattern,
    descriptor._maskPlaceholder,
    descriptor._maskShowPlaceholder,
    descriptor._maskStoreRaw,
    descriptor._maskTokens,
    props.value,
  ]);
  const displayValue = maskState.display;
  const maxCaretPos = Math.max(maskState.nextCursorPos, firstEditablePos);
  const placeholderText =
    props.placeholder ??
    descriptor._placeholder ??
    (descriptor._maskShowInPlaceholder
      ? (descriptor._maskPlaceholderText ??
        getMaskPlaceholder(
          descriptor._maskPattern,
          descriptor._maskPlaceholder,
          descriptor._maskTokens,
        ))
      : undefined);

  const resolveMaxCaretPos = useCallback(
    (currentDisplay: string) => {
      const raw = extractRaw(
        currentDisplay,
        descriptor._maskPattern,
        descriptor._maskTokens,
      );
      const nextState = applyMask(raw, descriptor._maskPattern, {
        showPlaceholder: descriptor._maskShowPlaceholder,
        placeholder: descriptor._maskPlaceholder,
        tokens: descriptor._maskTokens,
      });

      return Math.max(nextState.nextCursorPos, firstEditablePos);
    },
    [
      descriptor._maskPattern,
      descriptor._maskPlaceholder,
      descriptor._maskShowPlaceholder,
      descriptor._maskTokens,
      firstEditablePos,
    ],
  );

  const clampSelection = useCallback(
    (next?: { start: number; end: number }, currentDisplay = displayValue) => {
      const currentMaxCaretPos = resolveMaxCaretPos(currentDisplay);
      const start = next?.start ?? maxCaretPos;
      const end = next?.end ?? start;

      return {
        start: Math.min(Math.max(start, firstEditablePos), currentMaxCaretPos),
        end: Math.min(Math.max(end, firstEditablePos), currentMaxCaretPos),
      };
    },
    [displayValue, firstEditablePos, maxCaretPos, resolveMaxCaretPos],
  );

  const commitSelection = useCallback(
    (next?: { start: number; end: number }, currentDisplay?: string) => {
      setSelection((current) => {
        const resolved = clampSelection(next, currentDisplay);

        if (current?.start === resolved.start && current?.end === resolved.end) {
          return current;
        }

        return resolved;
      });
    },
    [clampSelection],
  );

  useEffect(() => {
    const pendingSelection = pendingSelectionRef.current;
    if (!pendingSelection) return;

    commitSelection(pendingSelection, displayValue);
    pendingSelectionRef.current = null;
  }, [commitSelection, displayValue]);

  const handleChangeText = useCallback(
    (value: string) => {
      let next = value;

      if (descriptor._maskUppercase) next = next.toUpperCase();
      if (descriptor._maskLowercase) next = next.toLowerCase();

      const cleaned = extractRaw(next, descriptor._maskPattern, descriptor._maskTokens);
      const result = applyMask(cleaned, descriptor._maskPattern, {
        showPlaceholder: descriptor._maskShowPlaceholder,
        placeholder: descriptor._maskPlaceholder,
        tokens: descriptor._maskTokens,
      });

      props.onChange(descriptor._maskStoreRaw ? result.raw : result.display);

      const pos = Math.max(result.nextCursorPos, firstEditablePos);
      pendingSelectionRef.current = { start: pos, end: pos };
    },
    [
      descriptor._maskLowercase,
      descriptor._maskPattern,
      descriptor._maskPlaceholder,
      descriptor._maskShowPlaceholder,
      descriptor._maskStoreRaw,
      descriptor._maskTokens,
      descriptor._maskUppercase,
      firstEditablePos,
      props.onChange,
    ],
  );

  const autoLayout = useMemo(
    () => getMaskAutoLayout(descriptor._maskPattern, descriptor._maskTokens),
    [descriptor._maskPattern, descriptor._maskTokens],
  );

  const requiredMark = renderRequiredMark?.() ?? (
    <Text style={sx(defaultRequiredMarkStyle(), styles?.requiredMark)}>*</Text>
  );

  return (
    <View
      style={sx(extra?.style as StyleProp<ViewStyle>, styles?.wrapper, wrapperPropsStyle)}
      {...wrapperPropsRest}
    >
      {!hideLabel &&
        (renderLabel?.({
          id,
          label: props.label,
          required: Boolean(descriptor._required),
          name: props.name,
        }) ?? (
          <Text
            style={sx(styles?.label, labelPropsStyle)}
            {...labelPropsRest}
          >
            {props.label}
            {descriptor._required && requiredMark}
          </Text>
        ))}

      <TextInput
        nativeID={id}
        ref={registerFocusable}
        testID={inputBehavior.testID}
        value={displayValue}
        selection={selection}
        placeholder={placeholderText}
        editable={!(props.disabled || isReadOnly)}
        maxLength={autoLayout.visualLength}
        onChangeText={handleChangeText}
        onBlur={props.onBlur}
        onFocus={() => {
          props.onFocus();
          commitSelection({ start: maxCaretPos, end: maxCaretPos }, displayValue);
        }}
        onSelectionChange={(event) => {
          if (pendingSelectionRef.current) return;

          commitSelection(event.nativeEvent.selection, displayValue);
        }}
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={inputBehavior.autoFocus}
        autoComplete={inputBehavior.autoComplete as TextInputProps['autoComplete']}
        keyboardType={
          (inputBehavior.keyboardType as TextInputProps['keyboardType']) ??
          getMaskKeyboardType(descriptor._maskPattern, descriptor._maskTokens)
        }
        secureTextEntry={inputBehavior.secureTextEntry}
        style={sx(
          autoLayout.compact
            ? {
                width: autoLayout.nativeWidthPx,
                maxWidth: '100%',
                alignSelf: 'flex-start',
              }
            : {
                width: '100%',
                alignSelf: 'stretch',
              },
          styles?.input,
          inputPropsStyle,
          controlErrorStyle,
        )}
        {...(inputPropsRest as Partial<TextInputProps>)}
      />

      {props.error
        ? (renderError?.({ id, name: props.name, error: props.error }) ?? (
            <Text
              style={sx(defaultErrorTextStyle(true), styles?.error, errorPropsStyle)}
              {...errorPropsRest}
            >
              {props.error}
            </Text>
          ))
        : props.hint
          ? (renderHint?.({ id, name: props.name, hint: props.hint }) ?? (
              <Text
                style={sx(styles?.hint, hintPropsStyle)}
                {...hintPropsRest}
              >
                {props.hint}
              </Text>
            ))
          : null}
    </View>
  );
};
