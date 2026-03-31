import { useMemo, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  type StyleProp,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  type TextInputProps,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';

import type {
  FieldDescriptor,
  FieldRenderProps,
  SelectOption,
  SelectPickerRenderContext,
} from '../../types';
import {
  defaultBorderColor,
  type NativeBaseUiOverrides,
  type NativeExtraProps,
  type NativeTextFieldDescriptorWebLike,
  shouldHighlightOnError,
  sx,
} from './shared';

type NativeFieldUiOverrides = NativeBaseUiOverrides & {
  styles?: NativeBaseUiOverrides['styles'] &
    Partial<{
      checkboxRow: StyleProp<ViewStyle>;
      checkboxBox: StyleProp<ViewStyle>;
      checkboxLabel: StyleProp<TextStyle>;
      optionTrigger: StyleProp<ViewStyle>;
      optionRow: StyleProp<ViewStyle>;
      optionLabel: StyleProp<TextStyle>;
      modalBackdrop: StyleProp<ViewStyle>;
      modalCard: StyleProp<ViewStyle>;
      otpContainer: StyleProp<ViewStyle>;
      otpInput: StyleProp<TextStyle>;
    }>;
};

interface Props extends FieldRenderProps<unknown> {
  descriptor: FieldDescriptor<unknown> & NativeTextFieldDescriptorWebLike;
  extra?: NativeExtraProps<NativeFieldUiOverrides>;
}

function getStringValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
}

function getSelectedLabel(options: SelectOption[] | undefined, value: unknown): string {
  if (!options?.length) return '';
  const found = options.find((option) => option.value === value);
  return found?.label ?? '';
}

