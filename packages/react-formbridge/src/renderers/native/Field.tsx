import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  type StyleProp,
  Switch,
  Text,
  TextInput,
  type TextInputProps,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';

import type {
  ExtraFieldProps,
  FieldDescriptor,
  FieldRenderProps,
  FocusableFieldHandle,
  NativeFieldUiOverrides,
  SelectOption,
  SelectPickerRenderContext,
} from '../../types';
import {
  defaultErrorChromeStyle,
  defaultErrorTextStyle,
  defaultRequiredMarkStyle,
  type NativeTextFieldDescriptorWebLike,
  shouldHighlightOnError,
  sx,
} from './shared';

interface Props extends FieldRenderProps<unknown> {
  descriptor: FieldDescriptor<unknown> & NativeTextFieldDescriptorWebLike;
  extra?: ExtraFieldProps<NativeFieldUiOverrides, 'native'>;
  registerFocusable?: (target: FocusableFieldHandle | null) => void;
}

const defaultOptionModalBackdropStyle: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  padding: 20,
  backgroundColor: 'rgba(15, 23, 42, 0.42)',
};

const defaultOptionModalCardStyle: ViewStyle = {
  width: '100%',
  maxHeight: '72%',
  borderRadius: 18,
  backgroundColor: '#ffffff',
  padding: 16,
  gap: 10,
};

const defaultOptionRowStyle: ViewStyle = {
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 12,
};

const defaultOptionLabelStyle: TextStyle = {
  fontSize: 15,
  color: '#0f172a',
};

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
        style={sx(defaultOptionModalBackdropStyle, ui?.styles?.modalBackdrop)}
        onPress={onClose}
      >
        <Pressable
          style={sx(defaultOptionModalCardStyle, ui?.styles?.modalCard)}
          onPress={(event) => event.stopPropagation()}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#0f172a' }}>
            {title}
          </Text>

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
                  style={sx(defaultOptionRowStyle, ui?.styles?.optionRow)}
                >
                  <Text style={sx(defaultOptionLabelStyle, ui?.styles?.optionLabel)}>
                    {selected ? `✓ ${option.label}` : option.label}
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

