import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';

import {
  applyMask,
  extractRaw,
  getFirstInputPosition,
  getMaskAutoLayout,
  getMaskPlaceholder,
  parsePattern,
} from '../../core/field-builders/mask/masks';
import type { MaskedDescriptor } from '../../core/field-builders/mask/types';
import type { FieldRenderProps } from '../../types';
import {
  defaultBorderColor,
  type NativeBaseUiOverrides,
  type NativeExtraProps,
  type ResolvedNativeFieldUi,
  shouldHighlightOnError,
  sx,
} from './shared';

interface Props extends FieldRenderProps<string> {
  descriptor: MaskedDescriptor<string> & {
    _ui?: ResolvedNativeFieldUi;
  };
  extra?: NativeExtraProps<NativeBaseUiOverrides>;
}

function getMaskKeyboardType(pattern: string): TextInputProps['keyboardType'] {
  const hasLetters = parsePattern(pattern).some(
    (token) => token.isInput && String(token.regex) === String(/[a-zA-Z]/),
  );

  return hasLetters ? 'default' : 'number-pad';
}

export const NativeMaskedInput = ({ descriptor: d, extra, ...props }: Props) => {
  const pendingSelectionRef = useRef<{ start: number; end: number } | null>(null);
  const ui = extra?.ui;
  const highlightOnError = shouldHighlightOnError(
    ui?.highlightOnError,
    d._ui?.highlightOnError,
  );
  const { rootProps, labelProps, inputProps, hintProps, errorProps } = ui ?? {};
  const { style: rootPropsStyle, ...rootPropsRest } = (rootProps ?? {}) as {
    style?: object;
  } & Record<string, unknown>;
  const { style: labelPropsStyle, ...labelPropsRest } = (labelProps ?? {}) as {
    style?: object;
  } & Record<string, unknown>;
  const { style: inputPropsStyle, ...inputPropsRest } = (inputProps ?? {}) as {
    style?: object;
  } & Record<string, unknown>;
  const { style: hintPropsStyle, ...hintPropsRest } = (hintProps ?? {}) as {
    style?: object;
  } & Record<string, unknown>;
  const { style: errorPropsStyle, ...errorPropsRest } = (errorProps ?? {}) as {
    style?: object;
  } & Record<string, unknown>;
  const id = ui?.id ?? d._ui?.id ?? props.name;
  const hasError = Boolean(props.error);
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
      // raw,
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

  const requiredMark = ui?.renderRequiredMark?.() ?? (
    <Text style={sx(styles.requiredMark, ui?.styles?.requiredMark)}>*</Text>
  );

  return (
    <View
      style={sx(styles.root, extra?.style as object, ui?.styles?.root, rootPropsStyle)}
      {...rootPropsRest}
    >
      {!ui?.hideLabel &&
        (ui?.renderLabel?.({
          id,
          label: props.label,
          required: Boolean(d._required),
        }) ?? (
          <Text
            style={sx(styles.label, ui?.styles?.label, labelPropsStyle)}
            {...labelPropsRest}
          >
            {props.label}
            {d._required && requiredMark}
          </Text>
        ))}

      <TextInput
        nativeID={id}
        testID={d._ui?.testID}
        value={displayValue}
        selection={selection}
        placeholder={placeholderText}
        editable={!props.disabled}
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
        keyboardType={getMaskKeyboardType(d._maskPattern)}
        style={sx(
          styles.input,
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
          {
            borderColor: defaultBorderColor(hasError, highlightOnError),
            backgroundColor: props.disabled ? '#f9fafb' : '#fff',
          },
          ui?.styles?.input,
          inputPropsStyle,
        )}
        {...(inputPropsRest as Partial<TextInputProps>)}
      />

      {props.error
        ? (ui?.renderError?.({ id: `${id}-error`, error: props.error }) ?? (
            <Text
              style={sx(styles.error, ui?.styles?.error, errorPropsStyle)}
              {...errorPropsRest}
            >
              {props.error}
            </Text>
          ))
        : props.hint
          ? (ui?.renderHint?.({ id: `${id}-hint`, hint: props.hint }) ?? (
              <Text
                style={sx(styles.hint, ui?.styles?.hint, hintPropsStyle)}
                {...hintPropsRest}
              >
                {props.hint}
              </Text>
            ))
          : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    gap: 6,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  requiredMark: {
    color: '#ef4444',
  },
  input: {
    minHeight: 44,
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    fontVariant: ['tabular-nums'],
  },
  error: {
    fontSize: 12,
    color: '#ef4444',
  },
  hint: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