const OptionPicker = ({
  visible,
  title,
  options,
  selectedValue,
  onClose,
  onSelect,
  ui,
}: {
  visible: boolean;
  title: string;
  options: SelectOption[];
  selectedValue: unknown;
  onClose: () => void;
  onSelect: (value: unknown) => void;
  ui?: NativeFieldUiOverrides;
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={sx(styles.modalBackdrop, ui?.styles?.modalBackdrop)}
        onPress={onClose}
      >
        <Pressable
          style={sx(styles.modalCard, ui?.styles?.modalCard)}
          onPress={(event) => event.stopPropagation()}
        >
          <Text style={styles.modalTitle}>{title}</Text>

          <ScrollView keyboardShouldPersistTaps="handled">
            {options.map((option) => {
              const selected = option.value === selectedValue;

              return (
                <Pressable
                  key={String(option.value)}
                  onPress={() => {
                    onSelect(option.value);
                    onClose();
                  }}
                  style={sx(
                    styles.optionRow,
                    selected && styles.optionRowSelected,
                    ui?.styles?.optionRow,
                  )}
                >
                  <Text
                    style={sx(
                      styles.optionLabel,
                      selected && styles.optionLabelSelected,
                      ui?.styles?.optionLabel,
                    )}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export const NativeField: React.FC<Props> = ({ descriptor: d, extra, ...p }) => {
  const native = d._ui ?? {};
  const ui = extra?.appearance;
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

  const id = ui?.id ?? native.id ?? p.name;
  const hasError = Boolean(p.error);
  const highlightOnError = shouldHighlightOnError(
    ui?.highlightOnError,
    native.highlightOnError,
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const otpRefs = useRef<Array<TextInput | null>>([]);
  const renderPicker = ui?.renderPicker ?? native.renderPicker;

  const selectOptions = d._options ?? [];
  const selectedOption = useMemo(
    () =>
      selectOptions.find((option) => String(option.value) === String(p.value)) ?? null,
    [p.value, selectOptions],
  );
  const filteredOptions = useMemo(() => {
    const query = pickerSearch.trim().toLowerCase();

    if (!query) {
      return selectOptions;
    }

    return selectOptions.filter((option) => option.label.toLowerCase().includes(query));
  }, [pickerSearch, selectOptions]);

  const clearPickerSearch = () => {
    setPickerSearch('');
  };

  const closePicker = () => {
    setPickerOpen(false);
    clearPickerSearch();
  };

  const openPicker = () => {
    if (p.disabled) return;

    setPickerOpen(true);
    p.onFocus();
  };

  const selectPickerOption = (next: SelectOption | SelectOption['value']) => {
    const value =
      typeof next === 'object' && next !== null && 'value' in next ? next.value : next;

    p.onChange(value);
    closePicker();
    p.onBlur();
  };

  const pickerContext: SelectPickerRenderContext = {
    platform: 'native',
    fieldType: d._type === 'radio' ? 'radio' : 'select',
    open: pickerOpen,
    label: p.label,
    placeholder: p.placeholder,
    required: Boolean(d._required),
    disabled: p.disabled,
    searchable: Boolean(d._searchable),
    loading: false,
    error: null,
    search: pickerSearch,
    options: filteredOptions,
    selectedOption,
    selectedValue:
      p.value === null || p.value === undefined || p.value === ''
        ? null
        : (p.value as SelectOption['value']),
    triggerLabel: selectedOption?.label ?? p.placeholder ?? `Select ${String(p.label)}`,
    openPicker,
    closePicker,
    setSearch: setPickerSearch,
    clearSearch: clearPickerSearch,
    selectOption: selectPickerOption,
  };

  const requiredMark = ui?.renderRequiredMark?.() ?? (
    <Text style={sx(styles.requiredMark, ui?.styles?.requiredMark)}>*</Text>
  );

  const inputBaseStyle = useMemo(
    () =>
      sx(
        styles.input,
        {
          borderColor: defaultBorderColor(hasError, highlightOnError),
          backgroundColor: p.disabled ? '#f9fafb' : '#fff',
        },
        native.inputStyle,
        ui?.styles?.input,
        inputPropsStyle,
      ),
    [
      hasError,
      highlightOnError,
      inputPropsStyle,
      native.inputStyle,
      p.disabled,
      ui?.styles?.input,
    ],
  );

  const renderLabel = () => {
    if (ui?.hideLabel) return null;

    if (ui?.renderLabel) {
      return ui.renderLabel({
        id,
        label: p.label,
        required: Boolean(d._required),
      });
    }

    if (d._type === 'checkbox') {
      return null;
    }

    return (
      <Text
        style={sx(styles.label, native.labelStyle, ui?.styles?.label, labelPropsStyle)}
        {...labelPropsRest}
      >
        {p.label}
        {d._required && requiredMark}
      </Text>
    );
  };

  const renderMeta = () => {
    if (p.error) {
      return (
        ui?.renderError?.({ id: `${id}-error`, error: p.error }) ?? (
          <Text
            style={sx(
              styles.error,
              native.errorStyle,
              ui?.styles?.error,
              errorPropsStyle,
            )}
            {...errorPropsRest}
          >
            {p.error}
          </Text>
        )
      );
    }

    if (p.hint) {
      return (
        ui?.renderHint?.({ id: `${id}-hint`, hint: p.hint }) ?? (
          <Text
            style={sx(styles.hint, native.hintStyle, ui?.styles?.hint, hintPropsStyle)}
            {...hintPropsRest}
          >
            {p.hint}
          </Text>
        )
      );
    }

    return null;
  };

  const commonInputProps: Omit<TextInputProps, 'value' | 'onChangeText'> = {
    editable: !(p.disabled || native.readOnly),
    autoFocus: native.autoFocus,
    autoComplete: native.autoComplete as TextInputProps['autoComplete'],
    keyboardType: native.keyboardType as TextInputProps['keyboardType'],
    secureTextEntry: native.secureTextEntry,
    onBlur: p.onBlur,
    onFocus: p.onFocus,
    testID: native.testID,
    ...(inputPropsRest as Partial<TextInputProps>),
  };

  const renderInput = () => {
    switch (d._type) {
      case 'textarea':
        return (
          <TextInput
            nativeID={id}
            value={getStringValue(p.value)}
            placeholder={p.placeholder}
            multiline
            textAlignVertical="top"
            style={sx(inputBaseStyle, styles.textarea)}
            onChangeText={(value) => p.onChange(value)}
            {...commonInputProps}
          />
        );

      case 'checkbox':
        return (
          <Pressable
            onPress={() => {
              if (!p.disabled) p.onChange(!p.value);
            }}
            style={sx(styles.checkboxRow, ui?.styles?.checkboxRow)}
            accessibilityRole="checkbox"
            accessibilityState={{
              checked: Boolean(p.value),
              disabled: Boolean(p.disabled),
            }}
          >
            <View
              style={sx(
                styles.checkboxBox,
                Boolean(p.value) && styles.checkboxBoxChecked,
                {
                  borderColor: defaultBorderColor(hasError, highlightOnError),
                  opacity: p.disabled ? 0.6 : 1,
                },
                ui?.styles?.checkboxBox,
              )}
            />
            <Text style={sx(styles.checkboxLabel, ui?.styles?.checkboxLabel)}>
              {p.label}
              {d._required && requiredMark}
            </Text>
          </Pressable>
        );

      case 'switch':
        return (
          <View style={styles.switchRow}>
            <Switch
              value={Boolean(p.value)}
              onValueChange={(value) => p.onChange(value)}
              disabled={p.disabled}
            />
            <Text style={styles.switchLabel}>
              {p.label}
              {d._required && requiredMark}
            </Text>
          </View>
        );

      case 'select':
      case 'radio':
        return (
          <>
            <Pressable
              onPress={openPicker}
              style={sx(
                styles.optionTrigger,
                {
                  borderColor: defaultBorderColor(hasError, highlightOnError),
                  opacity: p.disabled ? 0.6 : 1,
                },
                ui?.styles?.optionTrigger,
              )}
            >
              <Text
                style={
                  getSelectedLabel(d._options, p.value)
                    ? styles.optionTriggerValue
                    : styles.optionTriggerPlaceholder
                }
              >
                {getSelectedLabel(d._options, p.value) ||
                  p.placeholder ||
                  `Select ${p.label}`}
              </Text>
            </Pressable>

            {renderPicker ? (
              renderPicker(pickerContext)
            ) : (
              <OptionPicker
                visible={pickerOpen}
                title={String(p.label)}
                options={d._options ?? []}
                selectedValue={p.value}
                onClose={closePicker}
                onSelect={(value) => p.onChange(value)}
                ui={ui}
              />
            )}
          </>
        );
      case 'otp': {
        const length = d._otpLength ?? 6;
        const chars = getStringValue(p.value).split('');

        return (
          <View style={sx(styles.otpContainer, ui?.styles?.otpContainer)}>
            {Array.from({ length }, (_, index) => ({
              key: `${id}-otp-${index}`,
              index,
            })).map(({ key, index }) => (
              <TextInput
                key={key}
                ref={(node) => {
                  otpRefs.current[index] = node;
                }}
                value={chars[index] ?? ''}
                maxLength={1}
                keyboardType="number-pad"
                textAlign="center"
                style={sx(
                  styles.otpInput,
                  {
                    borderColor: defaultBorderColor(hasError, highlightOnError),
                    opacity: p.disabled ? 0.6 : 1,
                  },
                  ui?.styles?.otpInput,
                )}
                editable={!p.disabled}
                onChangeText={(char) => {
                  const next = [...chars];
                  next[index] = char.slice(-1);
                  p.onChange(next.join(''));

                  if (char && index < length - 1) {
                    otpRefs.current[index + 1]?.focus();
                  }
                }}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace' && !chars[index] && index > 0) {
                    otpRefs.current[index - 1]?.focus();
                  }
                }}
                onBlur={p.onBlur}
                onFocus={p.onFocus}
              />
            ))}
          </View>
        );
      }

      case 'number':
        return (
          <TextInput
            nativeID={id}
            value={getStringValue(p.value)}
            placeholder={p.placeholder}
            style={inputBaseStyle}
            keyboardType="numeric"
            onChangeText={(value) => {
              p.onChange(value === '' ? '' : Number(value));
            }}
            {...commonInputProps}
          />
        );

      case 'date':
        return (
          <TextInput
            nativeID={id}
            value={getStringValue(p.value)}
            placeholder={p.placeholder ?? 'YYYY-MM-DD'}
            style={inputBaseStyle}
            onChangeText={(value) => p.onChange(value)}
            {...commonInputProps}
          />
        );

      default:
        return (
          <TextInput
            nativeID={id}
            value={getStringValue(p.value)}
            placeholder={p.placeholder}
            style={inputBaseStyle}
            onChangeText={(value) => p.onChange(value)}
            autoCapitalize={d._type === 'email' ? 'none' : 'sentences'}
            keyboardType={
              d._type === 'email'
                ? 'email-address'
                : d._type === 'tel'
                  ? 'phone-pad'
                  : d._type === 'url'
                    ? 'url'
                    : commonInputProps.keyboardType
            }
            {...commonInputProps}
          />
        );
    }
  };

  return (
    <View
      style={sx(
        styles.root,
        extra?.style as StyleProp<ViewStyle>,
        native.rootStyle,
        ui?.styles?.root,
        rootPropsStyle,
      )}
      {...rootPropsRest}
    >
      {renderLabel()}
      {renderInput()}
      {renderMeta()}
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
  },
  textarea: {
    minHeight: 112,
  },
  error: {
    fontSize: 12,
    color: '#ef4444',
  },
  hint: {
    fontSize: 12,
    color: '#9ca3af',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    backgroundColor: '#fff',
  },
  checkboxBoxChecked: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchLabel: {
    fontSize: 14,
    color: '#374151',
  },
  optionTrigger: {
    minHeight: 44,
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  optionTriggerValue: {
    fontSize: 14,
    color: '#111827',
  },
  optionTriggerPlaceholder: {
    fontSize: 14,
    color: '#9ca3af',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    maxHeight: '70%',
    borderRadius: 14,
    backgroundColor: '#fff',
    paddingVertical: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  optionRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionRowSelected: {
    backgroundColor: '#eff6ff',
  },
  optionLabel: {
    fontSize: 14,
    color: '#374151',
  },
  optionLabelSelected: {
    color: '#1d4ed8',
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  otpInput: {
    width: 44,
    height: 52,
    borderWidth: 1.5,
    borderRadius: 8,
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    backgroundColor: '#fff',
  },
});