export const NativeField: React.FC<Props> = ({
  descriptor: d,
  extra,
  registerFocusable,
  ...p
}) => {
  const native = d._ui ?? {};

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
    renderPicker,
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

  const id = extra?.id ?? native.id ?? p.name;
  const hasError = Boolean(p.error);
  const highlightOnError = shouldHighlightOnError(
    extra?.highlightOnError,
    native.highlightOnError,
  );
  const controlErrorStyle = defaultErrorChromeStyle(hasError, highlightOnError);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const otpRefs = useRef<Array<TextInput | null>>([]);
  const pickerRenderer = renderPicker ?? native.renderPicker;

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

  const clearPickerSearch = useCallback(() => {
    setPickerSearch('');
  }, []);

  const closePicker = useCallback(() => {
    setPickerOpen(false);
    clearPickerSearch();
  }, [clearPickerSearch]);

  const openPicker = useCallback(() => {
    if (p.disabled) return;

    setPickerOpen(true);
    p.onFocus();
  }, [p.disabled, p.onFocus]);

  const selectPickerOption = useCallback(
    (next: SelectOption | SelectOption['value']) => {
      const value =
        typeof next === 'object' && next !== null && 'value' in next ? next.value : next;

      p.onChange(value);
      closePicker();
      p.onBlur();
    },
    [closePicker, p.onBlur, p.onChange],
  );

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

  useEffect(() => {
    if ((d._type !== 'select' && d._type !== 'radio') || !registerFocusable) {
      return;
    }

    registerFocusable({
      focus: openPicker,
      blur: closePicker,
    });

    return () => {
      registerFocusable(null);
    };
  }, [closePicker, d._type, openPicker, registerFocusable]);

  const requiredMark = renderRequiredMark?.() ?? (
    <Text style={sx(defaultRequiredMarkStyle(), styles?.requiredMark)}>*</Text>
  );

  const renderLabelNode = () => {
    if (hideLabel) return null;

    if (renderLabel) {
      return renderLabel({
        id,
        label: p.label,
        required: Boolean(d._required),
        name: p.name,
      });
    }

    if (d._type === 'checkbox') {
      return null;
    }

    return (
      <Text
        style={sx(styles?.label, labelPropsStyle)}
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
        renderError?.({ id, name: p.name, error: p.error }) ?? (
          <Text
            style={sx(defaultErrorTextStyle(true), styles?.error, errorPropsStyle)}
            {...errorPropsRest}
          >
            {p.error}
          </Text>
        )
      );
    }

    if (p.hint) {
      return (
        renderHint?.({ id, name: p.name, hint: p.hint }) ?? (
          <Text
            style={sx(styles?.hint, hintPropsStyle)}
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
            ref={registerFocusable}
            value={getStringValue(p.value)}
            placeholder={p.placeholder}
            multiline
            textAlignVertical="top"
            style={sx(styles?.input, inputPropsStyle)}
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
            style={sx(styles?.checkboxRow)}
            accessibilityRole="checkbox"
            accessibilityState={{
              checked: Boolean(p.value),
              disabled: Boolean(p.disabled),
            }}
          >
            <View style={sx(controlErrorStyle, styles?.checkboxBox)} />
            <Text style={sx(styles?.checkboxLabel)}>
              {p.label}
              {d._required && requiredMark}
            </Text>
          </Pressable>
        );

      case 'switch':
        return (
          <View>
            <Switch
              value={Boolean(p.value)}
              onValueChange={(value) => p.onChange(value)}
              disabled={p.disabled}
            />
            <Text>
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
              style={sx(controlErrorStyle, styles?.optionTrigger)}
            >
              <Text>
                {getSelectedLabel(d._options, p.value) ||
                  p.placeholder ||
                  `Select ${p.label}`}
              </Text>
            </Pressable>

            {pickerRenderer ? (
              pickerRenderer(pickerContext)
            ) : (
              <OptionPicker
                visible={pickerOpen}
                title={String(p.label)}
                options={d._options ?? []}
                selectedValue={p.value}
                onClose={closePicker}
                onSelect={(value) => p.onChange(value)}
                ui={extra}
              />
            )}
          </>
        );
      case 'otp': {
        const length = d._otpLength ?? 6;
        const chars = getStringValue(p.value).split('');

        return (
          <View style={sx(styles?.otpContainer)}>
            {Array.from({ length }, (_, index) => ({
              key: `${id}-otp-${index}`,
              index,
            })).map(({ key, index }) => (
              <TextInput
                key={key}
                ref={(node) => {
                  otpRefs.current[index] = node;
                  if (index === 0) {
                    registerFocusable?.(node);
                  }
                }}
                value={chars[index] ?? ''}
                maxLength={1}
                keyboardType="number-pad"
                textAlign="center"
                style={sx(controlErrorStyle, styles?.otpInput)}
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
            ref={registerFocusable}
            value={getStringValue(p.value)}
            placeholder={p.placeholder}
            style={sx(controlErrorStyle, styles?.input, inputPropsStyle)}
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
            ref={registerFocusable}
            value={getStringValue(p.value)}
            placeholder={p.placeholder ?? 'YYYY-MM-DD'}
            style={sx(controlErrorStyle, styles?.input, inputPropsStyle)}
            onChangeText={(value) => p.onChange(value)}
            {...commonInputProps}
          />
        );

      default:
        return (
          <TextInput
            nativeID={id}
            ref={registerFocusable}
            value={getStringValue(p.value)}
            placeholder={p.placeholder}
            style={sx(controlErrorStyle, styles?.input, inputPropsStyle)}
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
      style={sx(extra?.style as StyleProp<ViewStyle>, styles?.root, rootPropsStyle)}
      {...rootPropsRest}
    >
      {renderLabelNode()}
      {renderInput()}
      {renderMeta()}
    </View>
  );
};
