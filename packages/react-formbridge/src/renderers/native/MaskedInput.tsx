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
  NativeTextFieldUiOverrides,
} from '../../types';
import {
  defaultErrorChromeStyle,
  defaultErrorTextStyle,
  defaultRequiredMarkStyle,
  type ResolvedNativeFieldUi,
  shouldHighlightOnError,
  sx,
} from './shared';

interface Props extends FieldRenderProps<string> {
  descriptor: MaskedDescriptor<string> & {
    _ui?: ResolvedNativeFieldUi;
  };
  extra?: ExtraFieldProps<NativeTextFieldUiOverrides, 'native'>;
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
  descriptor: d,
  extra,
  registerFocusable,
  ...props
}: Props) => {
  const pendingSelectionRef = useRef<{ start: number; end: number } | null>(null);

  const {
    styles,
    hideLabel,
    rootProps,
    labelProps,
    inputProps,
    hintProps,
    errorProps,
    renderLabel,
    renderHint,
    renderError,
    renderRequiredMark,
  } = extra ?? {};

  const { style: rootPropsStyle, ...rootPropsRest } = (rootProps ?? {}) as {
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

  const id = extra?.id ?? d._ui?.id ?? props.name;
  const hasError = Boolean(props.error);
  const highlightOnError = shouldHighlightOnError(
    extra?.highlightOnError,
    d._ui?.highlightOnError,
  );
  const controlErrorStyle = defaultErrorChromeStyle(hasError, highlightOnError);
  const [selection, setSelection] = useState<{ start: number; end: number } | undefined>(
    undefined,
  );
  const firstEditablePos = useMemo(
    () => getFirstInputPosition(d._maskPattern, d._maskTokens),
    [d._maskPattern, d._maskTokens],
  );

  const maskState = useMemo(() => {
    const incoming = props.value ?? '';
    const raw = d._maskStoreRaw
      ? incoming
      : extractRaw(incoming, d._maskPattern, d._maskTokens);

    const result = applyMask(raw, d._maskPattern, {
      showPlaceholder: d._maskShowPlaceholder,
      placeholder: d._maskPlaceholder,
      tokens: d._maskTokens,
    });

    return {
      ...result,
    };
  }, [
    d._maskPattern,
    d._maskPlaceholder,
    d._maskShowPlaceholder,
    d._maskStoreRaw,
    d._maskTokens,
    props.value,
  ]);
  const displayValue = maskState.display;
  const maxCaretPos = Math.max(maskState.nextCursorPos, firstEditablePos);
  const placeholderText =
    props.placeholder ??
    d._placeholder ??
    (d._maskShowInPlaceholder
      ? getMaskPlaceholder(d._maskPattern, d._maskPlaceholder, d._maskTokens)
      : undefined);

  const resolveMaxCaretPos = useCallback(
    (currentDisplay: string) => {
      const raw = extractRaw(currentDisplay, d._maskPattern, d._maskTokens);
      const nextState = applyMask(raw, d._maskPattern, {
        showPlaceholder: d._maskShowPlaceholder,
        placeholder: d._maskPlaceholder,
        tokens: d._maskTokens,
      });

      return Math.max(nextState.nextCursorPos, firstEditablePos);
    },
    [
      d._maskPattern,
      d._maskPlaceholder,
      d._maskShowPlaceholder,
      d._maskTokens,
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

      if (d._maskUppercase) next = next.toUpperCase();
      if (d._maskLowercase) next = next.toLowerCase();

      const cleaned = extractRaw(next, d._maskPattern, d._maskTokens);
      const result = applyMask(cleaned, d._maskPattern, {
        showPlaceholder: d._maskShowPlaceholder,
        placeholder: d._maskPlaceholder,
        tokens: d._maskTokens,
      });

      props.onChange(d._maskStoreRaw ? result.raw : result.display);

      const pos = Math.max(result.nextCursorPos, firstEditablePos);
      pendingSelectionRef.current = { start: pos, end: pos };
    },
    [
      d._maskLowercase,
      d._maskPattern,
      d._maskPlaceholder,
      d._maskShowPlaceholder,
      d._maskStoreRaw,
      d._maskTokens,
      d._maskUppercase,
      firstEditablePos,
      props.onChange,
    ],
  );

  const autoLayout = useMemo(
    () => getMaskAutoLayout(d._maskPattern, d._maskTokens),
    [d._maskPattern, d._maskTokens],
  );

  const requiredMark = renderRequiredMark?.() ?? (
    <Text style={sx(defaultRequiredMarkStyle(), styles?.requiredMark)}>*</Text>
  );

  return (
    <View
      style={sx(extra?.style as StyleProp<ViewStyle>, styles?.root, rootPropsStyle)}
      {...rootPropsRest}
    >
      {!hideLabel &&
        (renderLabel?.({
          id,
          label: props.label,
          required: Boolean(d._required),
          name: props.name,
        }) ?? (
          <Text
            style={sx(styles?.label, labelPropsStyle)}
            {...labelPropsRest}
          >
            {props.label}
            {d._required && requiredMark}
          </Text>
        ))}

      <TextInput
        nativeID={id}
        ref={registerFocusable}
        testID={d._ui?.testID}
        value={displayValue}
        selection={selection}
        placeholder={placeholderText}
        editable={!props.disabled}
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
        keyboardType={getMaskKeyboardType(d._maskPattern, d._maskTokens)}
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
          controlErrorStyle,
          styles?.input,
          inputPropsStyle,
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
