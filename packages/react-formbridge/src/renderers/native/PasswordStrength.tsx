import { useMemo, useState } from 'react';
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';

import type { FieldRenderProps } from '../../types';
import {
  defaultBorderColor,
  type NativeBaseUiOverrides,
  type NativeExtraProps,
  type ResolvedNativeFieldUi,
  shouldHighlightOnError,
  sx,
} from './shared';

type PasswordStrengthDescriptor = {
  _label: string;
  _placeholder?: string;
  _required: boolean;
  _hint?: string;
  _disabled: boolean;
  _ui?: ResolvedNativeFieldUi;
};

type NativePasswordStrengthUiOverrides = NativeBaseUiOverrides & {
  styles?: NativeBaseUiOverrides['styles'] &
    Partial<{
      strengthRow: StyleProp<ViewStyle>;
      strengthBar: StyleProp<ViewStyle>;
      strengthFill: StyleProp<ViewStyle>;
      toggle: StyleProp<ViewStyle>;
      toggleText: StyleProp<TextStyle>;
      strengthLabel: StyleProp<TextStyle>;
    }>;
};

interface Props extends FieldRenderProps<string> {
  strengthMeta: PasswordStrengthDescriptor;
  extra?: NativeExtraProps<NativePasswordStrengthUiOverrides>;
}

function scorePassword(value: string): number {
  if (!value) return 0;

  let score = 0;
  if (value.length >= 8) score += 1;
  if (value.length >= 12) score += 1;
  if (/[A-Z]/.test(value)) score += 1;
  if (/[a-z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;

  return Math.min(score, 5);
}

function getStrengthMeta(score: number): {
  label: string;
  width: `${number}%`;
} {
  if (score <= 1) return { label: 'Weak', width: '20%' };
  if (score === 2) return { label: 'Fair', width: '40%' };
  if (score === 3) return { label: 'Good', width: '60%' };
  if (score === 4) return { label: 'Strong', width: '80%' };
  return { label: 'Very strong', width: '100%' };
}

export const NativePasswordStrength = ({ strengthMeta: d, extra, ...p }: Props) => {
  const ui = extra?.ui;
  const highlightOnError = shouldHighlightOnError(
    ui?.highlightOnError,
    d._ui?.highlightOnError,
  );
  const { rootProps, labelProps, inputProps, hintProps, errorProps } = ui ?? {};
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
  const id = d._ui?.id ?? p.name;
  const hasError = Boolean(p.error);
  const [visible, setVisible] = useState(false);

  const score = useMemo(() => scorePassword(p.value ?? ''), [p.value]);
  const strength = useMemo(() => getStrengthMeta(score), [score]);

  const requiredMark = ui?.renderRequiredMark?.() ?? (
    <Text style={sx(styles.requiredMark, ui?.styles?.requiredMark)}>*</Text>
  );

  return (
    <View
      style={sx(
        styles.root,
        extra?.style as StyleProp<ViewStyle>,
        ui?.styles?.root,
        rootPropsStyle,
      )}
      {...rootPropsRest}
    >
      {!ui?.hideLabel &&
        (ui?.renderLabel?.({
          id,
          label: p.label,
          required: Boolean(d._required),
        }) ?? (
          <Text
            style={sx(styles.label, ui?.styles?.label, labelPropsStyle)}
            {...labelPropsRest}
          >
            {p.label}
            {d._required && requiredMark}
          </Text>
        ))}

      <View style={styles.inputRow}>
        <TextInput
          nativeID={id}
          testID={d._ui?.testID}
          value={p.value ?? ''}
          placeholder={p.placeholder ?? d._placeholder}
          editable={!p.disabled}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={p.onChange}
          onBlur={p.onBlur}
          onFocus={p.onFocus}
          style={sx(
            styles.input,
            {
              borderColor: defaultBorderColor(hasError, highlightOnError),
              backgroundColor: p.disabled ? '#f9fafb' : '#fff',
            },
            ui?.styles?.input,
            inputPropsStyle,
          )}
          {...(inputPropsRest as Partial<TextInputProps>)}
        />

        <Pressable
          onPress={() => setVisible((prev) => !prev)}
          style={sx(styles.toggle, ui?.styles?.toggle)}
        >
          <Text style={sx(styles.toggleText, ui?.styles?.toggleText)}>
            {visible ? 'Hide' : 'Show'}
          </Text>
        </Pressable>
      </View>

      <View style={sx(styles.strengthRow, ui?.styles?.strengthRow)}>
        <View style={sx(styles.strengthBar, ui?.styles?.strengthBar)}>
          <View
            style={sx(
              styles.strengthFill,
              { width: strength.width },
              ui?.styles?.strengthFill,
            )}
          />
        </View>
        <Text style={sx(styles.strengthLabel, ui?.styles?.strengthLabel)}>
          {strength.label}
        </Text>
      </View>

      {p.error
        ? (ui?.renderError?.({ id: `${id}-error`, error: p.error }) ?? (
            <Text
              style={sx(styles.error, ui?.styles?.error, errorPropsStyle)}
              {...errorPropsRest}
            >
              {p.error}
            </Text>
          ))
        : p.hint
          ? (ui?.renderHint?.({ id: `${id}-hint`, hint: p.hint }) ?? (
              <Text
                style={sx(styles.hint, ui?.styles?.hint, hintPropsStyle)}
                {...hintPropsRest}
              >
                {p.hint}
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  toggle: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  toggleText: {
    color: '#4f46e5',
    fontWeight: '600',
  },
  strengthRow: {
    gap: 6,
  },
  strengthBar: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#6366f1',
  },
  strengthLabel: {
    fontSize: 12,
    color: '#6b7280',
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
